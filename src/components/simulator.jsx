import React from 'react';
import { Card } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import './sim.css';
import { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';

class noisyChannel{
    constructor(percentage){
        this.percentage = percentage;
        this.timesHit = 0;
    }
    //Quote from the project sheet:
    /*
    The noisy channel randomly flips one bit in N% of the transmissions, 
    where N is an input variable.
    */
    // keyword: ONE BIT
    // So passthrough will only change one bit
    passthrough(m){
        var arr = Array.from(m);
        const randomNumber = Math.floor(Math.random() * 101); // Generate random number between 0-100
        if (randomNumber < this.percentage || this.percentage == 100) {
            const randomIndex = Math.floor(Math.random() * arr.length); // Select random index
            const randomElement = arr[randomIndex]; // Get the element at the random index

            if (arr[9] === 0){ this.timesHit++ } // just for stats
            if (randomElement === 0) {
                arr[randomIndex] = 1; // Flip 0 to 1
            } else if (randomElement === 1) {
                arr[randomIndex] = 0; // Flip 1 to 0
            } else if (randomElement >= 2 && randomElement <= 9) {
                // 50% chance of either adding 1 or subtracting 1
                arr[randomIndex] += Math.random() < 0.5 ? 1 : -1;
            }
        }
        else { console.log("nah lol") }
        return arr;
    }
}

class Channel{
    checksum(m){
        var msg = Array.from(m)
        let sum = msg.reduce((acc, bit) => acc + bit, 0); // Sum all bits in the data
        return sum % 10;
    }
}

class Transmitter extends Channel{
    constructor(bits){
        super();
        this.bits = bits;
    }

    createMessage(){
        var dataAmount = this.bits - 2;
        var message = new Array();
        for (var i = 0; i < dataAmount; i++){
            message.push(Math.round(Math.random()))
        }
        message.push(this.checksum(message))
        message.push(0)
        this.message = message;
        return message;
    }
}

class Receiver extends Channel{
    constructor(){
        super();
    }

    returnMessage(m){ // 'recieves' and returns the message with the new checksum and flipped ack digit
        var message = Array.from(m);
        if (m[9] === 1){
            // ack digit came in wrong so we ignore
            return null;
        }
        if (this.checksum(m.slice(0,8)) === m[8]){
            //the checksum is right so we ignore
            return null;
        }

        message[9] = 1; // Flip ack digit
        message[8] = this.checksum(message.slice(0, 8)) + 1;
        return message;
    }
}

class ChannelSimulator{
    evaluator = {
        trueCorrect: 0,
        trueIncorrect: 0,
        falseCorrect: 0,
        falseIncorrect: 0,
        completeFails: 0,
        runs: 0,
        messagesSent: 0
    }
    constructor(tx, rx, noise, iterations, callback){
        this.tx = tx;
        this.rx = rx;
        this.noise = noise;
        this.iterations = iterations;
        // for refreshing component
        this.updateStateCallback = callback;
    }

    async simulate(){
        for (var t=0; t<this.iterations; t++){
            await new Promise(r => setTimeout(r, 1)); // sleep for 1ms
            if (this.updateStateCallback) { this.updateStateCallback() }
            //console.log("run %d", this.evaluator.runs);
            const ogMessage = Object.freeze(this.tx.createMessage());
            var garbled = this.noise.passthrough(ogMessage);
            var returned = this.rx.returnMessage(garbled);
            if (returned == null){
                console.log("ogMessage:       " + ("(" + ogMessage.join(", ") + ")") + "\nfirst garble:    " + ("(" + garbled.join(", ") + ")"));
                // either the checksum was met and it didn't have to send back, or
                // the ack digit was wrong so it never 'recieved' it
                if (ogMessage[8] === garbled[8] && Array.from(ogMessage)[9] === Array.from(garbled)[9]){
                    // this means the checksum was met & ack was right so RX didnt respond
                    // was the message the same though?
                    if (Array.from(ogMessage).slice(0, 8).every((value, index) => value === Array.from(garbled).slice(0,8)[index])){
                        // it WAS the same
                        this.evaluator.trueCorrect++;
                        this.evaluator.runs++;
                        console.log("trueCorrect (RX recieved correct checksum)")
                        continue;
                    }
                    // it was NOT the same
                    this.evaluator.falseCorrect++;
                    this.evaluator.runs++;
                    console.log("falseCorrect (RX recieved correct checksum but wasnt actually correct)")
                    continue;
                }
                else {
                    // this means that the ack digit was recieved wrong, sooo we're gonna retrasmit
                    this.evaluator.completeFails++;
                    this.evaluator.runs++;
                    console.log("complete fail, RX recieved wrong ack");
                    continue;
                }
            }
            const returnedMessage = this.noise.passthrough(returned);
            if (returnedMessage[9] === 0){
                // because the ack is not 1, the TX channel wouldnt see it, as per instructions: 
                // "If Tx/Rx does not receive a proper Ack after a set period of time, it retransmits the previous signal."
                // Because time is mostly irrelevant here, we will retransmit
                console.log("complete fail bc tx cant see returned msg")
                this.evaluator.completeFails++;
                this.evaluator.runs++;
                continue;
            }
            const startMsg = Array.from(ogMessage);
            startMsg[9] = 1;
            if (
                startMsg.every((value, index) => value === returnedMessage[index]) &&
                startMsg.every((value, index) => value === garbled[index])
            ) { // trueCorrect
                this.evaluator.trueCorrect++;
                this.evaluator.runs++;
                console.log("true correct");
            } else if (
                startMsg.every((value, index) => value === returnedMessage[index]) &&
                !startMsg.every((value, index) => value !== garbled[index])
            ) {
                this.evaluator.falseCorrect++;
                this.evaluator.runs++;
                console.log("false correct");
            } else if (
                !startMsg.every((value, index) => value !== returnedMessage[index]) &&
                !startMsg.every((value, index) => value !== garbled[index])
            ) { // trueIncorrect
                this.evaluator.trueIncorrect++;
                this.evaluator.runs++;
                console.log("true incorrect");
            } else if (
                !startMsg.every((value, index) => value !== returnedMessage[index]) &&
                startMsg.every((value, index) => value === garbled[index])
            ) { // falseIncorrect
                this.evaluator.falseIncorrect++;
                this.evaluator.runs++;
                console.log("false incorrect");
            } else {
                console.log("something went wrong");
            }
            console.log("ogMessage:       " + ("(" + ogMessage.join(", ") + ")") + "\nfirst garble:    " + ("(" + garbled.join(", ") + ")") + "\nreturnedMessage: " + ("(" + returnedMessage.join(", ") + ")"))
            continue;
        }
        this.evaluator.messagesSent = this.evaluator.runs * 2;
        return;
    }
}

class Simulator extends Component {
    state = {
        iters: 100,
        noisePercentage: 0,
        doingSim: false,
        fadeIn: false,
        channelSim: new ChannelSimulator()

    }

    constructor() {
        super();
        this.simRef = React.createRef();
        this.handleRangeChange = this.handleRangeChange.bind(this);
        this.tx = new Transmitter(10),
        this.rx = new Receiver(10),
        this.nx = new noisyChannel(this.state.noisePercentage);
    }

    updateStateCallback = () => {
        this.setState(prevState => ({
            channelSim: {
                ...prevState.channelSim,
            }
        }));
    }


    handleButton = (e) => {
        this.state.channelSim = new ChannelSimulator(
            this.tx, 
            this.rx, 
            this.nx, 
            this.state.iters,
            this.updateStateCallback
        );
        this.nx.percentage = this.state.noisePercentage;
        this.nx.timesHit = 0;
        this.setState({ doingSim: true });

        if (!this.state.fadeIn) {
            this.setState({ fadeIn: true });
        }
        console.log('starting');

        this.state.channelSim.simulate(this.state.channelSim.updateStateCallback).then(() => {
            console.log('finished');
            this.setState({ doingSim: false });
        });
        // this.state.channelSim.simulate()
        // this.setState({doingSim: false});
        // console.log("finished");
    }

    handleRangeChange(e) {
        this.setState({ noisePercentage: e.target.value });
    }

    render() {
        const { noisePercentage, doingSim, fadeIn } = this.state;

        return (
            <div>
                <Form className='simForm'>
                    <Form.Group controlId='noisePercentage'>
                        <Form.Label className='simFormLabel'>Noise Percentage <Badge bg="free-palestine">{noisePercentage}%</Badge></Form.Label>
                        <Form.Range data-bs-theme="dark" value={noisePercentage} onChange={this.handleRangeChange} disabled={doingSim} />
                    </Form.Group>
                </Form>
                <Button className='simButton' size='lg' onClick={this.handleButton} disabled={doingSim}>Run Simulation</Button>
                <Card className={fadeIn ? 'simFadeIn' : 'simInvis'} border={doingSim ? 'warning' : 'success'} style={{ width: '35rem' }} data-bs-theme="dark">
                    <Card.Header>Simulator <Badge bg={doingSim ? 'warning' : 'success'}> Run #{this.state.channelSim.evaluator.runs}</Badge></Card.Header>
                    <Card.Body>
                        <Card.Title style={{ fontSize: '15px' }}>Noise percentage: <Badge bg="primary">{noisePercentage}%</Badge>   Noise garbles: <Badge bg="secondary">{this.nx.timesHit}</Badge></Card.Title>
                        <ListGroup variant="flush" style={{ fontSize: '17px' }}>
                            <ListGroup.Item>True Correct: <Badge bg="secondary">{this.state.channelSim.evaluator.trueCorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>True Incorrect: <Badge bg="secondary">{this.state.channelSim.evaluator.trueIncorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>False Correct: <Badge bg="secondary">{this.state.channelSim.evaluator.falseCorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>False Incorrect: <Badge bg="secondary">{this.state.channelSim.evaluator.falseIncorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>Transmission fails: <Badge bg="secondary">{this.state.channelSim.evaluator.completeFails}</Badge></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Simulator;