import React, { useState, useEffect } from 'react';
import IdentificacionStep from './steps/IdentificacionStep';
import MarcoNormativoStep from './steps/MarcoNormativoStep';
import UsuariosStep from './steps/UsuariosStep';
import SoporteStep from './steps/SoporteStep';
import IdentidadStep from './steps/IdentidadStep';
import NotificacionesStep from './steps/NotificacionesStep';
import DocumentosStep from './steps/DocumentosStep';
import AdicionalStep from './steps/AdicionalStep';

export default function Nomina() {
    const [busqueda, setBusqueda] = useState('');
    const [registros, setRegistros] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setModalStep] = useState('seleccion_tipo'); 
    const [activeTab, setActiveTab] = useState('identificacion');
    const [procedureId, setProcedureId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const tabsList = [
        { id: 'identificacion', label: 'Identificación' },
        { id: 'normativo', label: 'Marco normativo' },
        { id: 'usuarios', label: 'Usuarios(as)' },
        { id: 'soporte', label: 'Soporte electrónico' },
        { id: 'identidad', label: 'Identidad digital' },
        { id: 'notificaciones', label: 'Notificaciones' },
        { id: 'documentos', label: 'Datos y documentos' },
        { id: 'adicional', label: 'Información adicional' }
    ];

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
        numero_ley: '',
        url_ley: '',
        otras_fuentes: '',
        pago_asociado: '',
        tipo_usuario: '',
        segmento_usuario: '',
        disponibilidad_realizacion: '',
        nivel_digitalizacion: 'Nivel 0',
        canales_transaccionales: [],
        tipo_expediente: '',
        ficha_chileatiende: '',
        firma_electronica: '',
        notificacion_practicada: '',
        datos_otros_organos: '',
        documentos_notariales: '',
        medio_comunicaciones: '',
        info_adicional: '',
        departamento_id: 1
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

    const generarCodigoIncremental = (tipo, totalRegistros) => {
        let prefijo = 'PT';
        if (tipo.includes('función común')) prefijo = 'PA';
        else if (tipo.includes('Otras tramitaciones')) prefijo = 'TR';
        return `${prefijo}-MUN00258-${String(totalRegistros + 1).padStart(5, '0')}`;
    };

    const abrirModalCrear = () => {
        const tipoInicial = 'Procedimiento administrativo de función específica';
        setFormData({
            ...initialFormState,
            tipo_registro: tipoInicial,
            codigo_registro: generarCodigoIncremental(tipoInicial, registros.length)
        });
        setProcedureId(null);
        setModalStep('seleccion_tipo');
        setActiveTab('identificacion');
        setErrorMessage('');
        setIsModalOpen(true);
    };

    const handleTipoChange = (nuevoTipo) => {
        setFormData({
            ...formData,
            tipo_registro: nuevoTipo,
            codigo_registro: generarCodigoIncremental(nuevoTipo, registros.length)
        });
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            const currentList = formData[name] || [];
            if (checked) setFormData({ ...formData, [name]: [...currentList, value] });
            else setFormData({ ...formData, [name]: currentList.filter(item => item !== value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
        if (errorMessage) setErrorMessage('');
    };

    const isIdentificacionComplete = () => formData.nombre_registro && formData.descripcion_registro && formData.cargo_responsable;
    const isNormativoComplete = () => formData.numero_ley && formData.url_ley;
    const isUsuariosComplete = () => formData.pago_asociado && formData.tipo_usuario;
    const isSoporteComplete = () => formData.nivel_digitalizacion && formData.tipo_expediente;
    const isIdentidadComplete = () => formData.firma_electronica;
    const isNotificacionesComplete = () => formData.notificacion_practicada;
    const isDocumentosComplete = () => formData.datos_otros_organos && formData.documentos_notariales;

    const calcularProgresoTotal = () => {
        const camposAValidar = [
            formData.nombre_registro, formData.descripcion_registro, formData.area_responsable,
            formData.cargo_responsable, formData.tipo_inicio, formData.acto_inicio, formData.acto_termino,
            formData.producto_institucional, formData.numero_ley, formData.url_ley, formData.otras_fuentes,
            formData.pago_asociado, formData.tipo_usuario, formData.segmento_usuario, formData.disponibilidad_realizacion,
            formData.nivel_digitalizacion, formData.canales_transaccionales, formData.tipo_expediente,
            formData.ficha_chileatiende, formData.firma_electronica, formData.notificacion_practicada,
            formData.datos_otros_organos, formData.documentos_notariales, formData.medio_comunicaciones, formData.info_adicional
        ];

        const totalCampos = camposAValidar.length;
        const camposCompletados = camposAValidar.filter(campo => {
            if (Array.isArray(campo)) return campo.length > 0;
            return campo !== null && campo !== undefined && String(campo).trim() !== '';
        }).length;

        return Math.min(Math.round((camposCompletados / totalCampos) * 100), 100);
    };

    const porcentajeAvance = calcularProgresoTotal();

    const validarUrl = (url) => {
        if (!url || url.trim() === '') return true; 
        const patronUrl = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        return patronUrl.test(url) || url.startsWith('http://') || url.startsWith('https://');
    };

    const guardarEnBaseDeDatos = async (estadoFinal = false) => {
        if (formData.url_ley && !validarUrl(formData.url_ley)) {
            setErrorMessage('La url ingresada no es válida');
            return false;
        }

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const url = procedureId ? `/admin/api/procedimientos/${procedureId}` : '/admin/api/procedimientos';
            const method = procedureId ? 'PUT' : 'POST';

            const payload = {
                ...formData,
                estado_registro: estadoFinal ? 'Completado' : 'Pendiente'
            };

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            
            if (response.ok && data.success) {
                if (!procedureId && data.data?.id) {
                    setProcedureId(data.data.id);
                }
                cargarRegistros();
                return true;
            } else {
                const errorDetalle = data.message || JSON.stringify(data.errors) || "Error desconocido en el servidor.";
                setErrorMessage("Error de servidor: " + errorDetalle);
                return false;
            }
        } catch (error) {
            console.error("Error de red", error);
            setErrorMessage("Error de red: " + error.message);
            return false;
        }
    };

    const handleGuardarYSalir = async () => {
        const exito = await guardarEnBaseDeDatos(false);
        if (exito) {
            setIsModalOpen(false);
        }
    };

    const currentIndex = tabsList.findIndex(tab => tab.id === activeTab);
    const esUltimoStep = currentIndex === tabsList.length - 1;

    const handleGuardarYContinuar = async () => {
        const exito = await guardarEnBaseDeDatos(esUltimoStep);
        if (!exito) return;

        if (!esUltimoStep) {
            setActiveTab(tabsList[currentIndex + 1].id);
        } else {
            alert("¡Procedimiento creado y finalizado con éxito!");
            setIsModalOpen(false);
        }
    };

    const handleKeyDownNavegacion = (e) => {
        if (e.key === 'Enter') {
            if (e.target.tagName === 'TEXTAREA') return;
            e.preventDefault();
            handleGuardarYContinuar();
        }
    };

    const registrosFiltrados = registros.filter(reg =>
        (reg.nombre_registro || '').toLowerCase().includes(busqueda.toLowerCase()) ||
        (reg.codigo_registro || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="w-full bg-white p-6 relative">
            <h1 className="text-2xl font-bold text-[#0a192f] mb-4">Nómina de procedimientos administrativos y otras tramitaciones</h1>

            <div className="flex justify-center mb-10">
                <button onClick={abrirModalCrear} className="bg-[#1976d2] hover:bg-blue-700 text-white font-medium py-2 px-6 rounded shadow">
                    + Crear registro
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
                                    <span className="border border-blue-400 text-blue-600 px-3 py-0.5 rounded-full text-xs font-medium bg-white">
                                        {registro.tipo_registro}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-3 py-0.5 rounded-full text-xs font-medium text-white ${registro.estado_registro === 'Completado' ? 'bg-green-600' : 'bg-orange-500'}`}>
                                        {registro.estado_registro || 'Pendiente'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Principal Superpuesto */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4 overflow-y-auto">
                    {modalStep === 'seleccion_tipo' && (
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl p-8 flex flex-col border border-gray-100 relative">

                            {errorMessage && (
                                <div className="mb-6 bg-white border border-red-300 text-red-900 px-4 py-3 rounded flex items-center justify-between shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-red-600 font-bold text-lg">❌</span>
                                        <span className="text-sm font-medium">{errorMessage}</span>
                                    </div>
                                    <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-800 font-bold text-lg px-2">×</button>
                                </div>
                            )}

                            <h2 className="text-2xl font-bold mb-1 text-[#0a192f]">¿Qué tipo de registro quieres crear?</h2>
                            <p className="text-xs text-gray-500 mb-6">Según el tipo de registro se desplegarán diversas preguntas de caracterización</p>

                            <div 
                                className="grid grid-cols-3 gap-4 mb-8 outline-none"
                                tabIndex="0"
                                onKeyDown={(e) => {
                                    const tipos = [
                                        'Procedimiento administrativo de función común',
                                        'Procedimiento administrativo de función específica',
                                        'Otras tramitaciones'
                                    ];
                                    let currentIndex = tipos.indexOf(formData.tipo_registro);

                                    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                                        e.preventDefault();
                                        currentIndex = (currentIndex + 1) % tipos.length;
                                        handleTipoChange(tipos[currentIndex]);
                                    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                                        e.preventDefault();
                                        currentIndex = (currentIndex - 1 + tipos.length) % tipos.length;
                                        handleTipoChange(tipos[currentIndex]);
                                    } else if (e.key === 'Enter') {
                                        e.preventDefault();
                                        const inputNombre = document.getElementById('input-nombre-registro');
                                        if (inputNombre) inputNombre.focus();
                                    }
                                }}
                            >
                                {[
                                    { titulo: 'Procedimiento administrativo de función común', desc: 'Asociado a funciones comunes o transversales a la gestión pública, en áreas de soporte o apoyo al mandato institucional...' },
                                    { titulo: 'Procedimiento administrativo de función específica', desc: 'Asociado a funciones específicas de los órganos de la administración del Estado, derivadas del cumplimiento del mandato institucional...' },
                                    { titulo: 'Otras tramitaciones', desc: 'Interacciones entre la institución y sus usuarios, usualmente se desprenden de las funciones específicas...' }
                                ].map((item) => {
                                    const isSelected = formData.tipo_registro === item.titulo;
                                    return (
                                        <div
                                            key={item.titulo}
                                            onClick={() => handleTipoChange(item.titulo)}
                                            className={`border rounded-lg p-5 cursor-pointer transition-all flex flex-col justify-between bg-white ${isSelected ? 'border-blue-600 bg-blue-50/50 shadow-sm' : 'border-gray-200 hover:border-gray-300'}`}
                                        >
                                            <div>
                                                <div className="flex items-start space-x-3 mb-3">
                                                    <input
                                                        type="radio"
                                                        name="tipo_registro_radio"
                                                        checked={isSelected}
                                                        onChange={() => handleTipoChange(item.titulo)}
                                                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 bg-white cursor-pointer"
                                                    />
                                                    <h3 className="font-bold text-sm text-[#0a192f] leading-snug">{item.titulo}</h3>
                                                </div>
                                                <p className="text-xs text-gray-600 leading-relaxed pl-7">{item.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mb-8 border-t pt-6">
                                <label className="block text-xs font-bold uppercase mb-2 text-gray-700">Nombre</label>
                                <input
                                    id="input-nombre-registro"
                                    type="text"
                                    name="nombre_registro"
                                    value={formData.nombre_registro}
                                    onChange={(e) => { handleFormChange(e); if (errorMessage) setErrorMessage(''); }}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (!formData.nombre_registro || formData.nombre_registro.trim() === '') {
                                                setErrorMessage('Debe ingresar el nombre del registro');
                                                return;
                                            }
                                            const exito = await guardarEnBaseDeDatos(false);
                                            if (exito) {
                                                setModalStep('wizard_formulario');
                                                setActiveTab('identificacion');
                                            }
                                        }
                                    }}
                                    placeholder="Ingrese el nombre del registro..."
                                    className="w-full bg-white border border-gray-300 rounded p-2.5 text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-gray-300 rounded text-gray-700 bg-white hover:bg-gray-50 text-sm">Cancelar</button>
                                <button
                                    onClick={async () => {
                                        if (!formData.nombre_registro || formData.nombre_registro.trim() === '') {
                                            setErrorMessage('Debe ingresar el nombre del registro');
                                            return;
                                        }
                                        const exito = await guardarEnBaseDeDatos(false);
                                        if (exito) {
                                            setModalStep('wizard_formulario');
                                            setActiveTab('identificacion');
                                        }
                                    }}
                                    className="px-6 py-2 bg-[#1976d2] text-white rounded hover:bg-blue-700 text-sm font-medium"
                                >
                                    Continuar
                                </button>
                            </div>
                        </div>
                    )}

                    {modalStep === 'wizard_formulario' && (
                        <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-100">
                            
                            {errorMessage && (
                                <div className="mx-6 mt-4 bg-white border border-red-300 text-red-900 px-4 py-3 rounded flex items-center justify-between shadow-sm">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-red-600 font-bold text-lg">❌</span>
                                        <span className="text-sm font-medium">{errorMessage}</span>
                                    </div>
                                    <button onClick={() => setErrorMessage('')} className="text-red-600 hover:text-red-800 font-bold text-lg px-2">×</button>
                                </div>
                            )}

                            <div className="px-6 py-4 border-b flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-sm font-bold text-blue-700">{formData.tipo_registro}</h3>
                                    <span className="text-xs text-gray-500">{formData.codigo_registro}</span>
                                </div>
                                <div className="w-1/2">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span>Estado de avance</span>
                                        <span className="font-bold">{porcentajeAvance}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                                        <div className="bg-blue-600 h-full transition-all" style={{ width: `${porcentajeAvance}%` }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-1 overflow-hidden bg-white">
                                <div className="w-64 border-r p-4 space-y-1 bg-white">
                                    {tabsList.map((tab, idx) => {
                                        let isComplete = false;
                                        if (tab.id === 'identificacion') isComplete = isIdentificacionComplete();
                                        else if (tab.id === 'normativo') isComplete = isNormativoComplete();
                                        else if (tab.id === 'usuarios') isComplete = isUsuariosComplete();
                                        else if (tab.id === 'soporte') isComplete = isSoporteComplete();
                                        else if (tab.id === 'identidad') isComplete = isIdentidadComplete();
                                        else if (tab.id === 'notificaciones') isComplete = isNotificacionesComplete();
                                        else if (tab.id === 'documentos') isComplete = isDocumentosComplete();
                                        else if (tab.id === 'adicional') isComplete = Boolean(formData.info_adicional && formData.info_adicional.trim().length > 0);

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => {
                                                    guardarEnBaseDeDatos(false);
                                                    setActiveTab(tab.id);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded text-sm flex justify-between items-center ${activeTab === tab.id ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-gray-700'}`}
                                            >
                                                <span>{idx + 1}. {tab.label}</span>
                                                <span>{isComplete ? '✅' : '⚠️'}</span>
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="flex-1 p-8 overflow-y-auto bg-white">
                                    <form id="wizard-form" onKeyDown={handleKeyDownNavegacion}>
                                        {activeTab === 'identificacion' && <IdentificacionStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'normativo' && <MarcoNormativoStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'usuarios' && <UsuariosStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'soporte' && <SoporteStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'identidad' && <IdentidadStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'notificaciones' && <NotificacionesStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'documentos' && <DocumentosStep formData={formData} handleFormChange={handleFormChange} />}
                                        {activeTab === 'adicional' && <AdicionalStep formData={formData} handleFormChange={handleFormChange} />}
                                    </form>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t bg-white flex justify-between items-center">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        if (currentIndex > 0) {
                                            guardarEnBaseDeDatos(false);
                                            setActiveTab(tabsList[currentIndex - 1].id);
                                        } else {
                                            setModalStep('seleccion_tipo');
                                        }
                                    }} 
                                    className="text-gray-600 text-sm hover:text-black"
                                >
                                    ◀ Anterior
                                </button>

                                <div className="space-x-3">
                                    <button 
                                        type="button" 
                                        onClick={handleGuardarYSalir} 
                                        className="px-4 py-2 border rounded text-sm bg-white hover:bg-gray-50 text-gray-700 font-medium"
                                    >
                                        Guardar y salir
                                    </button>

                                    <button 
                                        type="button" 
                                        onClick={handleGuardarYContinuar} 
                                        className="px-5 py-2 bg-[#1976d2] hover:bg-blue-700 text-white rounded text-sm font-medium shadow-xs"
                                    >
                                        {esUltimoStep ? 'Finalizar' : 'Guardar y continuar'}
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