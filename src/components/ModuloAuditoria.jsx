import { useState } from 'react';
import { Filter, Activity, Calendar, UserCheck } from 'lucide-react';

export default function ModuloAuditoria({ ordenes = [] }) {
    const [filtroUsuario, setFiltroUsuario] = useState('');
    const [filtroEvento, setFiltroEvento] = useState('TODOS');
    const [filtroFecha, setFiltroFecha] = useState('');

    const ordenesAuditadas = ordenes.filter((orden) => {
        const coincideUsuario = filtroUsuario === '' || 
            (orden.clienteNombre && orden.clienteNombre.toLowerCase().includes(filtroUsuario.toLowerCase())) ||
            (orden.tecnicoAsignado && orden.tecnicoAsignado.toLowerCase().includes(filtroUsuario.toLowerCase()));
        
        const coincideEvento = filtroEvento === 'TODOS' || 
            (orden.estado || '').replace('Ó', 'O') === filtroEvento.replace('Ó', 'O');

        const fechaCreacion = orden.fechaCreacion ? orden.fechaCreacion.split('T')[0] : '';
        const coincideFecha = filtroFecha === '' || fechaCreacion === filtroFecha;

        return coincideUsuario && coincideEvento && coincideFecha;
    });

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-white p-4 rounded-[10px] border border-slate-300 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Filter size={14} /> Filtrar por Usuario (Cliente o Técnico)
                    </label>
                    <input
                        type="text"
                        placeholder="Escribe un nombre..."
                        value={filtroUsuario}
                        onChange={(e) => setFiltroUsuario(e.target.value)}
                        className="w-full border border-slate-300 rounded-[10px] px-3 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                </div>

                <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Activity size={14} /> Tipo de Evento / Estado
                    </label>
                    <select
                        value={filtroEvento}
                        onChange={(e) => setFiltroEvento(e.target.value)}
                        className="w-full border border-slate-300 rounded-[10px] px-3 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                        <option value="TODOS">Todos los eventos</option>
                        <option value="CREADA">CREADA</option>
                        <option value="ASIGNADA">ASIGNADA</option>
                        <option value="EN_DESPLAZAMIENTO">EN DESPLAZAMIENTO</option>
                        <option value="EN_EJECUCION">EN EJECUCIÓN</option>
                        <option value="CERRADA">CERRADA</option>
                        <option value="CANCELADA">CANCELADA</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-mono font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Calendar size={14} /> Fecha del Evento
                    </label>
                    <input
                        type="date"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                        className="w-full border border-slate-300 rounded-[10px] px-3 py-1.5 text-xs font-mono bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[10px] shadow-xs border border-slate-300 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs uppercase font-mono font-semibold">
                        <tr>
                            <th className="p-3">ID Orden</th>
                            <th className="p-3">Evento Técnico</th>
                            <th className="p-3">Cliente Solicitante</th>
                            <th className="p-3">Técnico / Cuadrilla</th>
                            <th className="p-3">Dirección del Inmueble</th>
                            <th className="p-3">Detalle de la Mantención</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {ordenesAuditadas.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-8 text-slate-500 font-mono text-xs">
                                    No se encontraron eventos que coincidan con los filtros aplicados.
                                </td>
                            </tr>
                        ) : (
                            ordenesAuditadas.map((orden) => (
                                <tr key={orden.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-mono font-bold text-black">#{orden.id}</td>
                                    <td className="p-3 font-mono font-semibold text-black uppercase tracking-wider text-xs">
                                        {orden.estado || 'CREADA'}
                                    </td>
                                    <td className="p-3 font-mono text-black">{orden.clienteNombre || 'Sin especificar'}</td>
                                    <td className="p-3 font-mono text-black">
                                        {orden.tecnicoAsignado ? (
                                            <span className="font-semibold text-black flex items-center gap-1">
                                                <UserCheck size={14} className="text-blue-600" /> {orden.tecnicoAsignado}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400 italic">Sin asignar</span>
                                        )}
                                    </td>
                                    <td className="p-3 font-mono text-xs text-black">{orden.direccion}</td>
                                    <td className="p-3 font-mono text-xs text-slate-700 max-w-xs truncate">
                                        {orden.descripcionProblema || orden.descripcion}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

