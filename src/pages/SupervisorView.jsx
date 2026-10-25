import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { Link } from 'react-router-dom';
import { workOrdersApi, catalogApi } from '../services/api';
import AlertaMensaje from '../components/AlertaMensaje';
import TarjetaOrdenSupervisor from '../components/TarjetaOrdenSupervisor';
import { Users, RefreshCw, BookOpen } from 'lucide-react';

export default function SupervisorView() {
    const { instance } = useMsal();
    const [ordenes, setOrdenes] = useState([]);
    const [repuestos, setRepuestos] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });
    const [filtroActivo, setFiltroActivo] = useState('TODAS');

    const cargarTodo = async () => {
        try {
            setCargando(true);
            setMensaje({ text: '', type: '' });
            const [respOrdenes, respCatalogo] = await Promise.allSettled([
                workOrdersApi.getAll(instance),
                catalogApi.getAll(instance)
            ]);

            if (respOrdenes.status === 'fulfilled') {
                const listaOrdenes = typeof respOrdenes.value === 'string' ? JSON.parse(respOrdenes.value) : respOrdenes.value;
                setOrdenes(Array.isArray(listaOrdenes) ? listaOrdenes : []);
            } else {
                setOrdenes([]);
            }

            if (respCatalogo.status === 'fulfilled') {
                const listaCatalogo = typeof respCatalogo.value === 'string' ? JSON.parse(respCatalogo.value) : respCatalogo.value;
                setRepuestos(Array.isArray(listaCatalogo) ? listaCatalogo : []);
            } else {
                setRepuestos([]);
            }
        } catch (error) {
            setMensaje({ text: `Error al cargar datos: ${error.message}`, type: 'error' });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarTodo();
    }, []);

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await workOrdersApi.updateStatus(instance, id, nuevoEstado);
            setMensaje({ text: `Orden #${id} actualizada a: ${nuevoEstado}`, type: 'success' });
            cargarTodo();
        } catch (error) {
            setMensaje({ text: `Error al actualizar: ${error.message}`, type: 'error' });
        }
    };

    const handleAsignarConStock = async (ordenId, tecnico, repuestoId) => {
        const repuesto = repuestos.find(r => r.id === repuestoId);

        if (!repuesto) {
            alert('El repuesto seleccionado no es válido.');
            return;
        }

        if ((repuesto.stock || 0) <= 0) {
            alert(`No hay existencias suficientes de "${repuesto.nombre}". Stock actual: 0.`);
            return;
        }

        try {
            await workOrdersApi.updateStatus(instance, ordenId, 'ASIGNADA', tecnico);

            const repuestoActualizado = {
                ...repuesto,
                stock: repuesto.stock - 1
            };
            await catalogApi.update(instance, repuesto.id, repuestoActualizado);

            setMensaje({ 
                text: `Técnico ${tecnico} asignado a la orden #${ordenId}. Se descontó 1 unidad de "${repuesto.nombre}" (Quedan: ${repuestoActualizado.stock}).`, 
                type: 'success' 
            });

            cargarTodo();
        } catch (error) {
            setMensaje({ text: `Error al procesar la asignación: ${error.message}`, type: 'error' });
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
                    <p className="text-sm text-slate-500 font-mono">Gestión de estados, técnicos y ciclo de vida de mantenciones.</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                        to="/catalog"
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-3 py-1.5 rounded-[10px] border border-slate-300 hover:bg-slate-50 transition-all"
                    >
                        <BookOpen size={13} />
                        Catálogo Técnico
                    </Link>
                    <button
                        onClick={cargarTodo}
                        disabled={cargando}
                        className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-3 py-1.5 rounded-[10px] border border-slate-300 hover:bg-slate-50 transition-all"
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
                        className={`px-3 py-1.5 text-xs font-mono font-medium rounded-[10px] border transition-colors ${
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
                <div className="bg-white rounded-[10px] shadow-xs border border-slate-300 p-8 text-center text-slate-500 text-sm font-mono">
                    No hay órdenes en esta categoría.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ordenesFiltradas.map((orden) => (
                        <TarjetaOrdenSupervisor
                            key={orden.id}
                            orden={orden}
                            repuestos={repuestos}
                            onAsignar={handleAsignarConStock}
                            onCambiarEstado={cambiarEstado}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
