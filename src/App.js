import './App.css';
import NoisyNavBar from './components/navbar';
import Simulator from './components/simulator';

function App() {
  return (
    <div className="App">
      <NoisyNavBar />
      <header className="App-header">
        <Simulator/>
      </header>
    </div>
  );
}

export default App;
