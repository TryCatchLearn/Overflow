import {auth} from "@/auth";
import {NextResponse} from "next/server";

export default auth((req) => {
    if (req.auth) return NextResponse.next();
    
    const {nextUrl} = req;
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    console.log("callbackUrlMiddleware", callbackUrl);
    return NextResponse.redirect(new URL(`/auth-gate?callbackUrl=${callbackUrl}`, nextUrl));
});

export const config = {
    matcher: [
        '/questions/ask',
        '/questions/:id/edit',
        '/session'
    ]
}

