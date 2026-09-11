import React from 'react';

export default function IdentificacionStep({ formData, handleFormChange }) {
    return (
        <div className="space-y-6 bg-white">
            <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Identificación</h2>
            
            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">1. Nombre</label>
                <input type="text" name="nombre_registro" value={formData.nombre_registro} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">2. Descripción</label>
                <textarea name="descripcion_registro" value={formData.descripcion_registro} onChange={handleFormChange} rows="3" className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500"></textarea>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">3. Área responsable</label>
                <select name="area_responsable" value={formData.area_responsable} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700">
                    <option value="">Seleccione un área responsable...</option>
                    <option value="DAF">Dirección de Administración y Finanzas (DAF)</option>
                    <option value="Administración Municipal">Administración Municipal</option>
                    <option value="Tránsito">Dirección de Tránsito y Transporte Público</option>
                    <option value="DIDECO">Dirección de Desarrollo Comunitario (DIDECO)</option>
                    <option value="Obras">Dirección de Obras</option>
                    <option value="SECPLA">Secretaría de Planificación (SECPLA)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">4. Cargo del o la responsable</label>
                <input type="text" name="cargo_responsable" value={formData.cargo_responsable} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">5. Tipo de inicio</label>
                <div className="grid grid-cols-3 gap-3">
                    {['De oficio', 'Solicitud de partes', 'Ambos'].map((tipo) => (
                        <label key={tipo} className={`border rounded p-3 text-xs cursor-pointer flex items-start space-x-2 bg-white ${formData.tipo_inicio === tipo ? 'border-blue-600 bg-blue-50/30' : 'border-gray-200'}`}>
                            <input type="radio" name="tipo_inicio" value={tipo} checked={formData.tipo_inicio === tipo} onChange={handleFormChange} className="mt-0.5 bg-white" />
                            <span>{tipo}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">6. Acto de inicio</label>
                <input type="text" name="acto_inicio" value={formData.acto_inicio} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">7. Acto de término</label>
                <input type="text" name="acto_termino" value={formData.acto_termino} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-800 mb-1">8. Producto institucional relacionado</label>
                <select name="producto_institucional" value={formData.producto_institucional} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700">
                    <option value="">Seleccione un producto institucional...</option>
                    <option value="Acreditación">Acreditación</option>
                    <option value="Atención y/o información ciudadana">Atención y/o información ciudadana</option>
                    <option value="Autorización">Autorización</option>
                    <option value="Avalúo">Avalúo</option>
                    <option value="Beca">Beca</option>
                    <option value="Bienes fiscales">Bienes fiscales</option>
                    <option value="Bonos">Bonos</option>
                    <option value="Capacitación y/o Asistencia técnica">Capacitación y/o Asistencia técnica</option>
                    <option value="Créditos">Créditos</option>
                    <option value="Exenciones">Exenciones</option>
                    <option value="Fiscalización">Fiscalización</option>
                    <option value="Fondos concursables y/o postulables">Fondos concursables y/o postulables</option>
                    <option value="Pensión">Pensión</option>
                    <option value="Prestaciones">Prestaciones</option>
                    <option value="Pronunciamiento">Pronunciamiento</option>
                    <option value="Subsidios">Subsidios</option>
                    <option value="Recaudación y pagos">Recaudación y pagos</option>
                    <option value="Registros">Registros</option>
                    <option value="Otros">Otros</option>
                </select>
            </div>
        </div>
    );
}