import Container from 'react-bootstrap/Container';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class noisyChannel{
    constructor(percentage){
        this.percentage = percentage;
    }

    passthrough(message){
        // garble message based on percentage
    }
}

class Channel{
    constructor(bits){
        this.bits = bits;
    }

    checksum(msg){
        var checksum = msg[0]; // Initialize checksum with the first bit
        // XOR the checksum with each subsequent bit
        for (var i = 1; i < msg.length; i++) {
            checksum  ^= msg[i];
        }
        return checksum;
    }

    createMessage(){
        var dataAmount = this.bits - 2;
        var message = [];
        for (var i = 0; i < dataAmount; i++){
            message.push(Math.round(Math.random()))
        }
        message.push(this.checksum(message))
        message.push(0)
        console.log(message);
        return message;
    }
}

function Simulator(){
    const channel1 = new Channel(10);
    const channel2 = new Channel(10);
    const noise = new noisyChannel(); // TODO: pass user given percentage in
    
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>WIP ({new Channel(10).createMessage().toString()})</Col>
                </Row>
            </Container>
        </div>
    )
}

export default Simulator;