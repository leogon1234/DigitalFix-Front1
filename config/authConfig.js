// ============================================================
//  CONFIGURACION DE MSAL 2.0 — Microsoft Entra ID
//
//  Estos valores NO son secretos. Un SPA usa el flujo
//  Authorization Code + PKCE, que no requiere client secret.
//  Por eso pueden viajar al navegador sin riesgo.
// ============================================================
    
export const msalConfig = {
    auth: {
        // Client ID de la app "demo-spa-frontend" (la del SPA)
        clientId: "0e35cff9-911b-406a-9b11-d66d59b85c24",

        // Single tenant: la autoridad apunta a tu directorio
        authority: "https://login.microsoftonline.com/5f335b8f-bf24-47c1-8c58-daa48d28918e",

        // Debe coincidir EXACTO con el Redirect URI registrado en Azure
        redirectUri: "http://localhost:5173"
    },
    cache: {
        // sessionStorage: la sesion se pierde al cerrar la pestana.
        // Mas seguro que localStorage para este ejercicio.
        cacheLocation: "sessionStorage"
    }
};

// Permisos solicitados AL INICIAR SESION (identidad del usuario)
export const loginRequest = {
    scopes: ["openid", "profile"]
};

// Permiso solicitado PARA LLAMAR AL BACKEND.
// OJO: aqui va el Client ID de la app del API, no la del SPA.
// Este scope aparecera en el claim "scp" del token.
export const apiRequest = {
    scopes: ["api://216311f5-c638-4ab5-8832-baae89eea5b5/access_as_user"]
};

// Endpoint del backend.
// Al integrar AWS API Gateway solo se cambia esta linea.
export const API_URL = "http://localhost:8080/api/privado/test";
