import React, { useState } from 'react';
import Login from './components/Login';
import Form from './components/Form';
import NutritionPlan from './components/NutritionPlan';
import Navbar from './components/Navbar';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
    const [plan, setPlan] = useState(null);  // Estado del plan nutricional

    const handleLogin = () => {
        setIsAuthenticated(true);  // Cambia el estado a autenticado cuando el usuario inicie sesión
    };

    return (
        <div className="App">
            {/* Mostrar la barra de navegación solo si el usuario está autenticado */}
            {isAuthenticated && <Navbar />}
            
            {/* Controlamos el flujo dependiendo del estado de autenticación */}
            {!isAuthenticated ? (
                <Login onLogin={handleLogin} />  // Si no está autenticado, mostramos el login
            ) : plan ? (
                <NutritionPlan plan={plan} />  // Si está autenticado y hay un plan, mostramos el plan
            ) : (
                <Form setPlan={setPlan} />  // Si está autenticado pero no hay plan, mostramos el formulario
            )}
        </div>
    );
};

export default App;
