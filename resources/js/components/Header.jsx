export default function Header({ institucionInfo }) {
    return (
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
    );
}