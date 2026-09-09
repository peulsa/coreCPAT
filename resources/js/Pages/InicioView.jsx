export default function InicioView({ institucionInfo, periodoActivo, ciclosData, setCurrentTab, formatearFechaUI }) {
    return (
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-100">
                    <div className="bg-sky-50 p-2.5 rounded-xl text-xl">📅</div>
                    <h3 className="text-lg font-bold text-gray-900">Gestión de Ciclos</h3>
                </div>
                <p className="text-sm text-gray-600 mb-6">Administra los ciclos y períodos anuales de actualización directamente en el sistema.</p>
                <button onClick={() => setCurrentTab('periodos')} className="w-full bg-[#1976d2] text-white font-semibold py-3 rounded-xl text-sm hover:bg-[#1565c0] transition-colors mb-6">
                    Ir a Gestión de Períodos
                </button>

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
    );
}