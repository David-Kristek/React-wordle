import "./App.css";
import Wordle from "./Components/Wordle";
import { WordleProvider } from "./context/WordleContext";

function App() {
  return (
    <div className="App">
      <h1>Wordle (Lingo)</h1>
      <WordleProvider>
        <Wordle />
      </WordleProvider>
    </div>
  );
}

export default App;
