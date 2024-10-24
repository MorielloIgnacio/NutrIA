import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        // Expresión regular para validar el formato del email
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        // Validar los campos de email y contraseña antes de enviar
        if (!validateEmail(email)) {
            setError('Por favor, introduce un correo electrónico válido.');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        try {
            // Realizar la solicitud al backend
            const response = await axios.post('/api/login', {
                email,
                password,
            });

            // Verificar si la respuesta es exitosa
            if (response.data.success) {
                // Llamar a la función onLogin del componente padre
                onLogin();
                // Guardar el token en localStorage si es necesario
                localStorage.setItem('token', response.data.token);
            } else {
                setError('Correo electrónico o contraseña incorrectos.');
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            setError('Hubo un problema con el servidor. Intenta de nuevo más tarde.');
        }
    };

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white overflow-hidden" style={{ fontFamily: "'Work Sans', 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex h-full flex-col justify-center">
                <div className="flex justify-center py-5">
                    <div className="w-[512px] max-w-[512px] py-5 flex flex-col">
                        <div 
                            className="w-full bg-center bg-no-repeat bg-cover flex justify-end overflow-hidden bg-white rounded-xl min-h-[300px]" 
                            style={{ backgroundImage: `url('/images/Logo.png')` }} 
                        >
                        </div>
                        <h1 className="text-[#111418] text-[22px] font-bold leading-tight tracking-[-0.015em] text-center pb-3 pt-5">
                            Vamos a iniciar sesión
                        </h1>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#111418] text-base font-medium leading-normal pb-2">Correo electrónico</p>
                                    <input
                                        type="email"
                                        placeholder="ejemplo@gmail.com"
                                        className="form-input flex w-full resize-none rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </label>
                            </div>
                            <div className="flex flex-wrap items-end gap-4 px-4 py-3">
                                <label className="flex flex-col min-w-40 flex-1">
                                    <p className="text-[#111418] text-base font-medium leading-normal pb-2">Contraseña</p>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="form-input flex w-full resize-none rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border border-[#dce0e5] h-14 placeholder:text-[#637588] p-[15px] text-base"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </label>
                            </div>
                            {error && <p className="text-red-500 text-center px-4 py-2">{error}</p>}
                            <div className="flex px-4 py-3">
                                <button
                                    type="submit"
                                    className="w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#1980e6] text-white text-sm font-bold tracking-[0.015em]"
                                >
                                    <span className="truncate">Iniciar Sesión</span>
                                </button>
                            </div>
                        </form>

                        <p className="text-[#637588] text-sm text-center py-3">O inicia sesión con</p>
                        <div className="flex justify-center gap-3 px-4 py-3">
                            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold grow">
                                Facebook
                            </button>
                            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold grow">
                                Apple
                            </button>
                            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold grow">
                                Google
                            </button>
                            <button className="flex cursor-pointer items-center justify-center rounded-xl h-10 px-4 bg-[#f0f2f4] text-[#111418] text-sm font-bold grow">
                                Twitter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
