import React, { useRef, useState } from 'react';

export default function Transacciones() {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    // 1. Lógica para descargar la planilla
    const handleDownload = () => {
        // En Laravel, los archivos estáticos públicos deben ir en la carpeta public/
        // Asegúrate de mover 'transacciones.xlsx' a 'public/archivos/transacciones.xlsx'
        const fileUrl = '/archivos/transacciones.xlsx';
        
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = 'Planilla_Transacciones_CPAT.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // 2. Lógica para manejar el Drag & Drop
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    // 3. Lógica para manejar el clic en la zona (abre el explorador de archivos)
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const onZoneClick = () => {
        fileInputRef.current.click();
    };

    // 4. Procesamiento del archivo seleccionado
    const handleFile = (file) => {
        // Validamos que sea un excel
        const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
        
        if (!validTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('Por favor, sube un archivo Excel válido (.xlsx o .xls)');
            return;
        }

        setSelectedFile(file);
        
        // Aquí puedes disparar automáticamente la subida al backend o esperar a un botón
        console.log("Archivo listo para subir:", file.name);
        // uploadFileToBackend(file); 
    };

    return (
        <div className="w-full bg-white p-6 relative min-h-screen">
            <div className="flex items-center text-sm text-gray-600 mb-6 font-medium">
                <span className="hover:underline cursor-pointer">Inicio</span>
                <span className="mx-2 text-gray-400">▶</span>
                <span className="text-blue-700 font-semibold border-b border-blue-700 pb-0.5">Transacciones</span>
            </div>

            <h1 className="text-2xl font-bold text-[#0a192f] mb-4">Transacciones</h1>
            <p className="text-gray-700 text-sm mb-10 leading-relaxed">
                En este módulo podrás informar las transacciones asociadas a tu nómina de procedimientos administrativos y otras tramitaciones. Para ello debes seguir los pasos que te indicamos, donde el primero de ellos es descargar el formato de carga para luego informar tus transacciones. Es importante considerar que esta sección depende de lo que informes en el módulo de "Registro de procedimientos y tramitaciones", por lo que recomendamos primero revisar esa sección y posteriormente informar las transacciones.<br/><br/>
                La planilla de descarga contiene los 12 meses previos al mes de actualización vigente, por lo cual puedes ajustar y/o completar la información según corresponda.
            </p>

            <div className="max-w-6xl mx-auto">
                
                {/* Paso 1 */}
                <div className="flex">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-10 h-10 rounded-full border-2 border-[#1976d2] text-[#1976d2] flex items-center justify-center font-bold bg-white z-10 text-lg shadow-sm">
                            1
                        </div>
                        <div className="w-0.5 h-full bg-[#1976d2] opacity-50 mt-2"></div>
                    </div>
                    <div className="pb-12 w-full pt-1">
                        <h3 className="text-lg font-bold text-[#0a192f]">Descargue planilla de transacciones</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-4">
                            La siguiente planilla contiene la nómina de procedimientos administrativos y tramitaciones y sus canales de atención informados en la sección de Registro de procedimientos y tramitaciones de su institución.
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-5 flex items-center justify-between shadow-sm">
                            <div>
                                <h4 className="font-semibold text-gray-800 text-sm">Planilla base transacciones</h4>
                                <p className="text-xs text-gray-500 mt-0.5">Para cada mes debe completar los datos de transacciones según corresponda.</p>
                            </div>
                            <button 
                                onClick={handleDownload}
                                className="bg-[#1976d2] hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors shadow-sm"
                            >
                                Descargar planilla
                            </button>
                        </div>
                    </div>
                </div>

                {/* Paso 2 */}
                <div className="flex">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-10 h-10 rounded-full border-2 border-[#1976d2] text-[#1976d2] flex items-center justify-center font-bold bg-white z-10 text-lg shadow-sm">
                            2
                        </div>
                        <div className="w-0.5 h-full bg-[#1976d2] opacity-50 mt-2"></div>
                    </div>
                    <div className="pb-12 w-full pt-1">
                        <h3 className="text-lg font-bold text-[#0a192f]">Complete y cargue planilla de transacciones</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-4 leading-relaxed">
                            En la planilla no deben existir campos en blanco, si durante un período (mes) no hubo transacciones debe indicar "0", en el caso de que no cuente con un registro de información debe indicar "Sin información". La planilla no debe ser modificada, no puede agregar ni eliminar canales (filas) ni meses (columnas). Si se altera la planilla o existen campos en blanco, no podrá cargar la planilla en la plataforma.
                        </p>
                        
                        {/* Zona Drag & Drop Funcional */}
                        <div 
                            className={`border-2 border-dashed rounded-md h-32 flex flex-col items-center justify-center cursor-pointer transition-colors relative
                                ${dragActive ? 'border-blue-600 bg-blue-100' : 'border-[#82b1ff] bg-[#f8fbff] hover:bg-[#f0f7ff]'}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            onClick={onZoneClick}
                        >
                            {/* Input oculto para abrir el explorador nativo */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept=".xlsx, .xls"
                                onChange={handleChange}
                            />
                            
                            {selectedFile ? (
                                <div className="text-center">
                                    <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <p className="text-sm font-bold text-gray-800">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">Clic para cambiar de archivo</p>
                                </div>
                            ) : (
                                <>
                                    <svg className={`w-8 h-8 mb-2 ${dragActive ? 'text-blue-700' : 'text-[#1976d2]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <p className="text-sm font-medium text-gray-700">Arrastra archivo para subirlo o haz</p>
                                    <p className="text-sm font-medium text-gray-700">clic para seleccionarlo</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Paso 3 */}
                <div className="flex">
                    <div className="flex flex-col items-center mr-6">
                        <div className="w-10 h-10 rounded-full border-2 border-[#1976d2] text-[#1976d2] flex items-center justify-center font-bold bg-white z-10 text-lg shadow-sm">
                            3
                        </div>
                    </div>
                    <div className="w-full pt-1 pb-10">
                        <h3 className="text-lg font-bold text-[#0a192f]">Visualice las transacciones informadas</h3>
                        <p className="text-sm text-gray-600 mt-1 mb-8">
                            En el siguiente gráfico se visualizan las transacciones por mes y canal transaccional, en base a la última planilla cargada en el paso anterior.
                        </p>
                        <div className="flex items-center justify-center py-10">
                            <p className="text-sm text-gray-500 font-medium">No se han cargado transacciones para esta institución</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}