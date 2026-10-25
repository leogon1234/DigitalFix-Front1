//configuracion para iniciar sesion con microsoft
export const msalConfig = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID || "",
        authority: import.meta.env.VITE_AZURE_AUTHORITY || "",
        redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI || window.location.origin,
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

//permisos para consultar y guardar datos en la api
export const loginRequest = {
    scopes: [
        import.meta.env.VITE_AZURE_SCOPE_READ,
        import.meta.env.VITE_AZURE_SCOPE_WRITE,
    ].filter(Boolean)
};
