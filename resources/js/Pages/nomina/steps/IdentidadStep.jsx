import React from 'react';

export default function IdentidadStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Identidad digital</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">27. Firma electrónica Avanzada</label>
                <select name="firma_electronica" value={formData.firma_electronica} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700">
                    <option value="">Seleccione el tipo de firma electrónica...</option>
                    <option value="FirmaGob">Utiliza firma electrónica avanzada del Estado (FirmaGob)</option>
                    <option value="Externo">Utiliza firma electrónica avanzada provista por un externo</option>
                    <option value="Ambos">Utiliza ambos tipos de firma (FirmaGob y provista por un externo)</option>
                    <option value="No utiliza">No utiliza firma electrónica avanzada</option>
                </select>
            </div>
        </div>
    );
}