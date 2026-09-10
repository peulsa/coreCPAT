import React, { useState, useEffect } from 'react';

export default function Nomina() {
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('seleccion_tipo'); 
    const [activeTab, setActiveTab] = useState('identificacion');
    const [errorMessage, setErrorMessage] = useState('');

    const initialFormState = {
        codigo_registro: '',
        tipo_registro: 'Procedimiento administrativo de función específica',
        nombre_registro: '',
        descripcion_registro: '',
        area_responsable: '',
        cargo_responsable: '',
        tipo_inicio: '',
        acto_inicio: '',
        acto_termino: '',
        producto_institucional: '',
        // Marco Normativo
        numero_ley: '',
        url_ley: '',
        otras_fuentes: '',
        // Usuarios(as)
        pago_asociado: '',
        tipo_usuario: '',
        segmento_usuario: '',
        disponibilidad_realizacion: '',
        // Soporte electrónico
        nivel_digitalizacion: 'Nivel 0',
        canales_transaccionales: [],
        tipo_expediente: '',
        ficha_chileatiende: '',
        // Identidad digital
        firma_electronica: '',
        // Notificaciones
        notificacion_practicada: '',
        // Datos y documentos
        datos_otros_organos: '',
        documentos_notariales: '',
        medio_comunicaciones: '',
        // Información adicional
        info_adicional: '',
        departamento_id: 1
    };

    const [formData, setFormData] = useState(initialFormState);

    const cargarRegistros = () => {
        fetch('/admin/api/procedimientos')
            .then(res => res.json())
            .then(data => {
                setRegistros(data);
            })
            .catch(err => console.error("Error al cargar procedimientos", err));
    };

    useEffect(() => {
        cargarRegistros();
    }, []);

    const generarCodigoIncremental = (tipo, totalRegistros) => {
        let prefijo = 'PT';
        if (tipo.includes('función común')) {
            prefijo = 'PA';
        } else if (tipo.includes('Otras tramitaciones')) {
            prefijo = 'TR';
        }
        const siguienteNumero = totalRegistros + 1;
        const numeroFormateado = String(siguienteNumero).padStart(5, '0');
        return `${prefijo}-MUN00258-${numeroFormateado}`;
    };

    const abrirModalCrear = () => {
        const tipoInicial = 'Procedimiento administrativo de función específica';
        const codigoGenerado = generarCodigoIncremental(tipoInicial, registros.length);
        
        setFormData({
            ...initialFormState,
            tipo_registro: tipoInicial,
            codigo_registro: codigoGenerado
        });
        setModalStep('seleccion_tipo');
        setActiveTab('identificacion');
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleTipoChange = (nuevoTipo) => {
        const codigoGenerado = generarCodigoIncremental(nuevoTipo, registros.length);
        setFormData({
            ...formData,
            tipo_registro: nuevoTipo,
            codigo_registro: codigoGenerado
        });
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const currentList = formData[name] || [];
            if (checked) {
                setFormData({ ...formData, [name]: [...currentList, value] });
            } else {
                setFormData({ ...formData, [name]: currentList.filter(item => item !== value) });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errorMessage) setErrorMessage('');
    };

    // Validadores de estado para las pestañas
    const isIdentificacionComplete = () => {
        return (
            formData.nombre_registro.trim() !== '' &&
            formData.descripcion_registro.trim() !== '' &&
            formData.cargo_responsable.trim() !== '' &&
            formData.tipo_inicio.trim() !== '' &&
            formData.acto_inicio.trim() !== '' &&
            formData.acto_termino.trim() !== '' &&
            formData.producto_institucional.trim() !== ''
        );
    };

    const isNormativoComplete = () => {
        return (
            formData.numero_ley.trim() !== '' &&
            formData.url_ley.trim() !== '' &&
            formData.otras_fuentes.trim() !== ''
        );
    };

    const isUsuariosComplete = () => {
        return (
            formData.pago_asociado.trim() !== '' &&
            formData.tipo_usuario.trim() !== '' &&
            formData.segmento_usuario.trim() !== '' &&
            formData.disponibilidad_realizacion.trim() !== ''
        );
    };

    const isSoporteComplete = () => {
        return (
            formData.nivel_digitalizacion.trim() !== '' &&
            formData.tipo_expediente.trim() !== '' &&
            formData.ficha_chileatiende.trim() !== ''
        );
    };

    const isIdentidadComplete = () => {
        return formData.firma_electronica.trim() !== '';
    };

    const isNotificacionesComplete = () => {
        return formData.notificacion_practicada.trim() !== '';
    };

    const isDocumentosComplete = () => {
        return (
            formData.datos_otros_organos.trim() !== '' &&
            formData.documentos_notariales.trim() !== '' &&
            formData.medio_comunicaciones.trim() !== ''
        );
    };

    const isAdicionalComplete = () => {
        return true; // Campo opcional
    };

    // Cálculo dinámico del porcentaje de avance total basado en los campos completados
    const calcularProgresoTotal = () => {
        const camposTotales = 18; // Número total de campos o secciones evaluadas
        let camposCompletados = 0;

        if (formData.nombre_registro.trim()) camposCompletados++;
        if (formData.descripcion_registro.trim()) camposCompletados++;
        if (formData.cargo_responsable.trim()) camposCompletados++;
        if (formData.tipo_inicio.trim()) camposCompletados++;
        if (formData.acto_inicio.trim()) camposCompletados++;
        if (formData.acto_termino.trim()) camposCompletados++;
        if (formData.producto_institucional.trim()) camposCompletados++;
        
        if (formData.numero_ley.trim()) camposCompletados++;
        if (formData.url_ley.trim()) camposCompletados++;
        if (formData.otras_fuentes.trim()) camposCompletados++;

        if (formData.pago_asociado.trim()) camposCompletados++;
        if (formData.tipo_usuario.trim()) camposCompletados++;
        if (formData.segmento_usuario.trim()) camposCompletados++;
        if (formData.disponibilidad_realizacion.trim()) camposCompletados++;

        if (formData.nivel_digitalizacion.trim()) camposCompletados++;
        if (formData.tipo_expediente.trim()) camposCompletados++;
        if (formData.ficha_chileatiende.trim()) camposCompletados++;
        if (formData.firma_electronica.trim()) camposCompletados++;
        if (formData.notificacion_practicada.trim()) camposCompletados++;
        if (formData.datos_otros_organos.trim()) camposCompletados++;
        if (formData.documentos_notariales.trim()) camposCompletados++;
        if (formData.medio_comunicaciones.trim()) camposCompletados++;

        const porcentaje = Math.min(Math.round((camposCompletados / 22) * 100), 100);
        return porcentaje;
    };

    const porcentajeAvance = calcularProgresoTotal();

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
                cargarRegistros();
            } else {
                setErrorMessage("Error al guardar el registro en la base de datos.");
            }
        } catch (error) {
            console.error("Error de red", error);
            setErrorMessage("Error de conexión con el servidor.");
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
                    onClick={abrirModalCrear}
                    className="bg-[#1976d2] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow flex items-center space-x-2 transition-colors"
                >
                    <span className="text-xl leading-none mb-0.5">+</span>
                    <span>Crear registro</span>
                </button>
            </div>

            <input 
                type="text" 
                placeholder="Ingresa el código o nombre de registro" 
                className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm mb-6 focus:outline-none focus:border-blue-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className="overflow-x-auto border border-gray-200 rounded-t-md bg-white">
                <table className="w-full text-left text-sm text-gray-700 bg-white">
                    <thead className="bg-[#4285f4] text-white">
                        <tr>
                            <th className="px-4 py-3 font-medium">Código</th>
                            <th className="px-4 py-3 font-medium">Nombre del registro</th>
                            <th className="px-4 py-3 font-medium">Nivel digitalización</th>
                            <th className="px-4 py-3 font-medium">Tipo de registro</th>
                            <th className="px-4 py-3 font-medium">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {registrosFiltrados.map((registro) => (
                            <tr key={registro.id} className="hover:bg-gray-50 bg-white">
                                <td className="px-4 py-3 font-medium">{registro.codigo_registro}</td>
                                <td className="px-4 py-3">{registro.nombre_registro}</td>
                                <td className="px-4 py-3">{registro.nivel_digitalizacion || 'Nivel 0'}</td>
                                <td className="px-4 py-3">
                                    <span className="border border-blue-400 text-blue-600 px-3 py-0.5 rounded-full text-xs font-medium whitespace-nowrap bg-white">
                                        {registro.tipo_registro}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="bg-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-medium">
                                        {registro.estado_registro || 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal General con Fondo Blanco Absoluto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white flex items-center justify-center z-50 p-4 overflow-y-auto">
                    
                    {/* PASO 1: SELECCIÓN DE TIPO DE REGISTRO */}
                    {modalStep === 'seleccion_tipo' && (
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-8 flex flex-col border border-gray-100">
                            {errorMessage && (
                                <div className="mb-6 border border-red-500 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center space-x-3 text-red-600 text-sm font-medium">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6"></path>
                                        </svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                    <button onClick={() => setErrorMessage('')} className="text-gray-500 hover:text-gray-800 text-lg font-bold px-2">×</button>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold text-[#0a192f] mb-1">¿Qué tipo de registro quieres crear?</h2>
                            <p className="text-xs text-gray-600 mb-6">Según el tipo de registro (procedimiento administrativo o trámite) se desplegarán diversas preguntas de caracterización</p>

                            <div className="grid grid-cols-3 gap-4 mb-8">
                                {[
                                    {
                                        titulo: 'Procedimiento administrativo de función común',
                                        desc: 'Asociado a funciones comunes o transversales a la gestión pública, en áreas de soporte o apoyo al mandato institucional...'
                                    },
                                    {
                                        titulo: 'Procedimiento administrativo de función específica',
                                        desc: 'Asociado a funciones específicas de los órganos de la administración del Estado, derivadas del cumplimiento del mandato institucional...'
                                    },
                                    {
                                        titulo: 'Otras tramitaciones',
                                        desc: 'Interacciones entre la institución y sus usuarios, usualmente se desprenden de las funciones específicas...'
                                    }
                                ].map((item) => (
                                    <div 
                                        key={item.titulo}
                                        onClick={() => handleTipoChange(item.titulo)}
                                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between bg-white ${
                                            formData.tipo_registro === item.titulo ? 'border-[#1976d2] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div>
                                            <div className="flex items-center space-x-3 mb-3">
                                                <input 
                                                    type="radio" 
                                                    name="tipo_registro_radio" 
                                                    checked={formData.tipo_registro === item.titulo} 
                                                    onChange={() => handleTipoChange(item.titulo)}
                                                    className="w-4 h-4 text-blue-600 bg-white" 
                                                />
                                                <h3 className="font-bold text-sm text-[#0a192f]">{item.titulo}</h3>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mb-8">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Nombre</label>
                                <input 
                                    type="text" 
                                    name="nombre_registro" 
                                    value={formData.nombre_registro} 
                                    onChange={handleFormChange} 
                                    placeholder="Ingrese el nombre del registro..." 
                                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500" 
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t bg-white">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium text-sm"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        if(!formData.nombre_registro.trim()) {
                                            setErrorMessage("Debe ingresar el nombre del registro");
                                            return;
                                        }
                                        setErrorMessage('');
                                        setModalStep('wizard_formulario');
                                    }} 
                                    className="px-6 py-2 bg-[#1976d2] text-white rounded hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {/* PASO 2: ASISTENTE DE PESTAÑAS (WIZARD) */}
                    {modalStep === 'wizard_formulario' && (
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-100">
                            
                            {/* Header del Asistente con Barra de Avance Dinámica */}
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                                <div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Tipo de registro</span>
                                    <h3 className="text-sm font-bold text-blue-700">{formData.tipo_registro}</h3>
                                    <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded mt-1 inline-block">
                                        {formData.codigo_registro}
                                    </span>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                                        <span>Estado de avance del registro</span>
                                        <span className="font-bold">{porcentajeAvance}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${porcentajeAvance}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            {/* Notificación de Error Estilizada */}
                            {errorMessage && (
                                <div className="mx-8 mt-4 border border-red-500 bg-white px-4 py-3 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center space-x-3 text-red-600 text-sm font-medium">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2"></circle>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6"></path>
                                        </svg>
                                        <span>{errorMessage}</span>
                                    </div>
                                    <button onClick={() => setErrorMessage('')} className="text-gray-500 hover:text-gray-800 text-lg font-bold px-2">×</button>
                                </div>
                            )}

                            {/* Cuerpo con Sidebar y Formulario */}
                            <div className="flex flex-1 overflow-hidden bg-white">
                                <div className="w-64 border-r border-gray-200 bg-white p-4 space-y-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">Menú</p>
                                    {[
                                        { id: 'identificacion', label: 'Identificación', complete: isIdentificacionComplete() },
                                        { id: 'normativo', label: 'Marco normativo', complete: isNormativoComplete() },
                                        { id: 'usuarios', label: 'Usuarios(as)', complete: isUsuariosComplete() },
                                        { id: 'soporte', label: 'Soporte electrónico', complete: isSoporteComplete() },
                                        { id: 'identidad', label: 'Identidad digital', complete: isIdentidadComplete() },
                                        { id: 'notificaciones', label: 'Notificaciones', complete: isNotificacionesComplete() },
                                        { id: 'documentos', label: 'Datos y documentos', complete: isDocumentosComplete() },
                                        { id: 'adicional', label: 'Información adicional', complete: isAdicionalComplete() },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => { setActiveTab(tab.id); setErrorMessage(''); }}
                                            className={`w-full text-left px-3 py-2.5 rounded text-sm font-medium transition-colors flex items-center justify-between bg-white ${
                                                activeTab === tab.id ? 'text-blue-800 font-semibold border-l-4 border-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                            <span>{tab.complete ? '✅' : '⚠️'}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex-1 p-8 overflow-y-auto bg-white">
                                    <form id="wizard-form" onSubmit={handleSubmit}>
                                        
                                        {/* PESTAÑA 1: IDENTIFICACIÓN */}
                                        {activeTab === 'identificacion' && (
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
                                                    <select name="area_responsable" value={formData.area_responsable} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-500">
                                                        <option value="">Seleccione un área responsable...</option>
                                                        <option value="DAF">Dirección de Administración y Finanzas (DAF)</option>
                                                        <option value="Administración Municipal">Administración Municipal</option>
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
                                                        <option value="Autorización">Autorización</option>
                                                        <option value="Subsidios">Subsidios</option>
                                                        <option value="Otros">Otros</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* PESTAÑA 2: MARCO NORMATIVO */}
                                        {activeTab === 'normativo' && (
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
                                        )}

                                        {/* PESTAÑA 3: USUARIOS(AS) */}
                                        {activeTab === 'usuarios' && (
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
                                        )}

                                        {/* PESTAÑA 4: SOPORTE ELECTRÓNICO */}
                                        {activeTab === 'soporte' && (
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
                                                        <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="canales_transaccionales" value="Canal presencial" onChange={handleFormChange} /><span>Canal presencial</span></label>
                                                        <label className="flex items-center space-x-2 text-sm"><input type="checkbox" name="canales_transaccionales" value="Canal telefónico" onChange={handleFormChange} /><span>Canal telefónico</span></label>
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
                                        )}

                                        {/* PESTAÑA 5: IDENTIDAD DIGITAL */}
                                        {activeTab === 'identidad' && (
                                            <div className="space-y-6 bg-white">
                                                <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Identidad digital</h2>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-800 mb-1">27. Firma electrónica Avanzada</label>
                                                    <p className="text-xs text-gray-500 mb-2">Definición de apoyo: La firma electrónica avanzada es aquella certificada...</p>
                                                    <select name="firma_electronica" value={formData.firma_electronica} onChange={handleFormChange} className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500 text-gray-700">
                                                        <option value="">Seleccione el tipo de firma electrónica...</option>
                                                        <option value="FirmaGob">Utiliza firma electrónica avanzada del Estado (FirmaGob)</option>
                                                        <option value="Externo">Utiliza firma electrónica avanzada provista por un externo</option>
                                                        <option value="Ambos">Utiliza ambos tipos de firma (FirmaGob y provista por un externo)</option>
                                                        <option value="No utiliza">No utiliza firma electrónica avanzada</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {/* PESTAÑA 6: NOTIFICACIONES */}
                                        {activeTab === 'notificaciones' && (
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
                                        )}

                                        {/* PESTAÑA 7: DATOS Y DOCUMENTOS */}
                                        {activeTab === 'documentos' && (
                                            <div className="space-y-6 bg-white">
                                                <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Datos y documentos</h2>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-800 mb-1">29. Dato, documentos(certificados) y/o expedientes en poder de otros órganos</label>
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
                                        )}

                                        {/* PESTAÑA 8: INFORMACIÓN ADICIONAL */}
                                        {activeTab === 'adicional' && (
                                            <div className="space-y-6 bg-white">
                                                <h2 className="text-xl font-bold text-[#0a192f] border-b pb-2">Información adicional</h2>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-800 mb-1">32. Opcionalmente se puede dejar cualquier información considerada relevante</label>
                                                    <textarea name="info_adicional" value={formData.info_adicional} onChange={handleFormChange} rows="4" className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500"></textarea>
                                                </div>
                                            </div>
                                        )}

                                    </form>
                                </div>
                            </div>

                            {/* Footer del Asistente */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center rounded-b-lg">
                                <button type="button" onClick={() => setModalStep('seleccion_tipo')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                                    ◀ Volver
                                </button>
                                <div className="space-x-3">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 font-medium text-sm">
                                        Guardar y salir
                                    </button>
                                    <button type="submit" form="wizard-form" className="px-5 py-2 bg-[#1976d2] text-white rounded hover:bg-blue-700 font-medium text-sm shadow-sm transition-colors">
                                        Guardar y continuar
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}

                </div>
            )}
        </div>
    );
}