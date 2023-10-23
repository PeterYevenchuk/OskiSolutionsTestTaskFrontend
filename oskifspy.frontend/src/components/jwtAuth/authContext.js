import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [JWTtoken, setJWTtoken] = useState(localStorage.getItem('accessToken'));

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setIsLoggedIn(true);
            setJWTtoken(token);
        } else {
            setIsLoggedIn(false);
            setJWTtoken(null);
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('accessToken', token);
        setJWTtoken(token);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setJWTtoken(null);
        setIsLoggedIn(false);
    };
    

    const value = {
        isLoggedIn,
        login,
        logout,
        JWTtoken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
