import { Users, Truck, Play, CheckCircle, RefreshCw, UserCheck, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { Link } from 'react-router-dom';
import { workOrdersApi } from '../services/api';
import EtiquetaEstado from '../components/EtiquetaEstado';
import AlertaMensaje from '../components/AlertaMensaje';

export default function SupervisorView() {
    const { instance } = useMsal();
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [tecnicosInput, setTecnicosInput] = useState({});
    const [filtroActivo, setFiltroActivo] = useState('TODAS');

    const cargarOrdenes = async () => {
        try {
            setCargando(true);
            const respuesta = await workOrdersApi.getAll(instance);
            const lista = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
            setOrdenes(Array.isArray(lista) ? lista : []);
        } catch (error) {
            setMensaje({ text: `Error al cargar: ${error.message}`, type: 'error' });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await workOrdersApi.updateStatus(instance, id, nuevoEstado);
            setMensaje({ text: `Orden #${id} actualizada a: ${nuevoEstado}`, type: 'success' });
            cargarOrdenes();
        } catch (error) {
            setMensaje({ text: `Error al actualizar: ${error.message}`, type: 'error' });
        }
    };

    const handleAsignarTecnico = async (id) => {
        const tecnico = tecnicosInput[id];
        if (!tecnico || tecnico.trim() === '') {
            alert('Debes ingresar el nombre del tecnico');
            return;
        }

        try {
            await workOrdersApi.updateStatus(instance, id, 'ASIGNADA', tecnico.trim());
            setMensaje({ text: `Tecnico ${tecnico} asignado a la orden #${id}`, type: 'success' });
            setTecnicosInput({ ...tecnicosInput, [id]: '' });
            cargarOrdenes();
        } catch (error) {
            setMensaje({ text: `Error en la asignacion: ${error.message}`, type: 'error' });
        }
    };

    const ordenesFiltradas = ordenes.filter((orden) => {
        const estado = (orden.estado || '').replace('Ó', 'O');
        if (filtroActivo === 'PENDIENTES') return estado === 'CREADA';
        if (filtroActivo === 'EN_TERRENO') {
            return ['ASIGNADA', 'EN_DESPLAZAMIENTO', 'EN_EJECUCION'].includes(estado);
        }
        if (filtroActivo === 'FINALIZADAS') {
            return ['CERRADA', 'CANCELADA'].includes(estado);
        }
        return true;
    });

    const conteoPendientes = ordenes.filter(o => (o.estado || '') === 'CREADA').length;
    const conteoEnTerreno = ordenes.filter(o => ['ASIGNADA', 'EN_DESPLAZAMIENTO', 'EN_EJECUCION', 'EN_EJECUCIÓN'].includes(o.estado || '')).length;
    const conteoFinalizadas = ordenes.filter(o => ['CERRADA', 'CANCELADA'].includes(o.estado || '')).length;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Users className="text-blue-600" />
                        Panel de Coordinación y Terreno (Supervisor)
                    </h1>
                    <p className="text-sm text-slate-500">Gestión de estados, técnicos y ciclo de vida de mantenciones.</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                        to="/catalog"
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-3 py-1.5 rounded-xs border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        <BookOpen size={13} />
                        Catálogo Técnico
                    </Link>
                    <button
                        onClick={cargarOrdenes}
                        disabled={cargando}
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-3 py-1.5 rounded-xs border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        <RefreshCw size={13} className={cargando ? 'animate-spin' : ''} />
                        Actualizar Lista
                    </button>
                </div>
            </div>

            <AlertaMensaje mensaje={mensaje} className="mb-6" />

            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: 'TODAS', label: `Todas (${ordenes.length})` },
                    { id: 'PENDIENTES', label: `Por Asignar (${conteoPendientes})` },
                    { id: 'EN_TERRENO', label: `En Terreno (${conteoEnTerreno})` },
                    { id: 'FINALIZADAS', label: `Historial (${conteoFinalizadas})` }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setFiltroActivo(tab.id)}
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded-xs border transition-colors ${
                            filtroActivo === tab.id
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {ordenesFiltradas.length === 0 ? (
                <div className="bg-white rounded-md shadow-sm border border-slate-300 p-8 text-center text-slate-500 text-sm font-mono">
                    No hay órdenes en esta categoría.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ordenesFiltradas.map((orden) => {
                        const estado = (orden.estado || '').replace('Ó', 'O');
                        return (
                            <div key={orden.id} className="bg-white rounded-md shadow-sm border border-slate-300 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-mono font-bold text-slate-900 text-base">#{orden.id}</span>
                                        <EtiquetaEstado estado={orden.estado} />
                                    </div>

                                    <div className="text-xs space-y-1 mt-2 text-black">
                                        <p className="font-mono text-black">
                                            Cliente: <span className="font-semibold text-black">{orden.clienteNombre || 'Sin nombre'}</span>
                                        </p>
                                        <p className="font-mono text-black">
                                            Dirección: <span className="font-semibold text-black">{orden.direccion}</span>
                                        </p>
                                        {(orden.tecnicoAsignado || orden.tecnicoNombre) && (
                                            <p className="font-mono text-black">
                                                Técnico: <span className="font-semibold text-black">{orden.tecnicoAsignado || orden.tecnicoNombre}</span>
                                            </p>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-800 mt-3 p-3 bg-slate-100 border border-slate-300 rounded-[10px]">
                                        {orden.descripcionProblema || orden.descripcion}
                                    </p>
                                </div>

                                <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col gap-2">
                                    {estado === 'CREADA' && (
                                        <div className="flex flex-col gap-2">
                                            <input
                                                type="text"
                                                placeholder="Nombre del técnico..."
                                                value={tecnicosInput[orden.id] || ''}
                                                onChange={(e) => setTecnicosInput({ ...tecnicosInput, [orden.id]: e.target.value })}
                                                className="w-full border border-slate-300 rounded-xs px-3 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                                            />
                                            <button
                                                onClick={() => handleAsignarTecnico(orden.id)}
                                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-medium py-1.5 px-3 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <UserCheck size={14} /> Asignar Cuadrilla
                                            </button>
                                        </div>
                                    )}

                                    {estado === 'ASIGNADA' && (
                                        <button
                                            onClick={() => cambiarEstado(orden.id, 'EN_DESPLAZAMIENTO')}
                                            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-mono font-medium py-1.5 px-3 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Truck size={14} /> Despachar a Terreno
                                        </button>
                                    )}

                                    {estado === 'EN_DESPLAZAMIENTO' && (
                                        <button
                                            onClick={() => cambiarEstado(orden.id, 'EN_EJECUCION')}
                                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-mono font-medium py-1.5 px-3 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <Play size={14} /> Iniciar Reparación
                                        </button>
                                    )}

                                    {estado === 'EN_EJECUCION' && (
                                        <button
                                            onClick={() => cambiarEstado(orden.id, 'CERRADA')}
                                            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-medium py-1.5 px-3 rounded-xs text-xs flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <CheckCircle size={14} /> Finalizar y Cerrar Orden
                                        </button>
                                    )}

                                    {(estado === 'CERRADA' || estado === 'CANCELADA') && (
                                        <span className="text-center text-xs font-mono text-slate-400 py-1">
                                            Orden finalizada sin acciones pendientes
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
