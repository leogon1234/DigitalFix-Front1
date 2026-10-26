import axios from 'axios';
import { loginRequest } from "../config/authConfig";

// direccion del bff obtenida de las variables de entorno
const BFF_URL = import.meta.env.VITE_BFF_URL || "";

// peticion general al backend con token de autorizacion
export async function apiFetch(msalInstance, endpoint, options = {}) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
        throw new Error("No hay sesion iniciada en Microsoft");
    }

    let tokenResponse;
    try {
        tokenResponse = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        });
    } catch {
        tokenResponse = await msalInstance.acquireTokenPopup(loginRequest);
    }

    const headers = {
        "Authorization": `Bearer ${tokenResponse.accessToken}`,
        ...options.headers,
    };
    if (options.body || options.data) {
        headers["Content-Type"] = "application/json";
    }
    console.log("TOKEN ACCESS:", tokenResponse.accessToken);

    const payload = options.body 
        ? (typeof options.body === 'string' ? JSON.parse(options.body) : options.body)
        : (options.data || undefined);

    try {
        const response = await axios({
            url: `${BFF_URL}${endpoint}`,
            method: options.method || 'GET',
            headers,
            data: payload,
        });
        return response.data;
    } catch (error) {
        console.error("API call error en", endpoint, ":", error.response?.status, error.response?.data || error.message);
        const serverMsg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : '');
        throw new Error(serverMsg || 'Acceso denegado o falla en servidor');
    }
}

//leer los roles del usuario desde el token jwt
export async function getBackendRoles(msalInstance) {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) return [];
    try {
        const tokenResponse = await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        });
        const token = tokenResponse.accessToken;
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const decoded = JSON.parse(jsonPayload);
        return decoded.roles || [];
    } catch (e) {
        console.error("Error decoding token", e);
        return [];
    }
}

//llamadas a la api para el catalogo
export const catalogApi = {
    getAll: (msalInstance) => apiFetch(msalInstance, "/api/catalog/services"),
    
    create: (msalInstance, item) => apiFetch(msalInstance, "/api/catalog/services", {
        method: "POST",
        body: JSON.stringify(item),
    }),

    update: (msalInstance, id, item) => apiFetch(msalInstance, `/api/catalog/services/${id}`, {
        method: "PUT",
        body: JSON.stringify(item),
    }),
};

// llamadas a la api para las ordenes de trabajo
export const workOrdersApi = {
    getAll: (msalInstance) => apiFetch(msalInstance, "/api/workorders"),
    
    create: (msalInstance, order) => apiFetch(msalInstance, "/api/workorders", {
        method: "POST",
        body: JSON.stringify(order),
    }),
    
    updateStatus: (msalInstance, id, status, tecnico) => apiFetch(msalInstance, `/api/workorders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, tecnico }),
    }),

    // Solicitud asincrona de reporte PDF
    requestReport: (msalInstance, id, orderData) => apiFetch(msalInstance, `/api/workorders/${id}/report`, {
        method: "POST",
        body: JSON.stringify(orderData || {}),
    }),
};

