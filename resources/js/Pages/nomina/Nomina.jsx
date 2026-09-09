import React, { useState, useEffect } from 'react';

export default function Nomina() {
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Estado inicial del formulario mapeado a tus columnas Not Null
    const initialFormState = {
        codigo_registro: '', 
        nombre_registro: '', 
        tipo_registro: 'Procedimiento FC',
        descripcion_registro: '',
        cargo_responsable: '',
        departamento_id: 1, // ID por defecto para evitar errores de Foreign Key
        nivel_digitalizacion: 'Nivel 0'
    };
    
    const [formData, setFormData] = useState(initialFormState);

    const cargarRegistros = () => {
        fetch('/admin/api/procedimientos')
            .then(res => res.json())
            .then(data => setRegistros(data))
            .catch(err => console.error("Error al cargar procedimientos", err));
    };

    useEffect(() => {
        cargarRegistros();
    }, []);

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/admin/api/procedimientos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': token || ''
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                setIsModalOpen(false);
                setFormData(initialFormState); // Resetea el formulario
                cargarRegistros(); // Refresca la tabla automáticamente
            } else {
                console.error("Error de validación del backend:", data);
                alert("Error al guardar: Verifica que el código no esté duplicado y los datos sean correctos.");
            }
        } catch (error) {
            console.error("Error de red al guardar", error);
        }
    };

    const registrosFiltrados = registros.filter(reg => 
        (reg.nombre_registro || '').toLowerCase().includes(busqueda.toLowerCase()) || 
        (reg.codigo_registro || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="w-full bg-white p-6 relative">
            <div className="flex items-center text-sm text-gray-600 mb-6 font-medium">
                <span className="hover:underline cursor-pointer">Inicio</span>
                <span className="mx-2 text-gray-400">▶</span>
                <span className="text-blue-700 font-semibold border-b border-blue-700 pb-0.5">Nómina de procedimientos y tramitaciones</span>
            </div>

            <h1 className="text-2xl font-bold text-[#0a192f] mb-4">Nómina de procedimientos administrativos y otras tramitaciones</h1>
            
            <div className="flex justify-center mb-10">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#1976d2] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow flex items-center space-x-2 transition-colors"
                >
                    <span className="text-xl leading-none mb-0.5">+</span>
                    <span>Crear registro</span>
                </button>
            </div>

            <div className="mb-6">
                <h3 className="font-bold text-sm text-[#0a192f] mb-2">Busca procedimientos administrativos</h3>
                <input 
                    type="text" 
                    placeholder="Ingresa el código o nombre de registro" 
                    className="w-full border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 mb-3"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-t-md">
                <table className="w-full text-left text-sm text-gray-700">
                    <thead className="bg-[#4285f4] text-white">
                        <tr>
                            <th className="px-4 py-3 font-medium">Código</th>
                            <th className="px-4 py-3 font-medium">Nombre del registro</th>
                            <th className="px-4 py-3 font-medium">Nivel digitalización</th>
                            <th className="px-4 py-3 font-medium">Tipo de registro</th>
                            <th className="px-4 py-3 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {registrosFiltrados.map((registro) => (
                            <tr key={registro.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{registro.codigo_registro}</td>
                                <td className="px-4 py-3">{registro.nombre_registro}</td>
                                <td className="px-4 py-3">{registro.nivel_digitalizacion || 'Nivel 0'}</td>
                                <td className="px-4 py-3">
                                    <span className="border border-blue-400 text-blue-600 px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                                        {registro.tipo_registro}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                                        registro.estado_registro === 'Completado' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
                                    }`}>
                                        {registro.estado_registro || 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {registrosFiltrados.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                                    No hay registros disponibles.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Superpuesto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-[#0a192f]">Nuevo Registro de Procedimiento</h2>
                        </div>
                        
                        <div className="p-6 overflow-y-auto">
                            <form id="procedimiento-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Código del Registro *</label>
                                    <input required type="text" name="codigo_registro" value={formData.codigo_registro} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Ej: PA-MUN00258-00026" />
                                </div>
                                
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Registro *</label>
                                    <input required type="text" name="nombre_registro" value={formData.nombre_registro} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Ej: Aporte económico..." />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Registro *</label>
                                    <select name="tipo_registro" value={formData.tipo_registro} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white">
                                        <option value="Procedimiento FC">Procedimiento administrativo de función común</option>
                                        <option value="Procedimiento FE">Procedimiento administrativo de función específica</option>
                                        <option value="Otras tramitaciones">Otras tramitaciones</option>
                                    </select>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nivel de Digitalización</label>
                                    <select name="nivel_digitalizacion" value={formData.nivel_digitalizacion} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white">
                                        <option value="Nivel 0">Nivel 0 - Presencial</option>
                                        <option value="Nivel 1">Nivel 1 - Información en línea</option>
                                        <option value="Nivel 2">Nivel 2 - Descarga de formularios</option>
                                        <option value="Nivel 3">Nivel 3 - Recepción en línea</option>
                                        <option value="Nivel 4">Nivel 4 - Transacción completa</option>
                                        <option value="Nivel 5">Nivel 5 - Proactivo</option>
                                    </select>
                                </div>

                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Registro *</label>
                                    <textarea required name="descripcion_registro" value={formData.descripcion_registro} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" rows="3" placeholder="Detalla el propósito de este procedimiento..."></textarea>
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Responsable *</label>
                                    <input required type="text" name="cargo_responsable" value={formData.cargo_responsable} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" placeholder="Ej: Director DIDECO" />
                                </div>

                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID Departamento *</label>
                                    <input required type="number" min="1" name="departamento_id" value={formData.departamento_id} onChange={handleFormChange} className="w-full border border-gray-300 rounded p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                                </div>
                            </form>
                        </div>
                        
                        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" form="procedimiento-form" className="px-4 py-2 bg-[#1976d2] text-white rounded hover:bg-blue-700 font-medium shadow-sm transition-colors">
                                Guardar Registro
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}