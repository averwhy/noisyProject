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
    }

    passthrough(m){
        var rand;
        var message = m;
        for (var i=0; i<message.length; i++){
            rand = Math.floor(Math.random() * 101);
            //console.log(rand + " <= " + this.percentage + " = " + (rand<=this.percentage))
            if (rand <= this.percentage){
                if (message[i] == 1){
                    message[i] = 0
                }
                else if (message[i] == 0){
                    message[i] = 1
                }
                else {
                    if (Math.floor(Math.random() * 101) > 50){ // 50% chance of checksum going up, or going down
                        message[i]++;
                    } else { message[i]-- }
                }
            } else {
                continue;
            }
        }
        return message;
    }
}

class Channel{
    checksum(msg){
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
        var message = m;
        message[9] = 1; // Flip ack digit
        message[8] = this.checksum(message.slice(0, 8));
        return message;
    }
}

class ChannelSimulator{
    evaluator = {
        trueCorrect: 0,
        trueIncorrect: 0,
        falseCorrect: 0,
        falseIncorrect: 0,
        runs: 0,
        messagesSent: 0
    }
    constructor(tx, rx, noise, iterations){
        this.tx = tx;
        this.rx = rx;
        this.noise = noise;
        this.iterations = iterations;
    }

    async simulate(){
        for (var t=0; t<this.iterations; t++){
            await new Promise(r => setTimeout(r, 1)); // sleep for 1ms
            console.log("run %d", this.evaluator.runs);
            var ogMessage = this.tx.createMessage();
            var garbled = this.noise.passthrough(ogMessage);
            var returned = this.rx.returnMessage(garbled);
            var returnedMessage = this.noise.passthrough(returned);
            console.log("ogMessage: " + ("(" + ogMessage.join(", ") + ")") + ", returnedMessage: " + ("(" + returnedMessage.join(", ") + ")"))
            if (
                ogMessage.every((value, index) => value === returnedMessage[index]) &&
                ogMessage.every((value, index) => value === garbled[index])
            ) { // trueCorrect
                this.evaluator.trueCorrect++;
                this.evaluator.runs++;
                console.log("true correct");
            } else if (
                ogMessage.every((value, index) => value === returnedMessage[index]) &&
                !ogMessage.every((value, index) => value === garbled[index])
            ) {
                this.evaluator.runs++;
                console.log("false correct");
            } else if (
                !ogMessage.every((value, index) => value === returnedMessage[index]) &&
                !ogMessage.every((value, index) => value === garbled[index])
            ) { // trueIncorrect
                this.evaluator.trueIncorrect++;
                this.evaluator.runs++;
                console.log("true incorrect");
            } else if (
                !ogMessage.every((value, index) => value === returnedMessage[index]) &&
                ogMessage.every((value, index) => value === garbled[index])
            ) { // falseIncorrect
                this.evaluator.falseIncorrect++;
                this.evaluator.runs++;
                console.log("false incorrect");
            } else {
                console.log("something went wrong");
            }
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

    handleButton = (e) => {
        this.state.channelSim = new ChannelSimulator(
            this.tx, 
            this.rx, 
            this.nx, 
            this.state.iters
        );
        this.nx.percentage = this.state.noisePercentage;
        this.setState({ doingSim: true });

        if (!this.state.fadeIn) {
            this.setState({ fadeIn: true });
        }
        console.log('starting');
        this.state.channelSim.simulate().then(() => {
            console.log('finished');
            this.setState({doingSim: false});
        })
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
                        <Form.Label className='simFormLabel'>Noise Percentage</Form.Label>
                        <Form.Range data-bs-theme="dark" value={noisePercentage} onChange={this.handleRangeChange} disabled={doingSim} />
                    </Form.Group>
                </Form>
                <Button className='simButton' size='lg' onClick={this.handleButton} disabled={doingSim}>Run Simulation</Button>
                <Card className={fadeIn ? 'simFadeIn' : 'simInvis'} border={doingSim ? 'warning' : 'success'} style={{ width: '35rem' }} data-bs-theme="dark">
                    <Card.Header>Simulator <Badge bg={doingSim ? 'warning' : 'success'}> Run #{this.state.channelSim.evaluator.runs}</Badge></Card.Header>
                    <Card.Body>
                        <Card.Title style={{ fontSize: '15px' }}>Noise percentage: <Badge bg="secondary">{noisePercentage}%</Badge></Card.Title>
                        <ListGroup variant="flush" style={{ fontSize: '17px' }}>
                            <ListGroup.Item>True Correct: <Badge bg="secondary">{this.state.channelSim.evaluator.trueCorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>True Incorrect: <Badge bg="secondary">{this.state.channelSim.evaluator.trueIncorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>False Correct: <Badge bg="secondary">{this.state.channelSim.evaluator.falseCorrect}</Badge></ListGroup.Item>
                            <ListGroup.Item>False Incorrect: <Badge bg="secondary">{this.state.channelSim.evaluator.falseIncorrect}</Badge></ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Simulator;