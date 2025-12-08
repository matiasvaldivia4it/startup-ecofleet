import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { businessTypes, getEstimatedCapacity } from '../data/businessTypes';
import Footer from '../components/Footer';

function CustomerRegistration() {
    const navigate = useNavigate();
    const { signInWithGoogle, user, isAuthenticated, updateProfile, register } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        businessType: ''
    });

    // Pre-fill data if user is authenticated (e.g. from Google)
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                ownerName: user.user_metadata?.full_name || user.user_metadata?.name || prev.ownerName,
                email: user.email || prev.email,
                // If authenticated via provider, password is not needed
            }));
        }
    }, [isAuthenticated, user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleGoogleRegister = async () => {
        try {
            // Store intention to register as customer
            localStorage.setItem('pending_registration_role', 'customer');
            await signInWithGoogle();
        } catch (error) {
            console.error('Google sign in error:', error);
            setError('Error al iniciar sesión con Google');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            let userId;

            // Calculate capacity
            const estimatedCapacity = getEstimatedCapacity(formData.businessType);
            const businessMetadata = {
                businessName: formData.businessName,
                ownerName: formData.ownerName,
                phone: formData.phone,
                address: formData.address,
                businessType: formData.businessType,
                estimatedCapacity: estimatedCapacity,
                role: 'customer'
            };

            if (isAuthenticated && user) {
                // User already exists (Google)
                await updateProfile(businessMetadata);
                userId = user.id;
            } else {
                // Register new user with email/password
                const result = await register(
                    formData.email,
                    formData.password,
                    {
                        fullName: formData.ownerName, // Map owner name to full_name
                        ...businessMetadata
                    }
                );

                if (!result.success) {
                    throw new Error(result.error || 'Error al registrar');
                }
                userId = result.user.id;
            }

            // Success - navigate to customer portal
            navigate('/customer');

        } catch (err) {
            console.error('Registration error:', err);
            setError(err.message || 'Ocurrió un error inesperado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="registration-page">
            <header className="registration-header">
                <div className="container">
                    <div className="logo">🌿 EcoFleet</div>
                </div>
            </header>

            <div className="container">
                <div className="registration-card card">
                    <h1 className="title">Registra tu Negocio</h1>
                    <p className="subtitle">Únete al ecosistema EcoFleet y comienza a enviar</p>

                    {error && <div className="alert alert-error">{error}</div>}

                    {!isAuthenticated && (
                        <div className="social-login">
                            <button
                                type="button"
                                onClick={handleGoogleRegister}
                                className="btn btn-outline btn-google"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Registrarse con Google
                            </button>
                            <div className="divider">o completa el formulario</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="registration-form">
                        <div className="form-group">
                            <label className="form-label">Nombre del Negocio</label>
                            <input
                                type="text"
                                name="businessName"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ej: Pizzería La Bella"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Nombre del Dueño/Encargado</label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Ej: Juan Pérez"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="contacto@negocio.com"
                                    required
                                    disabled={isAuthenticated}
                                />
                            </div>

                            {!isAuthenticated && (
                                <div className="form-group">
                                    <label className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className="form-input"
                                        placeholder="********"
                                        required
                                    />
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">Teléfono de Contacto</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    placeholder="+56 9 1234 5678"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tipo de Negocio</label>
                                <select
                                    name="businessType"
                                    value={formData.businessType}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Selecciona un tipo</option>
                                    {businessTypes.map(type => (
                                        <option key={type.id} value={type.id}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Dirección del Local</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="form-input"
                                placeholder="Av. Principal 123, Santiago"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block btn-lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Registrando...' : 'Completar Registro'}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .registration-page {
                    min-height: 100vh;
                    background: var(--color-gray-50);
                    padding-bottom: var(--space-16);
                }

                .registration-header {
                    background: white;
                    padding: var(--space-4) 0;
                    box-shadow: var(--shadow-sm);
                    margin-bottom: var(--space-8);
                }

                .logo {
                    font-size: var(--font-size-2xl);
                    font-weight: 800;
                    color: var(--color-primary-600);
                }

                .registration-card {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: var(--space-8);
                }

                .title {
                    text-align: center;
                    font-size: var(--font-size-3xl);
                    margin-bottom: var(--space-2);
                    color: var(--color-gray-900);
                }

                .subtitle {
                    text-align: center;
                    color: var(--color-gray-600);
                    margin-bottom: var(--space-8);
                }

                .social-login {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: var(--space-4);
                    margin-bottom: var(--space-8);
                }

                .btn-google {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    width: 100%;
                    max-width: 400px;
                    justify-content: center;
                    background: white;
                }

                .divider {
                    font-size: var(--font-size-sm);
                    color: var(--color-gray-500);
                    position: relative;
                    width: 100%;
                    text-align: center;
                }

                .divider::before,
                .divider::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    width: 40%;
                    height: 1px;
                    background: var(--color-gray-200);
                }

                .divider::before { left: 0; }
                .divider::after { right: 0; }

                .registration-form {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-6);
                }

                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: var(--space-6);
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .form-label {
                    font-weight: 600;
                    color: var(--color-gray-700);
                    font-size: var(--font-size-sm);
                }

                .form-input, .form-select {
                    padding: var(--space-3);
                    border: 1px solid var(--color-gray-300);
                    border-radius: var(--radius-md);
                    font-size: var(--font-size-base);
                    transition: border-color 0.2s;
                }

                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: var(--color-primary-500);
                    box-shadow: 0 0 0 3px var(--color-primary-100);
                }

                .form-input:disabled {
                    background: var(--color-gray-100);
                    cursor: not-allowed;
                }

                .btn-block {
                    width: 100%;
                }

                .btn-lg {
                    padding: var(--space-4);
                    font-size: var(--font-size-lg);
                }

                .alert {
                    padding: var(--space-4);
                    border-radius: var(--radius-md);
                    margin-bottom: var(--space-6);
                }

                .alert-error {
                    background: #fee2e2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                }

                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    
                    .registration-card {
                        padding: var(--space-6);
                    }
                }
            `}</style>
        </div>
    );
}

export default CustomerRegistration;
