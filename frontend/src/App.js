// src/App.js
import React, { useState } from 'react';
import Form from './components/Form';
import PlanResult from './components/PlanResult';
import './styles/styles.css';

const App = () => {
  const [plan, setPlan] = useState(null);

  return (
    <div className="app-container">
      <h1>NutrIA - Personaliza tu Plan de Ejercicio</h1>
      <Form setPlan={setPlan} />
      {plan && <PlanResult plan={plan} />}
    </div>
  );
};

export default App;
