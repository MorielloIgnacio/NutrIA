import React, { useState } from 'react';
import Form from './Form';
import PlanResult from './PlanResult';

const App = () => {
  const [plan, setPlan] = useState(null);

  console.log('Estado del plan en App:', plan);  // Verificar el estado del plan

  return (
    <div className="app-container">
      <h1>NutriIA - Plan Personalizado</h1>
      <Form setPlan={setPlan} />

      {/* Renderizar PlanResult si hay un plan */}
      {plan && <PlanResult plan={plan} />}
    </div>
  );
};

export default App;



