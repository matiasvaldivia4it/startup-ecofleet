import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Check if Supabase is configured
        if (!supabase) {
            console.warn('Supabase not configured. Using mock authentication.');
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Sign in with OAuth provider
    const signInWithProvider = async (provider) => {
        if (!supabase) {
            throw new Error('Supabase not configured');
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`,
            },
        });

        if (error) throw error;
        return data;
    };

    const signInWithGoogle = () => signInWithProvider('google');
    const signInWithMicrosoft = () => signInWithProvider('azure');
    const signInWithFacebook = () => signInWithProvider('facebook');

    // Mock login for development
    const login = (email, role = 'customer') => {
        const mockUser = {
            id: 'dev-user-123',
            email: email,
            user_metadata: { role: role, full_name: 'Usuario Demo' },
            role: role, // Keep top level for backward compat if needed
            name: 'Usuario Demo'
        };
        setUser(mockUser);
        setSession({ user: mockUser });
        return { success: true };
    };

    // Register new user
    const register = async (email, password, userData) => {
        if (!supabase) {
            // Mock registration
            const mockUser = {
                id: `dev-user-${Date.now()}`,
                email: email,
                role: 'driver', // Default to driver for this flow
                name: userData.fullName,
                user_metadata: userData
            };
            setUser(mockUser);
            setSession({ user: mockUser });
            return { success: true, user: mockUser };
        }

        try {
            // 1. Sign up with Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: userData.fullName,
                        role: 'driver',
                        ...userData
                    }
                }
            });

            if (authError) throw authError;

            if (authData.user) {
                // 2. Ideally create a profile record here if you have a profiles table
                // const { error: profileError } = await supabase.from('profiles').insert({...})

                // For now, we rely on metadata or triggers
                setUser(authData.user);
                setSession(authData.session);
                return { success: true, user: authData.user };
            }

            return { success: false, error: 'No user created' };

        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    };

    // Update user profile
    const updateProfile = async (updates) => {
        if (!supabase || !user) return { success: true }; // Mock success

        try {
            const { error } = await supabase.auth.updateUser({
                data: updates
            });

            if (error) throw error;

            // Update local state
            setUser(prev => ({ ...prev, user_metadata: { ...prev.user_metadata, ...updates } }));
            return { success: true };
        } catch (error) {
            console.error('Error updating profile:', error);
            return { success: false, error: error.message };
        }
    };

    // Sign out
    const signOut = async () => {
        if (!supabase) return;

        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    // Get user profile with role
    const getUserProfile = async () => {
        if (!supabase || !user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }

        return data;
    };

    const value = {
        user,
        session,
        loading,
        signInWithGoogle,
        signInWithMicrosoft,
        signInWithFacebook,
        login,
        register,
        updateProfile,
        signOut,
        getUserProfile,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
