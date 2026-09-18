import axios from 'axios';
import { loginRequest } from "../config/authConfig";

const BFF_URL = "http://localhost:8081";

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
        "Content-Type": "application/json",
        "Authorization": `Bearer ${tokenResponse.accessToken}`,
        ...options.headers,
    };
    console.log("TOKEN ACCESS:", tokenResponse.accessToken);

    try {
        const response = await axios({
            url: `${BFF_URL}${endpoint}`,
            method: options.method || 'GET',
            headers,
            data: options.body ? JSON.parse(options.body) : undefined,
        });
        return response.data;
    } catch (error) {
        console.error("API call error:", error);
        throw new Error(`Error ${error.response?.status || 'desconocido'}: Acceso denegado o falla en servidor`);
    }
}

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

export const catalogApi = {
    getAll: (msalInstance) => apiFetch(msalInstance, "/api/catalog/services"),
    
    create: (msalInstance, item) => apiFetch(msalInstance, "/api/catalog/services", {
        method: "POST",
        body: JSON.stringify(item),
    }),
};

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
};
