import React from 'react';
import { createRoot } from 'react-dom/client';

function UserPortal() {
    return (
        <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800">Portal de Procedimientos Municipales</h1>
            <p className="text-gray-600 mt-2">Bienvenido ciudadano. Aquí podrá consultar los trámites disponibles.</p>
        </div>
    );
}

if (document.getElementById('app')) {
    createRoot(document.getElementById('app')).render(<UserPortal />);
}