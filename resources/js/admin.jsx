import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- COMPONENTE PRINCIPAL DEL DASHBOARD ---
function AdminDashboard() {
    const [currentTab, setCurrentTab] = useState('inicio');
    const [periodoActivo, setPeriodoActivo] = useState(null);
    

    const [institucionInfo] = useState({
        nombre: 'Erika Alejandra Aristizabal Madrid',
        municipio: 'Municipalidad de Doñihue'
    });

    const [ciclosData, setCiclosData] = useState({ anterior: null, proximos: [] });

    useEffect(() => {
        // Cargar período activo
        fetch('/admin/api/periodo-activo')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setPeriodoActivo(data.data);
                }
            })
            .catch(err => console.error("Error al cargar período activo", err));

        // Cargar resumen de ciclos (anterior y próximos)
        fetch('/admin/api/resumen-ciclos')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCiclosData({ anterior: data.anterior, proximos: data.proximos }); // CORREGIDO: setCiclosData
                }
            })
            .catch(err => console.error("Error al cargar ciclos", err));
    }, []);

    // Formatear fecha para la interfaz (YYYY-MM-DD HH:mm:ss a DD/MM/YYYY HH:mm)
    const formatearFechaUI = (fechaStr) => {
        if (!fechaStr) return 'No definido';
        const [fecha, hora] = fechaStr.split(' ');
        const [anio, mes, dia] = fecha.split('-');
        const horaMin = hora ? hora.slice(0, 5) : '';
        return `${dia}/${mes}/${anio} ${horaMin}`;
    };

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
            {/* Barra lateral institucional */}
            <aside className="w-72 bg-[#0a192f] text-white flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
                    <div className="bg-white p-2 rounded text-[#0a192f] font-bold text-xl flex items-center justify-center shadow">📋</div>
                    <div>
                        <span className="font-bold text-lg tracking-wider block leading-tight">coreCPAT</span>
                        <span className="text-[10px] text-gray-300 uppercase tracking-wider block mt-1">
                            Catálogo de Procedimientos Administrativos y Tramitaciones
                        </span>
                    </div>
                </div>

                <nav className="flex-1 py-4 px-3 space-y-1.5">
                    {[
                        { id: 'inicio', label: 'Inicio', icon: '🏠' },
                        { id: 'equipo', label: 'Equipo de trabajo', icon: '👥' },
                        { id: 'nomina', label: 'Nómina de procedimientos y tramitaciones', icon: '📁' },
                        { id: 'transacciones', label: 'Transacciones', icon: '📈' },
                        { id: 'reportes', label: 'Reportes', icon: '📄' },
                        { id: 'recursos', label: 'Recursos informativos', icon: '🗂️' },
                        { id: 'ayuda', label: 'Ayuda', icon: '❓' },
                        { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
                        { id: 'periodos', label: 'Gestión de Períodos', icon: '📅' },
                    ].map((item) => {
                        const isActive = currentTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentTab(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-[#1976d2] text-white shadow-md font-semibold'
                                        : 'text-gray-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                <span className="text-left leading-snug">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Contenedor Principal */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-[#0a192f] text-white h-20 flex items-center justify-between px-8 shadow-md border-b border-slate-800">
                    <div className="text-sm text-gray-300"></div>
                    <div className="flex items-center space-x-4">
                        <div className="bg-[#e65100] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow">EA</div>
                        <div className="text-right">
                            <span className="block text-sm font-bold tracking-tight">{institucionInfo.nombre}</span>
                            <span className="block text-xs text-gray-300">{institucionInfo.municipio}</span>
                        </div>
                        <span className="text-gray-400 text-xs">▼</span>
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-[#1976d2] font-semibold cursor-pointer" onClick={() => setCurrentTab('inicio')}>Inicio</span>
                            {currentTab !== 'inicio' && (
                                <>
                                    <span className="text-gray-400">▶</span>
                                    <span className="text-gray-700 font-medium capitalize">
                                        {currentTab === 'periodos' ? 'Gestión de Períodos' : currentTab}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* VISTA: GESTIÓN DE PERÍODOS */}
                    {currentTab === 'periodos' && <GestionPeriodos />}

                    {/* VISTA: INICIO */}
                    {currentTab === 'inicio' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-[#1976d2] text-white w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg shadow">EA</div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{institucionInfo.nombre} te damos la bienvenida al CPAT</h2>
                                            <span className="inline-block mt-2 px-3 py-1 bg-sky-50 text-[#1976d2] border border-sky-200 rounded-full text-xs font-semibold">
                                                Editor(a) - {institucionInfo.municipio}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                                    <div className="text-sm text-gray-600 mb-1">Fecha del periodo activo</div>
                                    <div className="text-base font-semibold text-gray-900 mb-4">
                                        {periodoActivo 
                                            ? `${formatearFechaUI(periodoActivo.fecha_inicio)} al ${formatearFechaUI(periodoActivo.fecha_fin)}` 
                                            : 'No hay períodos activos configurados'}
                                    </div>

                                    <div className="text-sm text-gray-600 mb-1">Estado de la institución</div>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className={`w-3 h-3 rounded-full inline-block ${periodoActivo?.estado === 'En proceso' ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                                        <span className="text-base font-semibold text-gray-900">
                                            {periodoActivo ? periodoActivo.estado : 'Sin período'}
                                        </span>
                                    </div>
                                    <div className="border border-green-600 rounded-xl p-4 bg-green-50/30 text-gray-700 text-sm font-medium">
                                        {periodoActivo?.descripcion || 'Configura un período en la sección de Gestión de Períodos para habilitar el ingreso.'}
                                    </div>
                                </div>
                            </div>

                            {/* TARJETA EDITADA: GESTIÓN DE CICLOS CON HISTORIAL */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                                    <div className="bg-sky-50 p-2.5 rounded-xl text-xl">📅</div>
                                    <h3 className="text-lg font-bold text-gray-900">Gestión de Ciclos</h3>
                                </div>
                                <p className="text-sm text-gray-600 mb-6">Administra los ciclos y períodos anuales de actualización directamente en el sistema.</p>
                                <button onClick={() => setCurrentTab('periodos')} className="w-full bg-[#1976d2] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#1565c0] transition-colors mb-6">
                                    Ir a Gestión de Períodos
                                </button>

                                {/* SECCIÓN: PERÍODO ANTERIOR */}
                                <div className="mb-6 pt-4 border-t border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Período anterior</h4>
                                    {ciclosData.anterior ? (
                                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
                                            <div className="font-semibold text-gray-800">{ciclosData.anterior.titulo}</div>
                                            <div className="text-xs text-gray-500 mt-1">{ciclosData.anterior.rango_texto}</div>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No hay registros anteriores.</p>
                                    )}
                                </div>

                                {/* SECCIÓN: PRÓXIMOS PERIODOS */}
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Próximos períodos</h4>
                                    {ciclosData.proximos.length > 0 ? (
                                        <div className="space-y-2">
                                            {ciclosData.proximos.map(p => (
                                                <div key={p.id} className="p-3 bg-sky-50/50 rounded-xl border border-sky-100 text-sm">
                                                    <div className="font-semibold text-[#1976d2]">{p.titulo}</div>
                                                    <div className="text-xs text-gray-600 mt-1">{p.rango_texto}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 italic">No hay períodos próximos programados.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {['equipo', 'nomina', 'transacciones', 'reportes', 'recursos', 'ayuda', 'estadisticas'].includes(currentTab) && currentTab !== 'periodos' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h2 className="text-2xl font-bold text-[#0a192f] mb-3 capitalize">{currentTab}</h2>
                            <p className="text-sm text-gray-600">Módulo institucional correspondiente al sistema CPAT de la {institucionInfo.municipio}.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTE: GESTIÓN DE PERÍODOS (CRUD CON AUTOCOMPLETADO Y CÁLCULO AUTOMÁTICO) ---
function GestionPeriodos() {
    const [periodos, setPeriodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        rango_texto: '',
        titulo: '',
        descripcion: '',
        estado: 'Próximo'
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        fetchPeriodos();
    }, []);

    const handleFechaChange = (tipo, valor) => {
        const nuevasFechas = { ...formData, [tipo]: valor };

        if (nuevasFechas.fecha_inicio && nuevasFechas.fecha_fin) {
            const fInicio = new Date(nuevasFechas.fecha_inicio);
            const fFin = new Date(nuevasFechas.fecha_fin);
            const ahora = new Date();

            const diaInicio = String(fInicio.getDate()).padStart(2, '0');
            const mesInicio = String(fInicio.getMonth() + 1).padStart(2, '0');
            const diaFin = String(fFin.getDate()).padStart(2, '0');
            const mesFin = String(fFin.getMonth() + 1).padStart(2, '0');
            nuevasFechas.rango_texto = `${diaInicio}/${mesInicio} al ${diaFin}/${mesFin}`;

            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            const nombreMes = meses[fInicio.getMonth()];
            const anioInicio = fInicio.getFullYear();
            nuevasFechas.titulo = `Actualización de ${nombreMes} ${anioInicio}`;

            if (ahora < fInicio) {
                nuevasFechas.estado = 'Próximo';
            } else if (ahora >= fInicio && ahora <= fFin) {
                nuevasFechas.estado = 'En proceso';
            } else {
                nuevasFechas.estado = 'Finalizado';
            }
        }

        setFormData(nuevasFechas);
    };

    const fetchPeriodos = async () => {
        try {
            const res = await fetch('/admin/api/periodos');
            const data = await res.json();
            setPeriodos(data);
        } catch (error) {
            console.error('Error al cargar períodos', error);
        } finally {
            setLoading(false);
        }
    };

const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);

        // 1. Validaciones manuales en español
        if (!formData.fecha_inicio || !formData.fecha_fin) {
            setMessage({ type: 'error', text: 'Por favor, selecciona la fecha y hora de inicio y cierre.' });
            return;
        }

        if (!formData.descripcion.trim()) {
            setMessage({ type: 'error', text: 'Por favor, ingresa una descripción para el período.' });
            return;
        }

        // 2. Formatear las fechas para el backend (YYYY-MM-DD HH:mm:ss)
        const formatDateTime = (val) => {
            if (!val) return '';
            return val.replace('T', ' ');
        };

        const payload = {
            ...formData,
            fecha_inicio: formatDateTime(formData.fecha_inicio),
            fecha_fin: formatDateTime(formData.fecha_fin)
        };

        const url = editingId ? `/admin/api/periodos/${editingId}` : '/admin/api/periodos';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (res.ok) {
                setMessage({ type: 'success', text: data.message });
                setFormData({ fecha_inicio: '', fecha_fin: '', rango_texto: '', titulo: '', descripcion: '', estado: 'Próximo' });
                setEditingId(null);
                fetchPeriodos();
            } else {
                setMessage({ 
                    type: 'error', 
                    text: data.message || 'Verifica los campos del formulario.' 
                });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error de conexión con el servidor.' });
        }
    };
    const handleEdit = (p) => {
        setEditingId(p.id);
        setFormData({
            fecha_inicio: p.fecha_inicio.slice(0, 16),
            fecha_fin: p.fecha_fin.slice(0, 16),
            rango_texto: p.rango_texto,
            titulo: p.titulo,
            descripcion: p.descripcion,
            estado: p.estado
        });
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este período?')) return;

        try {
            const res = await fetch(`/admin/api/periodos/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchPeriodos();
            }
        } catch (error) {
            console.error('Error al eliminar', error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-[#0a192f] mb-2">Gestión y Edición de Períodos</h2>
                <p className="text-sm text-gray-600 mb-6">Selecciona las fechas de inicio y cierre; el sistema autocompletará el rango, el título estandarizado y el estado.</p>

                {message && (
                    <div className={`p-4 rounded-xl text-sm mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha y hora de Inicio</label>
                        <input 
                            type="datetime-local" 
                            value={formData.fecha_inicio} 
                            onChange={(e) => handleFechaChange('fecha_inicio', e.target.value)}  
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fecha y hora de Cierre</label>
                        <input 
                            type="datetime-local" 
                            value={formData.fecha_fin} 
                            onChange={(e) => handleFechaChange('fecha_fin', e.target.value)}  
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Rango en texto (Autogenerado)</label>
                        <input 
                            type="text" 
                            value={formData.rango_texto} 
                            readOnly 
                            className="w-full p-2.5 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg text-sm cursor-not-allowed" 
                            placeholder="Ej: 02/09 al 30/09" 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Título del período (Estandarizado)</label>
                        <input 
                            type="text" 
                            value={formData.titulo} 
                            readOnly 
                            className="w-full p-2.5 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg text-sm cursor-not-allowed" 
                            placeholder="Ej: Actualización de septiembre 2026" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Descripción</label>
                        <textarea 
                            value={formData.descripcion} 
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}  
                            rows="2" 
                            className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm" 
                            placeholder="En este período podrás ajustar tu nómina oficial..."
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estado (Autocalculado)</label>
                        <input 
                            type="text" 
                            value={formData.estado} 
                            readOnly 
                            className="w-full p-2.5 bg-gray-100 font-semibold text-[#1976d2] border border-gray-300 rounded-lg text-sm cursor-not-allowed" 
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end space-x-3 pt-2">
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ fecha_inicio: '', fecha_fin: '', rango_texto: '', titulo: '', descripcion: '', estado: 'Próximo' }); }} className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg text-sm">
                                Cancelar
                            </button>
                        )}
                        <button type="submit" className="px-6 py-2.5 bg-[#1976d2] text-white font-bold rounded-lg text-sm hover:bg-[#1565c0]">
                            {editingId ? 'Actualizar Período' : 'Guardar Nuevo Período'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-[#0a192f] mb-4">Listado de Períodos Registrados</h3>
                {loading ? (
                    <p className="text-sm text-gray-500">Cargando períodos...</p>
                ) : periodos.length === 0 ? (
                    <p className="text-sm text-gray-500">No hay períodos registrados todavía. ¡Crea el primero arriba!</p>
                ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1976d2] text-white text-xs font-semibold uppercase tracking-wider">
                                    <th className="py-3 px-4">Rango</th>
                                    <th className="py-3 px-4">Título</th>
                                    <th className="py-3 px-4">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-gray-700 divide-y divide-gray-100 bg-white">
                                {periodos.map((p) => (
                                    <tr key={p.id}>
                                        <td className="py-3 px-4 font-semibold text-[#1976d2]">{p.rango_texto}</td>
                                        <td className="py-3 px-4 font-medium">{p.titulo}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.estado === 'En proceso' ? 'bg-green-100 text-green-800' : p.estado === 'Próximo' ? 'bg-sky-100 text-sky-800' : 'bg-gray-100 text-gray-700'}`}>
                                                {p.estado}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline text-xs font-semibold">Editar</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:underline text-xs font-semibold">Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

if (document.getElementById('admin-app')) {
    createRoot(document.getElementById('admin-app')).render(<AdminDashboard />);
}