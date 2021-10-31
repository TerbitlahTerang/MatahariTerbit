import React from 'react';
import logo from './logo.svg';
import './App.css';
import InputForm from "./InputForm";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          Matahari Terbit
        </h1>
        { InputForm() }
      </header>
    </div>
  );
}

export default App;
