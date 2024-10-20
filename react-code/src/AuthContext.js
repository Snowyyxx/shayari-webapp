import React, { createContext, useState, useEffect } from 'react';
import { decodeToken, isExpired } from 'react-jwt';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem('authTokens');
        return token ? JSON.parse(token) : null;
    });
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('authTokens');
        return token ? decodeToken(JSON.parse(token).access) : null;
    });

    const loginUser = async (username, password) => {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        if (response.status === 200) {
            const data = await response.json();
            setAuthTokens(data);
            setUser(decodeToken(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            return true;
        } else {
            alert('Invalid credentials');
            return false;
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    };

    useEffect(() => {
        if (authTokens) {
            const decoded = decodeToken(authTokens.access);
            const tokenIsExpired = isExpired(authTokens.access);
            if (tokenIsExpired) {
                logoutUser();
            } else {
                setUser(decoded);
                localStorage.setItem('authTokens', JSON.stringify(authTokens));
            }
        } else {
            setUser(null);
            localStorage.removeItem('authTokens');
        }
    }, [authTokens]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
    };

    return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
