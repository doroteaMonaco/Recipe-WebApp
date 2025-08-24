"use client";

import { AuthModalProvider } from "./AuthModalProvider";
import { SessionProvider } from "next-auth/react";

export function Providers({ children, session }) {
    return (
        <SessionProvider session={session}>
            <AuthModalProvider>
                {children}
            </AuthModalProvider>
        </SessionProvider>
    );
}