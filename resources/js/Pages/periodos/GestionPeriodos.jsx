import React, { useState, useEffect } from 'react';

export default function GestionPeriodos() {
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

        if (!formData.fecha_inicio || !formData.fecha_fin) {
            setMessage({ type: 'error', text: 'Por favor, selecciona la fecha y hora de inicio y cierre.' });
            return;
        }

        if (!formData.descripcion.trim()) {
            setMessage({ type: 'error', text: 'Por favor, ingresa una descripción para el período.' });
            return;
        }

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