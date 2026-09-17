export const msalConfig = {
    auth: {
        clientId: "0e35cff9-911b-406a-9b11-d66d59b85c24",
        authority: "https://login.microsoftonline.com/5f335b8f-bf24-47c1-8c58-daa48d28918e",
        redirectUri: "http://localhost:5173",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [
        "api://b6ae697f-8030-4a0a-88db-670d6611fbb6/read",
        "api://b6ae697f-8030-4a0a-88db-670d6611fbb6/write"
    ]
};
