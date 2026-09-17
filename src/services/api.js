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

    const response = await fetch(`${BFF_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: Acceso denegado o falla en servidor`);
    }

    return response.json();
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

