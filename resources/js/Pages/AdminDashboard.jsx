import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import InicioView from './InicioView';
import GestionPeriodos from './periodos/GestionPeriodos';
import Nomina from './nomina/Nomina';
import Transacciones from './transacciones/Transacciones';

export default function AdminDashboard() {
    const [currentTab, setCurrentTab] = useState('inicio');
    const [periodoActivo, setPeriodoActivo] = useState(null);
    const [institucionInfo] = useState({
        nombre: 'Erika Alejandra Aristizabal Madrid',
        municipio: 'Municipalidad de Doñihue'
    });
    const [ciclosData, setCiclosData] = useState({ anterior: null, proximos: [] });

    useEffect(() => {
        fetch('/admin/api/periodo-activo')
            .then(res => res.json())
            .then(data => { if (data.success && data.data) setPeriodoActivo(data.data); })
            .catch(err => console.error("Error al cargar período activo", err));

        fetch('/admin/api/resumen-ciclos')
            .then(res => res.json())
            .then(data => { if (data.success) setCiclosData({ anterior: data.anterior, proximos: data.proximos }); })
            .catch(err => console.error("Error al cargar ciclos", err));
    }, []);

    const formatearFechaUI = (fechaStr) => {
        if (!fechaStr) return 'No definido';
        const [fecha, hora] = fechaStr.split(' ');
        const [anio, mes, dia] = fecha.split('-');
        const horaMin = hora ? hora.slice(0, 5) : '';
        return `${dia}/${mes}/${anio} ${horaMin}`;
    };

    // Validamos si la pestaña actual requiere diseño a pantalla completa sin el padding general
    const esVistaCompleta = currentTab === 'nomina' || currentTab === 'transacciones';

    return (
        <div className="min-h-screen bg-gray-100 flex font-sans text-gray-800">
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

            <div className="flex-1 flex flex-col min-w-0">
                <Header institucionInfo={institucionInfo} />

                <main className={`flex-1 overflow-y-auto ${!esVistaCompleta ? 'p-8' : ''}`}>
                    
                    {/* Ocultamos el breadcrumb general para las vistas que traen el suyo propio (Nomina y Transacciones) */}
                    {!esVistaCompleta && (
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
                    )}

                    {currentTab === 'periodos' && <GestionPeriodos />}
                    
                    {currentTab === 'nomina' && <Nomina />}

                    {/* Renderizado de la nueva vista de Transacciones */}
                    {currentTab === 'transacciones' && <Transacciones />}

                    {currentTab === 'inicio' && (
                        <InicioView 
                            institucionInfo={institucionInfo}
                            periodoActivo={periodoActivo}
                            ciclosData={ciclosData}
                            setCurrentTab={setCurrentTab}
                            formatearFechaUI={formatearFechaUI}
                        />
                    )}

                    {/* Se retiró 'transacciones' del array de vistas en construcción */}
                    {['equipo', 'reportes', 'estadisticas'].includes(currentTab) && currentTab !== 'periodos' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 m-8">
                            <h2 className="text-2xl font-bold text-[#0a192f] mb-3 capitalize">{currentTab}</h2>
                            <p className="text-sm text-gray-600">Módulo institucional correspondiente al sistema CPAT de la {institucionInfo.municipio}.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}