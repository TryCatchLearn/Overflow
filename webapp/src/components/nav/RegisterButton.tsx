import {Button} from "@heroui/button";

export default function RegisterButton() {
    const clientId = 'nextjs';
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
    const redirectUrl = process.env.AUTH_URL;
    
    const registerUrl = `${issuer}/protocol/openid-connect/registrations` +
        `?client_id=${clientId}&redirect_uri=` +
        `${encodeURIComponent(redirectUrl!)}&response_type=code&scope=openid`;
    
    return (
        <Button as='a' href={registerUrl} color='secondary'>Register</Button>
    );
}