import React from 'react';

export default function UsuariosStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Usuarios(as)</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">12. Pago asociado</label>
                <div className="flex space-x-6">
                    {['Sí', 'No', 'En algunos casos'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="pago_asociado" value={opt} checked={formData.pago_asociado === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">13. Tipo de usuario(a)</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Persona natural', 'Persona jurídica', 'Ambos tipos de personas', 'Órganos del Estado'].map((tipo) => (
                        <label key={tipo} className={`border rounded p-3 text-xs cursor-pointer flex items-start space-x-2 bg-white ${formData.tipo_usuario === tipo ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200'}`}>
                            <input type="radio" name="tipo_usuario" value={tipo} checked={formData.tipo_usuario === tipo} onChange={handleFormChange} className="mt-0.5 bg-white" />
                            <span>{tipo}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">14. Segmento de usuarios(as)</label>
                <select name="segmento_usuario" value={formData.segmento_usuario} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700">
                    <option value="">Seleccione un segmento...</option>
                    <option value="No aplica">No aplica</option>
                    <option value="Adulto mayor">Adulto mayor</option>
                    <option value="Infancia">Infancia</option>
                    <option value="Discapacidad">Discapacidad</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">15. Disponibilidad para su realización</label>
                <div className="grid grid-cols-2 gap-3">
                    {['Se puede realizar durante todo el año', 'Se puede realizar sólo en algunos períodos del año'].map((opt) => (
                        <label key={opt} className={`border rounded p-3 text-xs cursor-pointer flex items-center space-x-2 bg-white ${formData.disponibilidad_realizacion === opt ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200'}`}>
                            <input type="radio" name="disponibilidad_realizacion" value={opt} checked={formData.disponibilidad_realizacion === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}