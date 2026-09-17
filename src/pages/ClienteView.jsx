import { PlusCircle, Clock, MapPin, Wrench } from 'lucide-react';

export default function ClienteView() {
    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 p-6 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Wrench className="text-blue-600" />
                        <h2 className="text-xl font-bold">Nueva Solicitud</h2>
                    </div>
                    <form className="flex flex-col gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Dirección
                            </label>
                            <input 
                                type="text" 
                                readOnly
                                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50"
                                placeholder="Antonio Varas 666" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Descripción de la falla
                            </label>
                            <textarea 
                                readOnly
                                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-slate-50" 
                                rows="4"
                                placeholder="Describe el problema eléctrico detalladamente..."
                            ></textarea>
                        </div>

                        <button 
                            type="button" 
                            className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors opacity-70 cursor-not-allowed"
                        >
                            <PlusCircle size={18} />
                            Enviar Solicitud
                        </button>
                    </form>
                </div>
            </div>

            <div className="lg:col-span-2">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Mis Solicitudes</h2>
                    <p className="text-sm text-slate-500">Historial y estado de tus requerimientos técnicos.</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 p-8 text-center">
                    <Clock className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                    <h3 className="text-lg font-medium text-slate-900">No hay solicitudes</h3>
                    <p className="text-slate-500 text-sm mt-1">Cuando crees una solicitud aparecerá aquí.</p>
                </div>
            </div>
        </div>
    );
}
