export const msalConfig = {
    auth: {
        clientId: "0e35cff9-911b-406a-9b11-d66d59b85c24",
        authority: "https://login.microsoftonline.com/72fd0b5a-8a6a-4cff-89f6-bde961f7e250",
        redirectUri: "https://ec2-54-163-195-44.compute-1.amazonaws.com",
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
