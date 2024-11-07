// frontend/src/components/Form.js
import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ setPlan }) => {
  // Estados para todos los campos del formulario
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [routinePreference, setRoutinePreference] = useState('');
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [equipmentAvailable, setEquipmentAvailable] = useState([]);
  const [mealsPerDay, setMealsPerDay] = useState(3);

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({}); // Estado de errores

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    // Validaciones para los campos requeridos
    if (!weight || isNaN(weight) || weight < 20 || weight > 500) {
      newErrors.weight = 'El peso debe estar entre 20 kg y 500 kg';
    }
    if (!height || isNaN(height) || height < 50 || height > 300) {
      newErrors.height = 'La altura debe estar entre 50 cm y 300 cm';
    }
    if (!age || isNaN(age) || age < 10 || age > 120) {
      newErrors.age = 'La edad debe estar entre 10 y 120 años';
    }
    if (!gender) {
      newErrors.gender = 'Selecciona un género';
    }
    if (!activityLevel) {
      newErrors.activityLevel = 'Selecciona un nivel de actividad';
    }
    if (!fitnessGoal) {
      newErrors.fitnessGoal = 'Selecciona un objetivo de fitness';
    }
    if (!routinePreference) {
      newErrors.routinePreference = 'Selecciona una preferencia de rutina de ejercicio';
    }
    if (isNaN(mealsPerDay) || mealsPerDay < 1 || mealsPerDay > 6) {
      newErrors.mealsPerDay = 'El número de comidas por día debe estar entre 1 y 6';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const userData = {
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        gender,
        activity_level: activityLevel,
        fitness_goal: fitnessGoal,
        routine_preference: routinePreference,
        dietary_preferences: dietaryPreferences,
        equipment_available: equipmentAvailable,
        meals_per_day: parseInt(mealsPerDay),
      };

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:8000/generate_plan/', userData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPlan(response.data);
      } catch (error) {
        console.error('Error al obtener el plan:', error);
      }
    }
  };
  // Manejar cambios en las preferencias dietéticas
  const handleDietaryPreferenceChange = (value) => {
    if (value === 'no_dietary_preference') {
      // Si selecciona "Sin preferencias dietéticas", desmarcamos todas las demás opciones
      setDietaryPreferences(
        dietaryPreferences.includes('no_dietary_preference') 
          ? [] // Si estaba seleccionada, la quitamos
          : ['no_dietary_preference'] // Si no estaba seleccionada, la agregamos y quitamos otras
      );
    } else {
      // Si selecciona alguna otra opción, eliminamos "Sin preferencias dietéticas" y alternamos la opción seleccionada
      setDietaryPreferences((prevPreferences) => {
        const updatedPreferences = prevPreferences.filter(
          (pref) => pref !== 'no_dietary_preference' // Removemos "Sin preferencias dietéticas"
        );
        return updatedPreferences.includes(value)
          ? updatedPreferences.filter((pref) => pref !== value) // Quitamos la opción si ya está seleccionada
          : [...updatedPreferences, value]; // Agregamos la opción si no está seleccionada
      });
    }
  };
  // Manejar cambios en los checkboxes
  const handleCheckboxChange = (setState, value, state) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
    } else {
      setState([...state, value]);
    }
  };

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 4));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));

  // Opciones para los select y checkboxes
  const activityLevelOptions = [
    { label: 'Sedentario', value: 'sedentary' },
    { label: 'Ligeramente activo', value: 'lightly_active' },
    { label: 'Moderadamente activo', value: 'moderately_active' },
    { label: 'Muy activo', value: 'very_active' },
    { label: 'Súper activo', value: 'super_active' },
  ];

  const fitnessGoalOptions = [
    { label: 'Perder peso', value: 'lose_weight' },
    { label: 'Ganar masa muscular', value: 'gain_muscle' },
    { label: 'Mantener peso', value: 'maintain' },
  ];

  const routinePreferenceOptions = [
    { label: 'Ejercicio en casa', value: 'home' },
    { label: 'Ejercicio al aire libre', value: 'outdoor' },
    { label: 'Ejercicio en el gimnasio', value: 'gym' },
    { label: 'No estoy seguro', value: 'unsure' },
  ];

  const dietaryOptions = [
    { label: 'Vegetariano', value: 'vegetarian' },
    { label: 'Vegano', value: 'vegan' },
    { label: 'Sin gluten', value: 'gluten_free' },
    { label: 'Sin lactosa', value: 'lactose_free' },
    { label: 'Paleo', value: 'paleo' },
    { label: 'Cetogénica', value: 'keto' },
    { label: 'Sin preferencias dietéticas', value: 'no_dietary_preference' }, // Nueva opción

  ];


  const equipmentOptions = [
    { label: 'Peso corporal', value: 'body weight' },
    { label: 'Mancuernas', value: 'dumbbells' },
    { label: 'Bandas de resistencia', value: 'resistance band' },
    { label: 'Barra', value: 'barbell' },
    { label: 'Máquinas de gimnasio', value: 'machine' },
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-white font-['Noto_Sans', 'Work_Sans', sans-serif]">
      <form onSubmit={handleSubmit} className="w-[512px] max-w-full p-8 bg-white rounded-lg shadow-md">
        {/* Paso 0: Datos Personales */}
        {step === 0 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Datos Personales</h3>
            {/* Peso */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Peso (kg)</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
                {errors.weight && <p style={{ color: 'red' }}>{errors.weight}</p>}
              </label>
            </div>
            {/* Altura */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Altura (cm)</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
                {errors.height && <p style={{ color: 'red' }}>{errors.height}</p>}
              </label>
            </div>
            {/* Edad */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Edad</span>
                <input
                  type="number"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
                {errors.age && <p style={{ color: 'red' }}>{errors.age}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Paso 1: Información adicional */}
        {step === 1 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Información adicional</h3>
            {/* Género */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Género</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                </select>
                {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
              </label>
            </div>
            {/* Nivel de actividad */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Nivel de actividad</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {activityLevelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.activityLevel && <p style={{ color: 'red' }}>{errors.activityLevel}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Paso 2: Preferencias alimenticias */}
        {step === 2 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Preferencias alimenticias</h3>
            {/* Preferencias dietéticas */}
            <div className="flex gap-3 p-3 flex-wrap">
              {dietaryOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCheckboxChange(setDietaryPreferences, option.value, dietaryPreferences)}
                  className={`cursor-pointer flex h-8 items-center justify-center gap-x-2 rounded-xl px-4 ${
                    dietaryPreferences.includes(option.value) ? 'bg-[#1980e6] text-white' : 'bg-[#f0f2f4] text-[#111418]'
                  }`}
                >
                  <p className="text-sm font-medium">{option.label}</p>
                </div>
              ))}
            </div>
            {/* Número de comidas por día */}
            <div className="px-4 py-3 mt-4">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Número de comidas por día</span>
                <input
                  type="number"
                  min="1"
                  max="6"
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={mealsPerDay}
                  onChange={(e) => setMealsPerDay(e.target.value)}
                  required
                />
                {errors.mealsPerDay && <p style={{ color: 'red' }}>{errors.mealsPerDay}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Paso 3: Equipamiento disponible */}
        {step === 3 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Equipamiento Disponible</h3>
            <div className="flex gap-3 p-3 flex-wrap">
              {equipmentOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleCheckboxChange(setEquipmentAvailable, option.value, equipmentAvailable)}
                  className={`cursor-pointer flex h-8 items-center justify-center gap-x-2 rounded-xl px-4 ${
                    equipmentAvailable.includes(option.value) ? 'bg-[#1980e6] text-white' : 'bg-[#f0f2f4] text-[#111418]'
                  }`}
                >
                  <p className="text-sm font-medium">{option.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 4: Preferencia de rutina y objetivo de fitness */}
        {step === 4 && (
          <div>
            <h3 className="text-2xl font-bold leading-tight pb-2">Preferencias de Ejercicio y Objetivos</h3>
            {/* Preferencia de rutina */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Preferencia de rutina de ejercicio</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={routinePreference}
                  onChange={(e) => setRoutinePreference(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {routinePreferenceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.routinePreference && <p style={{ color: 'red' }}>{errors.routinePreference}</p>}
              </label>
            </div>
            {/* Objetivo de fitness */}
            <div className="px-4 py-3">
              <label className="block pb-2">
                <span className="text-base font-medium text-[#111418]">Objetivo de Fitness</span>
                <select
                  className="form-input w-full mt-1 p-3 border rounded-xl h-14 border-[#dce0e5] text-[#111418]"
                  value={fitnessGoal}
                  onChange={(e) => setFitnessGoal(e.target.value)}
                  required
                >
                  <option value="">Seleccionar</option>
                  {fitnessGoalOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.fitnessGoal && <p style={{ color: 'red' }}>{errors.fitnessGoal}</p>}
              </label>
            </div>
          </div>
        )}

        {/* Botones de navegación */}
        <div className="flex justify-between mt-6">
          {step > 0 && (
            <button
              type="button"
              className="bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={prevStep}
            >
              Anterior
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
              onClick={nextStep}
            >
              Siguiente
            </button>
          ) : (
            <button
              type="submit"
              className="bg-green-500 text-white font-bold py-2 px-4 rounded"
            >
              Finalizar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Form;