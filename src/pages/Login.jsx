import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { signInWithGoogle, signInWithMicrosoft, signInWithFacebook, isAuthenticated, loading } = useAuth();

    const redirectTo = searchParams.get('redirect') || '/customer';

    useEffect(() => {
        // If already authenticated, redirect
        if (isAuthenticated && !loading) {
            navigate(redirectTo, { replace: true });
        }
    }, [isAuthenticated, loading, navigate, redirectTo]);

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Error signing in with Google:', error);
            alert('Error al iniciar sesión con Google. Por favor intenta nuevamente.');
        }
    };

    const handleMicrosoftLogin = async () => {
        try {
            await signInWithMicrosoft();
        } catch (error) {
            console.error('Error signing in with Microsoft:', error);
            alert('Error al iniciar sesión con Microsoft. Por favor intenta nuevamente.');
        }
    };

    const handleFacebookLogin = async () => {
        try {
            await signInWithFacebook();
        } catch (error) {
            console.error('Error signing in with Facebook:', error);
            alert('Error al iniciar sesión con Facebook. Por favor intenta nuevamente.');
        }
    };

    if (loading) {
        return (
            <div className="login-loading">
                <div className="spinner"></div>
                <p>Cargando...</p>
            </div>
        );
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card card">
                    <div className="login-header">
                        <div className="logo">🌿 EcoFleet</div>
                        <h1>Bienvenido</h1>
                        <p>Inicia sesión para acceder a tu cuenta</p>
                    </div>

                    <div className="login-providers">
                        <button onClick={handleGoogleLogin} className="btn-provider btn-google">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuar con Google
                        </button>

                        <button onClick={handleMicrosoftLogin} className="btn-provider btn-microsoft">
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#f25022" d="M1 1h10v10H1z" />
                                <path fill="#00a4ef" d="M13 1h10v10H13z" />
                                <path fill="#7fba00" d="M1 13h10v10H1z" />
                                <path fill="#ffb900" d="M13 13h10v10H13z" />
                            </svg>
                            Continuar con Microsoft
                        </button>

                        <button onClick={handleFacebookLogin} className="btn-provider btn-facebook">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continuar con Facebook
                        </button>
                    </div>

                    <div className="login-footer">
                        <p>Al continuar, aceptas nuestros <a href="/terms">Términos de Servicio</a> y <a href="/privacy">Política de Privacidad</a></p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-secondary-50) 100%);
          padding: var(--space-4);
        }

        .login-container {
          width: 100%;
          max-width: 450px;
        }

        .login-card {
          padding: var(--space-12);
          text-align: center;
        }

        .login-header {
          margin-bottom: var(--space-10);
        }

        .logo {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-primary-600);
          margin-bottom: var(--space-6);
        }

        .login-header h1 {
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-gray-900);
          margin-bottom: var(--space-2);
        }

        .login-header p {
          font-size: var(--font-size-base);
          color: var(--color-gray-600);
        }

        .login-providers {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .btn-provider {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-4);
          border: 2px solid var(--color-gray-200);
          border-radius: var(--radius-lg);
          background: white;
          font-size: var(--font-size-base);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-provider:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
          border-color: var(--color-gray-300);
        }

        .btn-provider svg {
          flex-shrink: 0;
        }

        .btn-google {
          color: #1a73e8;
        }

        .btn-microsoft {
          color: #2f2f2f;
        }

        .btn-facebook {
          color: #1877F2;
        }

        .login-footer {
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-gray-200);
        }

        .login-footer p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-500);
        }

        .login-footer a {
          color: var(--color-primary-600);
          text-decoration: none;
        }

        .login-footer a:hover {
          text-decoration: underline;
        }

        .login-loading {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-4);
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--color-gray-200);
          border-top-color: var(--color-primary-600);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-card {
            padding: var(--space-8);
          }

          .login-header h1 {
            font-size: var(--font-size-2xl);
          }
        }
      `}</style>
        </div>
    );
}

export default Login;
