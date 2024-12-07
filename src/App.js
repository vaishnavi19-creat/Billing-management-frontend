import './App.css';
import {BrowserRouter} from 'react-router-dom';
import SuperadminBase from './Components/SuperadminComponents/SuperadminBase';

function App() {

  return (
    <>
    <BrowserRouter>
      <SuperadminBase />
    </BrowserRouter>
    </>
  );
}

export default App;
