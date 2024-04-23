import { Card } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import './sim.css';
import { Component } from 'react';

class noisyChannel{
    constructor(percentage){
        this.percentage = percentage;
    }

    passthrough(message){
        // garble message based on percentage
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
        this.message = null;
    }

    createMessage(){
        var dataAmount = this.bits - 2;
        var message = [];
        for (var i = 0; i < dataAmount; i++){
            message.push(Math.round(Math.random()))
        }
        message.push(this.checksum(message))
        message.push(0)
        this.message = message;
    }
}

class Receiver extends Channel{
    constructor(){
        super();
    }

    returnMessage(message){
        message[9] = 1; // Flip ack digit
        message[8] = this.checksum(this.recievedMsg[0, 7]);
        return message;
    }
}


class ChannelSimulator{
    constructor(tx, rx, noise, iterations){
        this.tx = tx;
        this.rx = rx;
        this.noise = noise;
        this.iterations = iterations;
    }

    simulate(){
        for (var t=0; t>this.iterations; t++){
            this.tx.createMessage();
            var garbled = this.noise.passthrough(this.tx.message);
            var returned = this.rx.returnMessage(garbled);
            var garbled = this.noise.passthrough(returned);
            // eval
        }
    }
}

class Simulator extends Component{
    state = {
        iters: 1,
        tx: new Transmitter(10),
        rx: new Receiver(10),
        nx: new noisyChannel(0),
        chSim: new ChannelSimulator(tx, rx, nx, iters),
        doingSim: false
    }

    constructor(){
        super();
        this.simRef = React.createRef();
    }

    handleButton = (e) => {
        
    }

    handleRangeChange(){
        this.setState(prevState => {
            return {
                nx: prevState.percentage = this.simRef.current.value
            }
        })
    }

    render(){
        return (
            <div>
                <Form className='simForm'>
                    <Form.Group controlId='noisePercentage'>
                        <Form.Label className='simFormLabel'>Noise Percentage</Form.Label>
                        <Form.Control ref={this.simRef}/>
                        <Form.Range data-bs-theme="dark" onChange={handleRangeChange} />
                    </Form.Group>
                </Form>
                <Button className='simButton' size='lg'>Run Simulation</Button>
                <Card border="dark" style={{ width: '35rem' }} data-bs-theme="dark">
                    <Card.Header>Simulator</Card.Header>
                    <Card.Body>
                        <Card.Title>Noise percentage: {nx.percentage}%</Card.Title>
                        <Card.Text style={{fontSize: '25px'}}>
                            Some quick example text to build on the card title and make up the
                            bulk of the card's content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}

export default Simulator;