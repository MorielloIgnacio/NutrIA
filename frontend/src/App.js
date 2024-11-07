import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Form from './components/Form';
import NutritionPlan from './components/NutritionPlan';
import DayPlan from './components/DayPlan';
import Navbar from './components/Navbar';
import ProgressForm from './components/ProgressForm';
import Modal from './components/Modal';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPlan, setHasPlan] = useState(false);
  const [plan, setPlan] = useState(null);
  const [dayNumber, setDayNumber] = useState(null);
  const [completedDays, setCompletedDays] = useState(() => {
    const storedCompletedDays = localStorage.getItem('completedDays');
    return storedCompletedDays ? JSON.parse(storedCompletedDays) : [];
  });
  const [showProgressModal, setShowProgressModal] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedPlan = localStorage.getItem('plan');

    if (token) {
      setIsAuthenticated(true);
      if (storedPlan) {
        setHasPlan(true);
        setPlan(JSON.parse(storedPlan));
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && !hasPlan) {
      const checkUserPlan = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/check-plan', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setHasPlan(data.hasPlan);
          if (data.hasPlan) {
            setPlan(data.plan);
          }
        } catch (error) {
          console.error('Error al verificar el plan del usuario:', error);
        }
      };
      checkUserPlan();
    }
  }, [isAuthenticated, hasPlan]);

  useEffect(() => {
    if (completedDays.length > 0) {
      localStorage.setItem('completedDays', JSON.stringify(completedDays));
    }
  }, [completedDays]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setHasPlan(false);
    setPlan(null);
    setDayNumber(null);
    setCompletedDays([]);
  };

  const handleStartFirstDay = () => {
    setDayNumber(1);
  };

  const handleStartDay = (day) => {
    setDayNumber(day);

    if (day % 7 === 1 && day > 7) {  // Abrir ProgressForm en el primer día de cada nueva semana
      setShowProgressModal(true);
    }
  };

  const handleEndDay = () => {
    setDayNumber(null);
  };

  const onCompleteDay = (day) => {
    setCompletedDays((prevCompletedDays) => {
      const updatedCompletedDays = [...prevCompletedDays, day];
      localStorage.setItem('completedDays', JSON.stringify(updatedCompletedDays));
      return updatedCompletedDays;
    });
  };

  const handlePlanCreated = (newPlan) => {
    setPlan(newPlan);
    setHasPlan(true);
    localStorage.setItem('plan', JSON.stringify(newPlan));
  };

  const handleDeletePlan = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reset-plan', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Limpiamos todo el localStorage para evitar datos residuales
      localStorage.clear();

      // Restablecemos el estado de la aplicación
      setPlan(null);
      setHasPlan(false);
      setCompletedDays([]);
      setDayNumber(null); // Reiniciar el día seleccionado
      
    } catch (error) {
      console.error('Error al eliminar el plan:', error);
    }
  };

  // Nueva función para procesar los datos de progreso y actualizar el plan
  const handleProgressSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://127.0.0.1:8000/update_plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedPlan = await response.json();
      setPlan(updatedPlan);
      setShowProgressModal(false);
    } catch (error) {
      console.error('Error al actualizar el plan:', error);
    }
  };

  return (
    <div className="App">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : dayNumber ? (
        <DayPlan 
          dayNumber={dayNumber} 
          setDayNumber={setDayNumber} 
          plan={plan} 
          onEndDay={handleEndDay} 
          onCompleteDay={onCompleteDay} 
        />
      ) : hasPlan ? (
        <>
          <NutritionPlan 
            plan={plan} 
            onStartFirstDay={handleStartFirstDay} 
            onStartDay={handleStartDay} 
            onDeletePlan={handleDeletePlan} 
            completedDays={completedDays} 
          />
          <Modal isOpen={showProgressModal} onClose={() => setShowProgressModal(false)}>
            <ProgressForm onProgressSubmit={handleProgressSubmit} />
          </Modal>
        </>
      ) : (
        <Form setPlan={handlePlanCreated} />
      )}
    </div>
  );
};

export default App;
