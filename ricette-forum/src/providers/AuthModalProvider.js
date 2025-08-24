"use client";

import {createContext, useState, useContext} from 'react';

const AuthModalContext = createContext();  

export function AuthModalProvider({children}) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isSignupOpen, setIsSignupOpen] = useState(false);

    const value = {
        isLoginOpen,
        isSignupOpen,
        openLogin: () => setIsLoginOpen(true),
        closeLogin: () => setIsLoginOpen(false),
        openSignUp: () => setIsSignupOpen(true),
        closeSignUp: () => setIsSignupOpen(false),
    };

    return (
        <AuthModalContext.Provider value={value}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal must be used within an AuthModalProvider");
    }
    return context;
}