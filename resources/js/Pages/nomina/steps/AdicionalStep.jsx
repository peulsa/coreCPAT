import React from 'react';

export default function AdicionalStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Información adicional</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">32. Opcionalmente se puede dejar cualquier información considerada relevante</label>
                <textarea 
                    name="info_adicional" 
                    value={formData.info_adicional || ''} 
                    onChange={handleFormChange} 
                    rows="4" 
                    placeholder="Escriba información relevante si lo desea..."
                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500"
                ></textarea>
            </div>
        </div>
    );
}