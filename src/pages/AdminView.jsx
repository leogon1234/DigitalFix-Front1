export default function AdminView() {
    return (
        <div className="p-6 max-w-7xl mx-auto flex flex-col gap-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Catálogo Técnico</h1>
                <p className="text-sm text-slate-500">Gestión de servicios y repuestos</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 p-6 max-w-2xl">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Crear Nuevo Elemento</h3>
                <form className="flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Código (ID)</label>
                        <input type="text" readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" placeholder="Ej. SV-01" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
                        <input type="text" readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" placeholder="Ej. Reparación Eléctrica" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Tipo</label>
                        <select disabled className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50">
                            <option>SERVICIO</option>
                            <option>REPUESTO</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
                        <textarea readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" rows="2"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Precio</label>
                            <input type="number" readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Stock</label>
                            <input type="number" readOnly className="w-full border-2 border-slate-300 rounded-md px-3 py-2 text-sm bg-slate-50" />
                        </div>
                    </div>
                    <button type="button" className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600/50 cursor-not-allowed rounded-md">
                        Guardar
                    </button>
                </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider border-b border-slate-200">
                            <th className="px-6 py-4 font-semibold">Código</th>
                            <th className="px-6 py-4 font-semibold">Nombre</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Precio</th>
                            <th className="px-6 py-4 font-semibold">Stock</th>
                            <th className="px-6 py-4 font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                        <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Tabla de catálogo vacía</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
