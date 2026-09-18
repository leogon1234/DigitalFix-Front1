import { PlusCircle, Clock, MapPin, Wrench } from 'lucide-react';
import { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import { workOrdersApi } from '../services/api';

export default function ClienteView() {
    const { instance, accounts } = useMsal();
    const [direccion, setDireccion] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!direccion || !descripcion) {
            setMessage({ text: 'Por favor completa todos los campos', type: 'error' });
            return;
        }
        setLoading(true);
        setMessage({ text: '', type: '' });
        try {
            const order = {
                clienteId: accounts[0]?.localAccountId || accounts[0]?.username || 'desconocido',
                clienteNombre: accounts[0]?.name || 'Cliente Desconocido',
                direccion: direccion,
                descripcion: descripcion
            };
            await workOrdersApi.create(instance, order);
            setMessage({ text: 'Enviado correcto', type: 'success' });
            setDireccion('');
            setDescripcion('');
        } catch (error) {
            setMessage({ text: error.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border-2 border-slate-300 p-6 sticky top-24">
                    <div className="flex items-center gap-2 mb-6 text-slate-800">
                        <Wrench className="text-blue-600" />
                        <h2 className="text-xl font-bold">Nueva Solicitud</h2>
                    </div>
                    {message.text && (
                        <div className={`mb-4 p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                            {message.text}
                        </div>
                    )}
                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Dirección
                            </label>
                            <input 
                                type="text" 
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                placeholder="Ej. Antonio Varas 666" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Descripción de la falla
                            </label>
                            <textarea 
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full border-2 border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white" 
                                rows="4"
                                placeholder="Describe el problema eléctrico detalladamente..."
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`mt-2 w-full font-semibold py-3 px-4 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors ${loading ? 'bg-blue-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        >
                            <PlusCircle size={18} className={loading ? 'animate-spin' : ''} />
                            {loading ? 'Enviando...' : 'Enviar Solicitud'}
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
