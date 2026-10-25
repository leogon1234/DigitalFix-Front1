export default function EtiquetaEstado({ estado }) {
    const e = (estado || '').replace('Ó', 'O');
    
    let colorClase = 'bg-slate-700 text-white border-slate-700';
    if (e === 'ASIGNADA') {
        colorClase = 'bg-blue-800 text-white border-blue-800';
    } else if (e === 'EN_DESPLAZAMIENTO') {
        colorClase = 'bg-sky-800 text-white border-sky-800';
    } else if (e === 'EN_EJECUCION') {
        colorClase = 'bg-orange-800 text-white border-orange-800';
    } else if (e === 'CERRADA' || e === 'COMPLETADA') {
        colorClase = 'bg-green-800 text-white border-green-800';
    } else if (e === 'CANCELADA') {
        colorClase = 'bg-rose-900 text-white border-rose-900';
    }

    return (
        <span className={`inline-block px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider border rounded-[10px] ${colorClase}`}>
            {estado || 'CREADA'}
        </span>
    );
}

