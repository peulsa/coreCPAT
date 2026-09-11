import React from 'react';

export default function MarcoNormativoStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Marco normativo</h2>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">9. Número Ley</label>
                <input type="text" name="numero_ley" value={formData.numero_ley} onChange={handleFormChange} placeholder="Ej: 20285" className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">10. URL de la Ley en LeyChile</label>
                <input type="text" name="url_ley" value={formData.url_ley} onChange={handleFormChange} placeholder="https://www.bcn.cl/leychile/..." className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">11. Otras fuentes normativas</label>
                <div className="flex space-x-6">
                    {['Sí', 'No'].map((opt) => (
                        <label key={opt} className="flex items-center space-x-2 text-sm cursor-pointer">
                            <input type="radio" name="otras_fuentes" value={opt} checked={formData.otras_fuentes === opt} onChange={handleFormChange} className="bg-white" />
                            <span>{opt}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}