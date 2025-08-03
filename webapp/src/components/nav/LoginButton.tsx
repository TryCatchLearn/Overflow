'use client';

import {Button} from "@heroui/button";
import {signIn} from "next-auth/react";

export default function LoginButton() {
    return (
        <Button 
            color='secondary' 
            variant='bordered'
            type='button'
            onPress={() => signIn('keycloak', 
                {redirectTo: '/questions'}, {prompt: 'login'})}
        >
            Login
        </Button>
    );
}