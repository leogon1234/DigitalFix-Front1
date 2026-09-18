import { CheckCircle, Clock, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { workOrdersApi } from '../services/api';

export default function SupervisorView() {
    const { instance } = useMsal();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await workOrdersApi.getAll(instance);
                setOrders(data || []);
            } catch (error) {
                console.error("Error al recuperar los pedidos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [instance]);

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
                        </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-100">
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Cargando solicitudes...</td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-slate-500">Tabla de órdenes vacía</td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">#{order.id}</td>
                                    <td className="px-6 py-4">{order.clienteNombre || order.clienteId}</td>
                                    <td className="px-6 py-4">{order.direccion}</td>
                                    <td className="px-6 py-4 text-slate-500">{order.tecnicoAsignado || 'Sin asignar'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
