import React, { useState } from 'react';
import Login from './components/Login';
import Form from './components/Form';
import NutritionPlan from './components/NutritionPlan';
import DayPlan from './components/DayPlan';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
    const [plan, setPlan] = useState(null);  // Estado del plan nutricional
    const [currentDay, setCurrentDay] = useState(null);  // Estado para gestionar el día actual

    const handleLogin = () => {
        setIsAuthenticated(true);  // Cambia el estado a autenticado cuando el usuario inicie sesión
    };

    const handleStartFirstDay = () => {
        setCurrentDay(1);  // Iniciar el primer día del plan
    };

    const handleEndDay = () => {
        setCurrentDay(null);  // Volver a la vista general después de completar un día
    };

    return (
        <div className="App">
            {isAuthenticated && <Navbar />}

            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : currentDay ? (
                <DayPlan dayNumber={currentDay} onEndDay={handleEndDay} />
            ) : plan ? (
                <NutritionPlan plan={plan} onStartFirstDay={handleStartFirstDay} />
            ) : (
                <Form setPlan={setPlan} />
            )}
        </div>
    );
};

export default App;

