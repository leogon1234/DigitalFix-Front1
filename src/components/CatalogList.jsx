import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { catalogApi } from "../services/api";

export function CatalogList() {
    const { instance, accounts } = useMsal();
    const [servicios, setServicios] = useState([]);
    const [error, setError] = useState(null);

    const roles = accounts[0]?.idTokenClaims?.roles || [];
    const esAdmin = roles.includes("Admin");

    useEffect(() => {
        catalogApi.getAll(instance)
            .then(data => setServicios(data))
            .catch(err => setError(err.message));
    }, [instance]);

    return (
        <div style={{ padding: "20px" }}>
            <h2>Catálogo Técnico DigitalFix</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {esAdmin && (
                <button style={{ marginBottom: "15px" }}>
                    + Registrar Nuevo Servicio / Repuesto
                </button>
            )}

            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Precio</th>
                        <th>Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {servicios.map((item) => (
                        <tr key={item.id}>
                            <td>{item.codigo}</td>
                            <td>{item.nombre}</td>
                            <td>{item.tipo}</td>
                            <td>${item.precio}</td>
                            <td>{item.stock}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

