import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { ProgressBar } from 'react-bootstrap';
import { useState } from 'react';

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
        this.iterations;
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

function SimModal(props) {
    return (
      <Modal
        {...props}
        data-bs-theme="dark"
        size="xl"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton data-bs-theme="dark">
          <Modal.Title id="contained-modal-title-vcenter" data-bs-theme="dark">
            Simulator
          </Modal.Title>
        </Modal.Header>
        <Modal.Body data-bs-theme="dark">
            <ProgressBar animated now={45} />
        </Modal.Body>
        <Modal.Footer data-bs-theme="dark">
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

function Simulator(){
    
    const [modalShow, setModalShow] = useState(false);

    return (
        <>
            <Button variant="primary" onClick={() => setModalShow(true)}>
                Launch vertically centered modal
            </Button>

            <SimModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
        </>
    )
}

export default Simulator;