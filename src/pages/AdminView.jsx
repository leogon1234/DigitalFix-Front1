import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { catalogApi, workOrdersApi } from '../services/api';
import AlertaMensaje from '../components/AlertaMensaje';
import TarjetaMetrica from '../components/TarjetaMetrica';
import ModuloAuditoria from '../components/ModuloAuditoria';
import { Wrench, PlusCircle, RefreshCw, Layers, Edit2, Check, X, Activity, CheckCircle2, AlertOctagon, Clock, ShieldCheck } from 'lucide-react';

export default function AdminView() {
    const { instance } = useMsal();

    const [seccionActiva, setSeccionActiva] = useState('catalogo');

    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [precio, setPrecio] = useState('');
    const [stock, setStock] = useState('');
    const [servicios, setServicios] = useState([]);
    
    const [ordenes, setOrdenes] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [mensaje, setMensaje] = useState({ text: '', type: '' });

    const [editandoId, setEditandoId] = useState(null);
    const [precioEditado, setPrecioEditado] = useState('');
    const [stockEditado, setStockEditado] = useState('');

    const cargarDatos = async () => {
        try {
            setCargando(true);
            setMensaje({ text: '', type: '' });
            const [resCatalog, resOrders] = await Promise.allSettled([
                catalogApi.getAll(instance),
                workOrdersApi.getAll(instance)
            ]);

            if (resCatalog.status === 'fulfilled') {
                const dataCatalog = resCatalog.value;
                const listaServicios = typeof dataCatalog === 'string' ? JSON.parse(dataCatalog) : dataCatalog;
                setServicios(Array.isArray(listaServicios) ? listaServicios : []);
            } else {
                setServicios([]);
            }

            if (resOrders.status === 'fulfilled') {
                const dataOrders = resOrders.value;
                const listaOrdenes = typeof dataOrders === 'string' ? JSON.parse(dataOrders) : dataOrders;
                setOrdenes(Array.isArray(listaOrdenes) ? listaOrdenes : []);
            } else {
                setOrdenes([]);
            }
        } catch (error) {
            setMensaje({ text: error.message || 'Error al cargar datos del sistema', type: 'error' });
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const ordenesActivas = ordenes.filter(o => {
        const e = (o.estado || '').replace('Ó', 'O');
        return ['CREADA', 'ASIGNADA', 'EN_DESPLAZAMIENTO', 'EN_EJECUCION'].includes(e);
    }).length;

    const ordenesCerradas = ordenes.filter(o => o.estado === 'CERRADA').length;
    const ordenesCanceladas = ordenes.filter(o => o.estado === 'CANCELADA').length;

    const handleCrear = async (e) => {
        e.preventDefault();
        setMensaje({ text: '', type: '' });

        const nuevoItem = {
            codigo: `ITM-${Date.now().toString().slice(-6)}`,
            tipo: 'SERVICIO',
            nombre,
            descripcion,
            precio: parseFloat(precio) || 0,
            stock: parseInt(stock, 10) || 0,
            activo: true
        };

        try {
            await catalogApi.create(instance, nuevoItem);
            setMensaje({ text: 'Item registrado exitosamente en el catalogo.', type: 'success' });
            setNombre('');
            setDescripcion('');
            setPrecio('');
            setStock('');
            cargarDatos();
        } catch (error) {
            setMensaje({ text: error.message || 'No se pudo crear el item', type: 'error' });
        }
    };

    const iniciarEdicion = (item) => {
        setEditandoId(item.id);
        setPrecioEditado(item.precio || 0);
        setStockEditado(item.stock || 0);
    };

    const guardarEdicion = async (id, itemOriginal) => {
        const itemActualizado = {
            ...itemOriginal,
            precio: parseFloat(precioEditado) || 0,
            stock: parseInt(stockEditado, 10) || 0
        };

        try {
            await catalogApi.update(instance, id, itemActualizado);
            setMensaje({ text: `Item #${id} actualizado correctamente.`, type: 'success' });
            setEditandoId(null);
            cargarDatos();
        } catch (error) {
            setMensaje({ text: error.message || 'No se pudo actualizar el item', type: 'error' });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Panel de Control General (Admin)</h1>
                    <p className="text-sm text-slate-500 font-mono">Métricas operativas y administración del catálogo técnico.</p>
                </div>
                <button
                    onClick={cargarDatos}
                    disabled={cargando}
                    className="flex items-center gap-1.5 text-xs text-slate-700 hover:text-slate-900 font-mono px-3 py-1.5 rounded-[10px] border border-slate-300 hover:bg-slate-50 transition-all self-start sm:self-auto"
                >
                    <RefreshCw size={13} className={cargando ? 'animate-spin' : ''} />
                    Actualizar Todo
                </button>
            </div>

            <AlertaMensaje mensaje={mensaje} className="mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <TarjetaMetrica titulo="Total Órdenes" valor={ordenes.length} icono={Clock} />
                <TarjetaMetrica titulo="Órdenes Activas" valor={ordenesActivas} icono={Activity} />
                <TarjetaMetrica titulo="Trabajos Cerrados" valor={ordenesCerradas} icono={CheckCircle2} />
                <TarjetaMetrica titulo="Canceladas" valor={ordenesCanceladas} icono={AlertOctagon} />
            </div>

            <div className="flex border-b border-slate-300 mb-6 gap-4">
                <button
                    onClick={() => setSeccionActiva('catalogo')}
                    className={`pb-3 text-sm font-mono font-bold flex items-center gap-2 border-b-2 transition-all ${
                        seccionActiva === 'catalogo'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <Layers size={18} /> Catálogo y Repuestos
                </button>
                <button
                    onClick={() => setSeccionActiva('auditoria')}
                    className={`pb-3 text-sm font-mono font-bold flex items-center gap-2 border-b-2 transition-all ${
                        seccionActiva === 'auditoria'
                            ? 'border-slate-900 text-slate-900'
                            : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                >
                    <ShieldCheck size={18} /> Auditoría y Trazabilidad 
                </button>
            </div>

            {seccionActiva === 'catalogo' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                    <div className="bg-white rounded-[10px] shadow-xs border border-slate-300 p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-slate-900">
                            <Wrench className="text-blue-600" />
                            <h2 className="text-xl font-bold tracking-tight">Nuevo Item de Catálogo</h2>
                        </div>

                        <form onSubmit={handleCrear} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-mono text-black mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                                    placeholder="Ej. Disyuntor 16A"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-black mb-1">Descripción</label>
                                <textarea
                                    required
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                                    rows="3"
                                    placeholder="Detalles tecnicos del trabajo o repuesto..."
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-mono text-black mb-1">Tarifa</label>
                                    <input
                                        type="number"
                                        required
                                        value={precio}
                                        onChange={(e) => setPrecio(e.target.value)}
                                        className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                                        placeholder="25000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-black mb-1">Stock Inicial</label>
                                    <input
                                        type="number"
                                        required
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full border border-slate-300 rounded-[10px] px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                                        placeholder="10"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs py-2.5 rounded-[10px] flex items-center justify-center gap-2 mt-2 transition-colors"
                            >
                                <PlusCircle size={16} />
                                Guardar en Catálogo
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <Layers className="text-blue-600" />
                            Catálogo Técnico y Existencias
                        </h2>
                        <p className="text-sm text-slate-500 font-mono">Valores unitarios y stock en bodega.</p>
                    </div>

                    <div className="bg-white rounded-[10px] shadow-xs border border-slate-300 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-100 border-b border-slate-300 text-black text-xs font-mono uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="p-3">ID</th>
                                    <th className="p-3">Nombre</th>
                                    <th className="p-3">Tarifa</th>
                                    <th className="p-3">Stock</th>
                                    <th className="p-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-sm">
                                {servicios.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center p-8 text-slate-500 font-mono text-xs">
                                            No hay registros en el catálogo.
                                        </td>
                                    </tr>
                                ) : (
                                    servicios.map((item) => {
                                        const enEdicion = editandoId === item.id;
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="p-3 font-mono font-semibold text-black">#{item.id}</td>
                                                <td className="p-3">
                                                    <div className="font-semibold text-black font-mono">{item.nombre}</div>
                                                    <div className="text-xs text-slate-600 font-mono">{item.descripcion}</div>
                                                </td>
                                                <td className="p-3 font-mono text-black">
                                                    {enEdicion ? (
                                                        <input
                                                            type="number"
                                                            value={precioEditado}
                                                            onChange={(e) => setPrecioEditado(e.target.value)}
                                                            className="w-24 border border-slate-300 rounded-[10px] px-2 py-1 text-xs font-mono"
                                                        />
                                                    ) : (
                                                        `$${Number(item.precio || 0).toLocaleString('es-CL')}`
                                                    )}
                                                </td>
                                                <td className="p-3 font-mono">
                                                    {enEdicion ? (
                                                        <input
                                                            type="number"
                                                            value={stockEditado}
                                                            onChange={(e) => setStockEditado(e.target.value)}
                                                            className="w-16 border border-slate-300 rounded-[10px] px-2 py-1 text-xs font-mono"
                                                        />
                                                    ) : (
                                                        <span className={`px-2.5 py-0.5 rounded-[10px] text-xs font-mono font-semibold uppercase tracking-wider border ${
                                                            (item.stock || 0) > 5 ? 'bg-green-800 text-white border-green-800' : 'bg-rose-900 text-white border-rose-900'
                                                        }`}>
                                                            {item.stock || 0} un.
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-3 text-center">
                                                    {enEdicion ? (
                                                        <div className="flex items-center justify-center gap-1">
                                                            <button
                                                                onClick={() => guardarEdicion(item.id, item)}
                                                                className="p-1 text-green-700 hover:bg-green-50 rounded-[10px]"
                                                                title="Guardar"
                                                            >
                                                                <Check size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditandoId(null)}
                                                                className="p-1 text-rose-900 hover:bg-rose-50 rounded-[10px]"
                                                                title="Cancelar"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setEditandoId(item.id);
                                                                setPrecioEditado(item.precio || 0);
                                                                setStockEditado(item.stock || 0);
                                                            }}
                                                            className="text-blue-700 hover:text-blue-900 text-xs font-mono font-semibold flex items-center justify-center gap-1 mx-auto"
                                                        >
                                                            <Edit2 size={13} /> Editar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            )}

            {seccionActiva === 'auditoria' && (
                <ModuloAuditoria ordenes={ordenes} />
            )}
        </div>
    );
}
