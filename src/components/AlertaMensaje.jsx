export default function AlertaMensaje({ mensaje, className = 'mb-4' }) {
    if (!mensaje || !mensaje.text) return null;

    const esError = mensaje.type === 'error';
    const colorClase = esError 
        ? 'bg-rose-900 text-white border-rose-900' 
        : 'bg-green-800 text-white border-green-800';

    return (
        <div className={`${className} p-3 rounded-[10px] text-xs font-mono border ${colorClase}`}>
            {mensaje.text}
        </div>
    );
}

