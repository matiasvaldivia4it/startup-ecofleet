import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../api/mockApi';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userType, setUserType] = useState(null); // 'customer', 'driver', 'admin'
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load user from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('ecofleet_user');
        const savedUserType = localStorage.getItem('ecofleet_user_type');

        if (savedUser && savedUserType) {
            setUser(JSON.parse(savedUser));
            setUserType(savedUserType);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = async (email, password, type = 'customer') => {
        try {
            const result = await mockApi.auth.login(email, password);

            if (result.success) {
                setUser(result.data.user);
                setUserType(type);
                setIsAuthenticated(true);

                // Save to localStorage
                localStorage.setItem('ecofleet_user', JSON.stringify(result.data.user));
                localStorage.setItem('ecofleet_user_type', type);
                localStorage.setItem('ecofleet_token', result.data.token);

                return { success: true };
            }

            return { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: 'Error al iniciar sesión' };
        }
    };

    const register = async (customerData) => {
        try {
            const result = await mockApi.auth.register(customerData);

            if (result.success) {
                setUser(result.data.user);
                setUserType('customer');
                setIsAuthenticated(true);

                // Save to localStorage
                localStorage.setItem('ecofleet_user', JSON.stringify(result.data.user));
                localStorage.setItem('ecofleet_user_type', 'customer');
                localStorage.setItem('ecofleet_token', result.data.token);

                return { success: true, data: result.data };
            }

            return { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: 'Error al registrarse' };
        }
    };

    const logout = () => {
        setUser(null);
        setUserType(null);
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem('ecofleet_user');
        localStorage.removeItem('ecofleet_user_type');
        localStorage.removeItem('ecofleet_token');
    };

    const updateUser = (userData) => {
        setUser(userData);
        localStorage.setItem('ecofleet_user', JSON.stringify(userData));
    };

    const generateApiKey = async () => {
        if (!user || userType !== 'customer') {
            return { success: false, error: 'No autorizado' };
        }

        try {
            const result = await mockApi.auth.generateApiKey(user.id);

            if (result.success) {
                const updatedUser = { ...user, ...result.data };
                updateUser(updatedUser);
                return { success: true, data: result.data };
            }

            return { success: false, error: result.error };
        } catch (error) {
            return { success: false, error: 'Error al generar API key' };
        }
    };

    const value = {
        user,
        userType,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        generateApiKey
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
