import Container from 'react-bootstrap/Container';
//import ProgressBar from 'react-bootstrap/ProgressBar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class Channel{
    constructor(bits){
        this.bits = bits;
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