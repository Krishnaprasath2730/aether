import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { apiService, type LoginData, type RegisterData } from '../services/api.service';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    walletBalance: number;
    profilePhoto?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: LoginData) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
    updateUser: (updates: Partial<User>) => void;
    setAuthData: (token: string, user: User) => void;
    isAuthenticated: boolean;
    setOnLoginCallback: (callback: () => void) => void;
    setOnLogoutCallback: (callback: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [onLoginCallback, setOnLoginCallback] = useState<(() => void) | null>(null);
    const [onLogoutCallback, setOnLogoutCallback] = useState<(() => void) | null>(null);

    // Load user and token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            // Trigger login callback to restore cart/wishlist
            if (onLoginCallback) {
                onLoginCallback();
            }
        }
    }, [onLoginCallback]);

    const login = async (data: LoginData) => {
        const response = await apiService.login(data);
        setToken(response.token);
        setUser(response.user);
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('authUser', JSON.stringify(response.user));

        // Trigger login callback to sync cart/wishlist
        if (onLoginCallback) {
            onLoginCallback();
        }
    };

    const register = async (data: RegisterData) => {
        // Registration now requires OTP verification
        // Token and user will be set after OTP verification via setAuthData
        await apiService.register(data);
        // User will be redirected to OTP verification page by Signup component
    };

    const logout = () => {
        // Trigger logout callback to clear cart/wishlist
        if (onLogoutCallback) {
            onLogoutCallback();
        }

        setToken(null);
        setUser(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
    };

    const updateUser = (updates: Partial<User>) => {
        if (user) {
            const updatedUser = { ...user, ...updates };
            setUser(updatedUser);
            localStorage.setItem('authUser', JSON.stringify(updatedUser));
        }
    };

    // Direct auth data setter for OAuth
    const setAuthData = useCallback((newToken: string, newUser: User) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('authToken', newToken);
        localStorage.setItem('authUser', JSON.stringify(newUser));
        if (onLoginCallback) {
            onLoginCallback();
        }
    }, [onLoginCallback]);

    const setOnLoginCallbackWrapper = useCallback((callback: () => void) => {
        setOnLoginCallback(() => callback);
    }, []);

    const setOnLogoutCallbackWrapper = useCallback((callback: () => void) => {
        setOnLogoutCallback(() => callback);
    }, []);

    const contextValue = useMemo<AuthContextType>(() => ({
        user,
        token,
        login,
        register,
        logout,
        updateUser,
        setAuthData,
        isAuthenticated: !!token,
        setOnLoginCallback: setOnLoginCallbackWrapper,
        setOnLogoutCallback: setOnLogoutCallbackWrapper,
    }), [user, token, login, register, logout, updateUser, setAuthData, setOnLoginCallbackWrapper, setOnLogoutCallbackWrapper]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
