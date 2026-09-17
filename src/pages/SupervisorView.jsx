export default function SupervisorView() {
    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Panel de Supervisión</h1>
                <p className="text-sm text-slate-500">Gestión y asignación de órdenes de trabajo</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 p-6 max-w-md">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Asignar</h3>
                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Técnico / Cuadrilla</label>
                        <input type="text" readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" placeholder="Ej. Técnico Bob" />
                    </div>
                    <button type="button" className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600/50 cursor-not-allowed rounded-md">
                        Asignar
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold">ID</th>
                            <th className="px-6 py-4 font-semibold">Cliente</th>
                            <th className="px-6 py-4 font-semibold">Dirección</th>
                            <th className="px-6 py-4 font-semibold">Técnico</th>
                            <th className="px-6 py-4 font-semibold">Estado</th>
                            <th className="px-6 py-4 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                        <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Tabla de órdenes vacía</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
