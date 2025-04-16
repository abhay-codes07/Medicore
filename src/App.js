import React from 'react';
import PatientForm from './pages/PatientForm';
import OllamaStatusButton from './components/OllamaStatusButton';
import "tailwindcss/tailwind.css";
import "./App.css"; // Import custom CSS

function App() {
  return (
    <div className="App">
      <PatientForm />
      <OllamaStatusButton />
    </div>
  );
}

export default App;

