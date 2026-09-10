import React, { useState } from 'react';

export default function Reportes() {
    const [anioSeleccionado, setAnioSeleccionado] = useState('');

    const handleDownload = (tipoReporte, formato) => {
        console.log(`Descargando reporte de ${tipoReporte} en formato ${formato} para el año: ${anioSeleccionado || 'Todos'}`);
    };

    return (
        <div className="w-full bg-white p-6 relative min-h-screen font-sans text-gray-800">
            <div className="flex items-center text-sm text-gray-600 mb-6 font-medium">
                <span className="hover:underline cursor-pointer">Inicio</span>
                <span className="mx-2 text-gray-400">▶</span>
                <span className="text-blue-700 font-semibold border-b border-blue-700 pb-0.5">Reportes</span>
            </div>

            <h1 className="text-2xl font-bold text-[#0a192f] mb-2">Reportes</h1>
            <p className="text-gray-700 text-sm mb-8 leading-relaxed">
                Desde este módulo podrás descargar diversos reportes que representan lo informado por tu institución en el Catálogo de Procedimientos Administrativos y Tramitaciones.
            </p>

            <div className="mb-8">
                <h2 className="text-base font-bold text-[#1976d2] mb-1">Consolidado de transacciones</h2>
                <p className="text-xs text-gray-600 mb-4">
                    Contiene el detalle de lo informado por la institución en el módulo transacciones, desagregado por canal de atención y mes.
                </p>

                <div className="mb-4 max-w-full">
                    <select 
                        value={anioSeleccionado} 
                        onChange={(e) => setAnioSeleccionado(e.target.value)}
                        className="w-full border border-gray-300 rounded p-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:border-blue-500 shadow-sm"
                    >
                        <option value="">Año</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>

                <div className="flex justify-end space-x-2 mb-6">
                    <button 
                        onClick={() => handleDownload('transacciones', 'csv')}
                        className="bg-[#1976d2] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
                    >
                        CSV
                    </button>
                    <button 
                        onClick={() => handleDownload('transacciones', 'excel')}
                        className="bg-[#1976d2] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
                    >
                        Excel
                    </button>
                </div>
                <hr className="border-gray-200" />
            </div>

            <div className="mb-8">
                <h2 className="text-base font-bold text-[#1976d2] mb-1">Consolidado de procedimientos administrativos y tramitaciones</h2>
                <p className="text-xs text-gray-600 mb-4">
                    Contiene el detalle de la nómina de procedimientos y otras tramitaciones informada por la institución.
                </p>

                <div className="flex justify-end space-x-2 mb-6">
                    <button 
                        onClick={() => handleDownload('procedimientos', 'excel')}
                        className="bg-[#1976d2] hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-semibold shadow-sm transition-colors"
                    >
                        Excel
                    </button>
                </div>
                <hr className="border-gray-200" />
            </div>
        </div>
    );
}