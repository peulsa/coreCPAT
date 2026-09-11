import React from 'react';

export default function SoporteStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Soporte electrónico</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">16. Nivel de digitalización</label>
                <div className="grid grid-cols-3 gap-3">
                    {['Nivel 0', 'Nivel 1', 'Nivel 2', 'Nivel 3', 'Nivel 4', 'Nivel 5'].map((nivel) => (
                        <label key={nivel} className={`border rounded p-3 text-xs cursor-pointer bg-white ${formData.nivel_digitalizacion === nivel ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200'}`}>
                            <input type="radio" name="nivel_digitalizacion" value={nivel} checked={formData.nivel_digitalizacion === nivel} onChange={handleFormChange} className="mr-2" />
                            <span className="font-bold">{nivel}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">18. Canal(es) transaccional(es)</label>
                <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="canales_transaccionales" value="Canal presencial" checked={formData.canales_transaccionales?.includes('Canal presencial')} onChange={handleFormChange} /><span>Canal presencial</span></label>
                    <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="canales_transaccionales" value="Canal telefónico" checked={formData.canales_transaccionales?.includes('Canal telefónico')} onChange={handleFormChange} /><span>Canal telefónico</span></label>
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">19. Tipo de expediente</label>
                <div className="flex space-x-6">
                    {['Expediente con documentos en formato físico', 'No tiene un expediente'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="tipo_expediente" value={opt} checked={formData.tipo_expediente === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">21. Ficha ChileAtiende relacionada</label>
                <div className="flex space-x-6">
                    {['Sí', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="ficha_chileatiende" value={opt} checked={formData.ficha_chileatiende === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}