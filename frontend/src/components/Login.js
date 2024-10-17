import React, { useState } from 'react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Simular autenticación por ahora
        if (email && password) {
            onLogin();
        } else {
            alert("Por favor ingrese sus credenciales.");
        }
    };

    return (
        <div className="relative flex size-full min-h-screen flex-col bg-white overflow-hidden" style={{ fontFamily: "'Work Sans', 'Noto Sans', sans-serif" }}>
            <div className="layout-container flex h-full flex-col justify-center">
                <div className="flex justify-center py-5">
                    <div className="w-[512px] max-w-[512px] py-5 flex flex-col">
                        <div 
                            className="w-full bg-center bg-no-repeat bg-cover flex justify-end overflow-hidden bg-white rounded-xl min-h-[300px]" 
                            style={{ backgroundImage: `url('/images/Logo.png')` }}  // Ruta de la imagen en `public`
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
