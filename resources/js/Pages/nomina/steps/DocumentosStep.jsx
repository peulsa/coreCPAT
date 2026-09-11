import React from 'react';

export default function DocumentosStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Datos y documentos</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">29. Dato, documentos y/o expedientes en poder de otros órganos</label>
                <div className="flex space-x-6">
                    {['Sí', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="datos_otros_organos" value={opt} checked={formData.datos_otros_organos === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">30. Documento(s) notarial(es)</label>
                <div className="flex space-x-6">
                    {['Sí', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="documentos_notariales" value={opt} checked={formData.documentos_notariales === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">31. Medio utilizado para enviar comunicaciones oficiales</label>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        'Sí, realiza envíos sólo por medio de la plataforma Doc Digital',
                        'Sí, realiza envíos por medios electrónicos propios y deja trazabilidad en Doc Digital',
                        'Sí, realiza envíos sólo por medios electrónicos propios',
                        'Sí, realiza envíos por medios físicos',
                        'No considera comunicaciones oficiales'
                    ].map((opt) => (
                        <label key={opt} className={`border rounded p-3 text-xs cursor-pointer bg-white ${formData.medio_comunicaciones === opt ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200'}`}>
                            <input type="radio" name="medio_comunicaciones" value={opt} checked={formData.medio_comunicaciones === opt} onChange={handleFormChange} className="mr-2" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}