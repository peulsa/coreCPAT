export default function Sidebar({ currentTab, setCurrentTab }) {
    const menuItems = [
        { id: 'inicio', label: 'Inicio', icon: '🏠' },
        { id: 'equipo', label: 'Equipo de trabajo', icon: '👥' },
        { id: 'nomina', label: 'Nómina de procedimientos y tramitaciones', icon: '📁' },
        { id: 'transacciones', label: 'Transacciones', icon: '📈' },
        { id: 'reportes', label: 'Reportes', icon: '📄' },
        { id: 'recursos', label: 'Recursos informativos', icon: '🗂️' },
        { id: 'ayuda', label: 'Ayuda', icon: '❓' },
        { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
        { id: 'periodos', label: 'Gestión de Períodos', icon: '📅' },
    ];

    return (
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
                {menuItems.map((item) => {
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
    );
}