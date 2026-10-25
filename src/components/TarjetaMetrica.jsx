export default function TarjetaMetrica({ titulo, valor, icono: Icono }) {
    return (
        <div className="bg-white p-5 rounded-[10px] border border-slate-300 shadow-xs flex items-center justify-between">
            <div>
                <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">{titulo}</span>
                <p className="text-3xl font-mono font-bold text-slate-900 mt-1">{valor}</p>
            </div>
            {Icono && (
                <div className="w-11 h-11 bg-slate-100 rounded-[10px] flex items-center justify-center text-slate-700 border border-slate-200">
                    <Icono size={22} />
                </div>
            )}
        </div>
    );
}

