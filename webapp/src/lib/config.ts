import {loadEnvConfig} from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

function getEnv(name: string) {
    const value = process.env[name];
    if (!value) throw new Error(`Could not find env: ${name}`);
    return value;
}

export const authConfig = {
    kcIssuer: getEnv('AUTH_KEYCLOAK_ISSUER'),
    kcSecret: getEnv('AUTH_KEYCLOAK_SECRET'),
    kcClientId: getEnv('AUTH_KEYCLOAK_ID'),
    kcInternal: getEnv('AUTH_KEYCLOAK_ISSUER_INTERNAL'),
    secret: getEnv('AUTH_SECRET'),
    authUrl: getEnv('AUTH_URL'),
}

export const apiConfig = {
    baseUrl: getEnv('API_URL'),
}

export const cloudinaryConfig = {
    cloudName: getEnv('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnv('NEXT_PUBLIC_CLOUDINARY_API_KEY'),
    apiSecret: getEnv('CLOUDINARY_API_SECRET'),
}
