import { useState } from 'react';
import { Truck, Play, CheckCircle, UserCheck, Package } from 'lucide-react';
import EtiquetaEstado from './EtiquetaEstado';

export default function TarjetaOrdenSupervisor({ orden, repuestos = [], onAsignar, onCambiarEstado }) {
    const [tecnico, setTecnico] = useState('');
    const [repuestoId, setRepuestoId] = useState('');

    const estado = (orden.estado || '').replace('Ó', 'O');

    const handleAsignar = () => {
        if (!tecnico || tecnico.trim() === '') {
            alert('Debes ingresar el nombre del técnico a cargo.');
            return;
        }

        if (!repuestoId) {
            alert('Debes seleccionar el repuesto o servicio del catálogo que se utilizará.');
            return;
        }

        onAsignar(orden.id, tecnico.trim(), parseInt(repuestoId, 10));
    };

    return (
        <div className="bg-white rounded-[10px] shadow-xs border border-slate-300 p-5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-slate-900 text-base">#{orden.id}</span>
                    <EtiquetaEstado estado={orden.estado} />
                </div>

                <div className="text-xs space-y-1 mt-2 text-black font-mono">
                    <p>
                        Cliente: <span className="font-semibold text-black">{orden.clienteNombre || 'Sin nombre'}</span>
                    </p>
                    <p>
                        Dirección: <span className="font-semibold text-black">{orden.direccion}</span>
                    </p>
                    {(orden.tecnicoAsignado || orden.tecnicoNombre) && (
                        <p>
                            Técnico: <span className="font-semibold text-black">{orden.tecnicoAsignado || orden.tecnicoNombre}</span>
                        </p>
                    )}
                </div>

                <p className="text-sm text-slate-800 mt-3 p-3 bg-slate-100 border border-slate-300 rounded-[10px] font-mono text-xs">
                    {orden.descripcionProblema || orden.descripcion}
                </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 flex flex-col gap-2">
                {estado === 'CREADA' && (
                    <div className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Nombre del técnico..."
                            value={tecnico}
                            onChange={(e) => setTecnico(e.target.value)}
                            className="w-full border border-slate-300 rounded-[10px] px-3 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                        />

                        <div className="flex items-center gap-1.5">
                            <Package size={15} className="text-slate-500" />
                            <select
                                value={repuestoId}
                                onChange={(e) => setRepuestoId(e.target.value)}
                                className="w-full border border-slate-300 rounded-[10px] px-2 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                            >
                                <option value="">-- Seleccionar repuesto requerido --</option>
                                {repuestos.map((item) => (
                                    <option key={item.id} value={item.id} disabled={(item.stock || 0) <= 0}>
                                        {item.nombre} (Stock: {item.stock || 0})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={handleAsignar}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono font-medium py-2 px-3 rounded-[10px] text-xs flex items-center justify-center gap-1.5 transition-colors mt-1"
                        >
                            <UserCheck size={14} /> Asignar Cuadrilla y Reservar Repuesto
                        </button>
                    </div>
                )}

                {estado === 'ASIGNADA' && (
                    <button
                        onClick={() => onCambiarEstado(orden.id, 'EN_DESPLAZAMIENTO')}
                        className="w-full bg-sky-800 hover:bg-sky-900 text-white font-mono font-medium py-2 px-3 rounded-[10px] text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Truck size={14} /> Despachar a Terreno
                    </button>
                )}

                {estado === 'EN_DESPLAZAMIENTO' && (
                    <button
                        onClick={() => onCambiarEstado(orden.id, 'EN_EJECUCION')}
                        className="w-full bg-orange-800 hover:bg-orange-900 text-white font-mono font-medium py-2 px-3 rounded-[10px] text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                        <Play size={14} /> Iniciar Reparación
                    </button>
                )}

                {estado === 'EN_EJECUCION' && (
                    <button
                        onClick={() => onCambiarEstado(orden.id, 'CERRADA')}
                        className="w-full bg-green-800 hover:bg-green-900 text-white font-mono font-medium py-2 px-3 rounded-[10px] text-xs flex items-center justify-center gap-1.5 transition-colors"
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
}

