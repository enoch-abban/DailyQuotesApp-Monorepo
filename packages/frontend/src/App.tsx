// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import DarkMode from "./react-dark-mode/src/DarkMode";
import { QueryPayload } from '@dqa/shared-data';
import LoginPage from './pages/LoginPage';
import Button from './components/Button';

function App() {
  return (
    <div className="App">
      {/* <DarkMode /> */}
      <LoginPage />
      { /* NEW Example to call endpoints */ }
        {/* <Button text="GET SOME DATA" onClick={() => {
            fetch("http://localhost:3001/", {})
              .then((response) => response.json())
              .then((data: QueryPayload) => console.log(data.payload));
          }} variant="primary" /> */}
      
    </div>
  );
}

export default App;
