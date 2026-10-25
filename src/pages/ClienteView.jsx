import { PlusCircle, Wrench, RefreshCw, MapPin, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { workOrdersApi } from '../services/api';
import EtiquetaEstado from '../components/EtiquetaEstado';
import AlertaMensaje from '../components/AlertaMensaje';

export default function ClienteView() {
    const { instance, accounts } = useMsal();
    const [direccion, setDireccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [ordenes, setOrdenes] = useState([]);
    const [cargandoOrdenes, setCargandoOrdenes] = useState(false);
    const [filtro, setFiltro] = useState('activas');

    const usuarioId = accounts[0]?.localAccountId || accounts[0]?.username || '';
    const clienteNombre = accounts[0]?.name || accounts[0]?.username || 'Cliente';

    const etapas = [
        { key: 'CREADA', label: '1. Creada' },
        { key: 'ASIGNADA', label: '2. Asignada' },
        { key: 'EN_DESPLAZAMIENTO', label: '3. En ruta' },
        { key: 'EN_EJECUCION', label: '4. En ejecucion' },
        { key: 'CERRADA', label: '5. Cerrada' }
    ];

    const cargarOrdenes = async () => {
        try {
            setCargandoOrdenes(true);
            const respuesta = await workOrdersApi.getAll(instance);
            let lista = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
            if (Array.isArray(lista)) {//filtrar
                const misOrdenes = lista.filter(item => 
                    item.clienteId === usuarioId || item.clienteNombre === clienteNombre
                );
                setOrdenes(misOrdenes.length > 0 ? misOrdenes : lista);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setCargandoOrdenes(false);
        }
    };

    useEffect(() => {
        cargarOrdenes();
    }, []);

    const handleSubmit = async (e) => {//enviar
        e.preventDefault();
        setLoading(true);
        setMessage({ text: '', type: '' });

        const nuevaOrden = {
            clienteId: usuarioId || 'desconocido',
            clienteNombre,
            direccion,
            descripcion,
            descripcionProblema: descripcion,
            estado: 'CREADA'
        };

        try {//guardar
            const respuesta = await workOrdersApi.create(instance, nuevaOrden);
            let datos = typeof respuesta === 'string' ? JSON.parse(respuesta) : respuesta;
            const id = datos?.id || 'registrada';
            setMessage({ text: `Orden creada exitosamente con ID: ${id}`, type: 'success' });
            setDireccion('');
            setDescripcion('');
            cargarOrdenes();
        } catch (error) {
            setMessage({ text: `Error al crear la orden: ${error.message}`, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (id) => {//cancelar
        if (!window.confirm('Deseas cancelar esta orden')) return;
        try {
            await workOrdersApi.updateStatus(instance, id, 'CANCELADA');
            setMessage({ text: `Orden #${id} cancelada`, type: 'success' });
            cargarOrdenes();
        } catch (error) {
            setMessage({ text: `Error al cancelar: ${error.message}`, type: 'error' });
        }
    };

    const finalizados = ['CERRADA', 'CANCELADA'];
    const ordenesActivas = ordenes.filter(o => !finalizados.includes((o.estado || '').replace('Ó', 'O')));
    const ordenesFinalizadas = ordenes.filter(o => finalizados.includes((o.estado || '').replace('Ó', 'O')));
    const ordenesMostradas = filtro === 'activas' ? ordenesActivas : ordenesFinalizadas;

    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-md shadow-sm border border-slate-300 p-6 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Wrench className="text-blue-600" />
                        <h2 className="text-xl font-bold tracking-tight">Nueva Solicitud</h2>
                    </div>

                    <AlertaMensaje mensaje={message} className="mb-4" />

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Dirección
                            </label>
                            <input 
                                type="text" 
                                required
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all bg-white"
                                placeholder="Ej. Antonio Varas 666" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Descripción de la falla
                            </label>
                            <textarea 
                                required
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all bg-white" 
                                rows="4"
                                placeholder="Describe el problema eléctrico detalladamente..."
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-2 w-full font-semibold py-3 px-4 rounded-md shadow-sm flex items-center justify-center gap-2 transition-colors ${loading ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
                        >
                            <PlusCircle size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Guardando en servidor...' : 'Enviar Solicitud'}
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Mis Solicitudes</h2>
                        <p className="text-sm text-slate-500">Historial y estado de tus requerimientos técnicos.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex border border-slate-300 rounded-xs overflow-hidden text-xs font-mono">
                            <button
                                type="button"
                                onClick={() => setFiltro('activas')}
                                className={`px-3 py-1.5 transition-colors ${filtro === 'activas' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                En curso ({ordenesActivas.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setFiltro('finalizadas')}
                                className={`px-3 py-1.5 border-l border-slate-300 transition-colors ${filtro === 'finalizadas' ? 'bg-slate-900 text-white font-bold' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                            >
                                Historial ({ordenesFinalizadas.length})
                            </button>
                        </div>
                        <button 
                            onClick={cargarOrdenes}
                            disabled={cargandoOrdenes}
                            className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-2.5 py-1.5 rounded-xs border border-slate-300 hover:bg-slate-50 transition-all"
                        >
                            <RefreshCw size={12} className={cargandoOrdenes ? 'animate-spin' : ''} />
                            Actualizar
                        </button>
                    </div>
                </div>
                
                {ordenesMostradas.length === 0 ? (
                    <div className="bg-white rounded-md shadow-sm border border-slate-300 p-8 text-center text-slate-500 text-sm">
                        {filtro === 'activas' ? 'No tienes solicitudes activas en curso.' : 'No hay solicitudes finalizadas en tu historial.'}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {ordenesMostradas.map((orden) => {
                            const estadoNorm = (orden.estado || '').replace('Ó', 'O');
                            const pasoActual = etapas.findIndex(e => e.key === estadoNorm);
                            const esCancelada = orden.estado === 'CANCELADA';

                            return (
                                <div key={orden.id} className="bg-white rounded-md shadow-sm border border-slate-300 p-5">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-slate-900 text-base">#{orden.id}</span>
                                                <EtiquetaEstado estado={orden.estado} />
                                            </div>
                                            <div className="flex items-center text-xs text-black gap-1.5">
                                                <MapPin size={13} className="text-black" />
                                                <span className="font-semibold text-black">{orden.direccion || 'Sin direccion'}</span>
                                            </div>
                                            {(orden.tecnicoAsignado || orden.tecnicoNombre) && (
                                                <div className="text-xs font-mono text-black pt-1 flex items-center gap-1.5">
                                                    <span className="uppercase tracking-wider text-[11px] text-black">Tecnico:</span>
                                                    <span className="font-semibold text-black">{orden.tecnicoAsignado || orden.tecnicoNombre}</span>
                                                </div>
                                            )}
                                        </div>

                                        {orden.estado === 'CREADA' && (
                                            <button 
                                                onClick={() => handleCancelar(orden.id)}
                                                className="px-3 py-1 text-xs font-mono font-semibold text-white bg-rose-900 hover:bg-rose-950 border border-rose-900 rounded-[10px] transition-colors shadow-xs"
                                            >
                                                Cancelar orden
                                            </button>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-800 mt-3 p-3 bg-slate-100 border border-slate-300 rounded-[10px]">
                                        {orden.descripcionProblema || orden.descripcion}
                                    </p>

                                    <div className="mt-4 pt-3 border-t border-slate-200">
                                        {esCancelada ? (
                                            <div className="flex items-center gap-2 text-xs font-mono text-red-700">
                                                <AlertCircle size={14} /> Solicitud cancelada por el cliente.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-5 gap-2">
                                                {etapas.map((etapa, idx) => {
                                                    const completada = pasoActual >= idx;
                                                    const activa = pasoActual === idx;
                                                    return (
                                                        <div key={etapa.key} className="flex flex-col gap-1">
                                                            <div className={`h-1.5 rounded-xs transition-colors ${
                                                                completada ? 'bg-slate-900' : 'bg-slate-200'
                                                            } ${activa ? 'ring-1 ring-slate-900' : ''}`} />
                                                            <span className={`text-[10px] font-mono leading-none ${
                                                                activa ? 'font-bold text-slate-900' : completada ? 'text-slate-700' : 'text-slate-400'
                                                            }`}>
                                                                {etapa.label}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
