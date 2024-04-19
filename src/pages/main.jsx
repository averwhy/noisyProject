import './Main.css';
import NoisyNavBar from '../components/navbar';
import Simulator from '../components/simulator';
import Spinner from 'react-bootstrap/Spinner';

function Main() {
  return (
    <div className="App">
      <NoisyNavBar />
      <header className="App-header">
        <Simulator/>
      </header>
    </div>
  );
}

export default Main;
