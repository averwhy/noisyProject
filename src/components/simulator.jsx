import Container from 'react-bootstrap/Container';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class noisyChannel{
    constructor(percentage){
        this.percentage = percentage;
    }
}

class Channel{
    constructor(bits){
        this.bits = bits;
    }

    checksum(msg){
        var sum = 0;
        for (var i = 0; v < this.bits-2; i++){
            sum += parseInt(msg[i]);
        }
        return sum % 2;
    }

    createMessage(){
        var dataAmount = this.bits - 2;
        var message = "";
        for (let i = 0; i <= dataAmount; i++){
            
        }
        return message + "0"; // add ack digit and checksum digit(?)
    }
}

function Simulator(){
    const channel1 = Channel(10);
    const channel2 = Channel(10);
    const noise = noisyChannel(); // TODO: pass user given percentage in
    
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col>WIP ({new Channel(10).createMessage()})</Col>
                </Row>
            </Container>
        </div>
    )
}

export default Simulator;