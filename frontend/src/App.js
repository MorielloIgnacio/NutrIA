import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Form from './components/Form';
import NutritionPlan from './components/NutritionPlan';
import DayPlan from './components/DayPlan';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Estado de autenticación
    const [hasPlan, setHasPlan] = useState(false); // Estado que indica si el usuario tiene un plan
    const [plan, setPlan] = useState(null); // Estado del plan nutricional
    const [currentDay, setCurrentDay] = useState(null); // Estado para gestionar el día actual

    useEffect(() => {
        // Verificar si el usuario tiene un plan cuando se autentica
        if (isAuthenticated) {
            const checkUserPlan = async () => {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/check-plan', {
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        setHasPlan(data.hasPlan);
                        if (data.hasPlan) {
                            setPlan(data.plan);
                        }
                    } else {
                        const text = await response.text();
                        console.error('Respuesta no JSON recibida:', text);
                    }
                } catch (error) {
                    console.error('Error al verificar el plan del usuario:', error);
                }
            };
            
            checkUserPlan();
        }
    }, [isAuthenticated]);

    const handleLogin = () => {
        setIsAuthenticated(true); // Cambia el estado a autenticado cuando el usuario inicie sesión
    };

    const handleStartFirstDay = () => {
        setCurrentDay(1); // Iniciar el primer día del plan
    };

    const handleEndDay = () => {
        setCurrentDay(null); // Volver a la vista general después de completar un día
    };

    const handleDeletePlan = async () => {
        try {
            await fetch('http://127.0.0.1:8000/api/reset-plan', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (error) {
            console.error('Error al eliminar el plan:', error);
        } finally {
            setPlan(null);
            setHasPlan(false);
        }
    };

    return (
        <div className="App">
            {isAuthenticated && <Navbar />}

            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />
            ) : currentDay ? (
                <DayPlan dayNumber={currentDay} onEndDay={handleEndDay} />
            ) : hasPlan ? (
                <NutritionPlan plan={plan} onStartFirstDay={handleStartFirstDay} onDeletePlan={handleDeletePlan} />
            ) : (
                <Form setPlan={setPlan} setHasPlan={setHasPlan} /> // Asegúrate de pasar setHasPlan como prop
            )}
        </div>
    );
};

export default App;
