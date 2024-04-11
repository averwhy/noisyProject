import './About.css';
import NoisyNavBar from '../components/navbar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const source = "https://github.com/averwhy/noisyProject";

function About(){
    return (
        <div>
            <NoisyNavBar />
            <header className="App-header">
                <Container fluid="xs">
                    <Row>
                        <Col></Col>
                        <Col xs={11}>This is a group project</Col>
                        <Col></Col>
                    </Row>
                    <Row style={{fontSize:22}}>
                        <Col>Members: Avery, Ed, Kyle & Lexx</Col>
                    </Row>
                    <Row style={{fontSize:22}}>
                        <Col>MAT239, Prof. Gilbert</Col>
                    </Row>
                </Container>
                <br style={{display: 'block', margin:'50px 0'}}/> {/*i HAVE to style this because it wont work otherwise*/}
                <Card bg='dark' text='light' style={{width: '20rem'}}>
                    <Card.Body>
                        <Card.Img variant="top" src="https://opengraph.githubassets.com/47e3b37c90e7657dcca45a3799d460b71f5621b1114bdbfe0cce7824c82561eb/averwhy/noisyProject/100px180"/>
                        <Card.Text>Source Code</Card.Text>
                        <Card.Title> {/* really dont know why i have to swap these but */}
                            The source code to the website can be found here. It uses the MIT license.
                        </Card.Title>
                        <Button variant="primary" onClick={() => window.open(source, '_blank')}>Check it out</Button>
                    </Card.Body>
                </Card>
            </header>    
        </div>
    )
}

export default About;