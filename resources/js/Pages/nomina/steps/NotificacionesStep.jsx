import React from 'react';

export default function NotificacionesStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Notificaciones</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">28. Notificación(es) practicada(s)</label>
                <div className="flex space-x-6">
                    {['Sí', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="notificacion_practicada" value={opt} checked={formData.notificacion_practicada === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}