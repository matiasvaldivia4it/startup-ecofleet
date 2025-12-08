import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle the OAuth callback
        const handleCallback = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error during auth callback:', error);
                    navigate('/login?error=auth_failed');
                    return;
                }

                if (data.session) {
                    const user = data.session.user;

                    // Check for pending registration flow
                    const pendingRole = localStorage.getItem('pending_registration_role');

                    if (pendingRole === 'driver') {
                        // User was trying to register as driver
                        localStorage.removeItem('pending_registration_role');

                        // Ensure user has driver role in metadata
                        if (user.user_metadata?.role !== 'driver') {
                            await supabase.auth.updateUser({
                                data: { role: 'driver' }
                            });
                        }

                        // Redirect back to registration to finish the form
                        navigate('/registro-conductor');
                        return;
                    }

                    if (pendingRole === 'customer') {
                        // User was trying to register as customer
                        localStorage.removeItem('pending_registration_role');

                        // Ensure user has customer role in metadata
                        if (user.user_metadata?.role !== 'customer') {
                            await supabase.auth.updateUser({
                                data: { role: 'customer' }
                            });
                        }

                        // Redirect back to registration to finish the form
                        navigate('/registro-cliente');
                        return;
                    }

                    // Normal login flow - check role
                    const role = user.user_metadata?.role || 'customer';

                    if (role === 'driver') {
                        navigate('/dashboard', { replace: true });
                    } else if (role === 'admin') {
                        navigate('/admin', { replace: true });
                    } else {
                        navigate('/customer', { replace: true });
                    }
                } else {
                    navigate('/login');
                }
            } catch (error) {
                console.error('Unexpected error:', error);
                navigate('/login?error=unexpected');
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '1rem'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #e5e7eb',
                borderTopColor: '#10b981',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ color: '#6b7280' }}>Completando inicio de sesión...</p>

            <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}

export default AuthCallback;
