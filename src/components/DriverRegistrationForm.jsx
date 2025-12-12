
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StorageService } from '../services/StorageService';
import { ConfigService } from '../services/ConfigService';
import {
    validateRUT,
    formatRUT,
    validateChileanPhone,
    formatChileanPhone,
    validateEmail,
    validateRequired,
    validateAge,
    validateLicensePlate,
    formatLicensePlate
} from '../utils/validation';
import { chileanRegions } from '../data/chileanRegions';

function DriverRegistrationForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;
    const [allowedRegions, setAllowedRegions] = useState([]);

    useEffect(() => {
        // Fetch allowed regions configuration
        const fetchConfig = async () => {
            const regions = await ConfigService.getAllowedRegions();
            setAllowedRegions(regions);
        };
        fetchConfig();
    }, []);

    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        fullName: '',
        rut: '',
        email: '',
        password: '',
        phone: '',
        region: '',
        commune: '',
        street: '',
        birthDate: '',

        // Step 2: Driver License
        licenseNumber: '',
        licenseType: '',
        licenseExpiration: '',
        yearsExperience: '',

        // Step 3: Vehicle Information
        vehicleType: '',
        vehicleBrand: '',
        vehicleModel: '',
        vehicleYear: '',
        licensePlate: '',
        batteryRange: '',

        // Step 4: Documents (simulated)
        driversLicensePhoto: null,
        vehicleRegistration: null,
        insuranceCertificate: null,
        profilePhoto: null,

        // Step 5: Availability
        preferredHours: [],
        availableDays: [],
        preferredZones: []
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;

        // Apply formatting
        if (name === 'rut') {
            formattedValue = formatRUT(value);
        } else if (name === 'phone') {
            formattedValue = formatChileanPhone(value);
        } else if (name === 'licensePlate') {
            formattedValue = formatLicensePlate(value);
        }

        setFormData(prev => ({
            ...prev,
            [name]: formattedValue
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({
            ...prev,
            [name]: true
        }));
        validateField(name, formData[name]);
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: checked
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                [field]: file
            }));
        }
    };

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'fullName':
                if (!validateRequired(value)) error = 'El nombre completo es requerido';
                break;
            case 'rut':
                if (!validateRequired(value)) {
                    error = 'El RUT es requerido';
                } else if (!validateRUT(value)) {
                    error = 'RUT inválido';
                }
                break;
            case 'email':
                if (!validateRequired(value)) {
                    error = 'El email es requerido';
                } else if (!validateEmail(value)) {
                    error = 'Email inválido';
                }
                break;
            case 'password':
                if (!isAuthenticated) {
                    if (!validateRequired(value)) {
                        error = 'La contraseña es requerida';
                    } else if (value.length < 6) {
                        error = 'La contraseña debe tener al menos 6 caracteres';
                    }
                }
                break;
            case 'phone':
                if (!validateRequired(value)) {
                    error = 'El teléfono es requerido';
                } else if (!validateChileanPhone(value)) {
                    error = 'Teléfono inválido (formato: +56 9 1234 5678)';
                }
                break;
            case 'birthDate':
                if (!validateRequired(value)) {
                    error = 'La fecha de nacimiento es requerida';
                } else if (!validateAge(value)) {
                    error = 'Debes ser mayor de 18 años';
                }
                break;
            case 'licensePlate':
                if (validateRequired(value) && !validateLicensePlate(value)) {
                    error = 'Patente inválida';
                }
                break;
            default:
                if (!validateRequired(value)) {
                    error = 'Este campo es requerido';
                }
        }

        setErrors(prev => ({
            ...prev,
            [name]: error
        }));

        return error === '';
    };

    const validateStep = (step) => {
        const fieldsToValidate = {
            1: ['fullName', 'rut', 'email', ...(isAuthenticated ? [] : ['password']), 'phone', 'region', 'commune', 'street', 'birthDate'],
            2: ['licenseNumber', 'licenseType', 'licenseExpiration', 'yearsExperience'],
            3: ['vehicleType', 'vehicleBrand', 'vehicleModel', 'vehicleYear', 'licensePlate', 'batteryRange'],
            4: [], // Documents are optional for demo
            5: [] // Availability is optional
        };

        const fields = fieldsToValidate[step];
        let isValid = true;
        const newErrors = {};

        fields.forEach(field => {
            if (!validateField(field, formData[field])) {
                isValid = false;
            }
        });

        return isValid;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
            window.scrollTo(0, 0);
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
        window.scrollTo(0, 0);
    };

    const { register, signInWithGoogle, user, isAuthenticated, updateProfile } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Pre-fill data if user is authenticated (e.g. from Google)
    useEffect(() => {
        if (isAuthenticated && user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.user_metadata?.full_name || user.user_metadata?.name || '',
                email: user.email || '',
                // If authenticated via provider, password is not needed/managed here
            }));
        }
    }, [isAuthenticated, user]);

    const handleGoogleRegister = async () => {
        try {
            // Store intention to register as driver
            localStorage.setItem('pending_registration_role', 'driver');
            await signInWithGoogle();
            // The redirect will handle the rest
        } catch (error) {
            console.error('Google sign in error:', error);
            setSubmitError('Error al iniciar sesión con Google');
        }
    };

    const uploadDocuments = async (userId) => {
        const documents = [
            { field: 'driversLicensePhoto', path: 'license' },
            { field: 'vehicleRegistration', path: 'registration' },
            { field: 'insuranceCertificate', path: 'insurance' },
            { field: 'profilePhoto', path: 'profile' }
        ];

        const updates = {};

        for (const doc of documents) {
            const file = formData[doc.field];
            if (file) {
                const { url, error } = await StorageService.uploadFile(
                    file,
                    'driver-documents',
                    `${userId}/${doc.path}`
                );

                if (!error && url) {
                    updates[`${doc.field}Url`] = url;
                }
            }
        }

        return updates;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        if (validateStep(currentStep)) {
            setIsSubmitting(true);
            try {
                let result;
                let userId;

                if (isAuthenticated && user) {
                    // User already exists (Google)
                    result = { success: true, user: user };
                    userId = user.id;
                } else {
                    // Register new user
                    result = await register(
                        formData.email,
                        formData.password,
                        {
                            fullName: formData.fullName,
                            rut: formData.rut,
                            phone: formData.phone,
                            region: formData.region,
                            commune: formData.commune,
                            vehicleType: formData.vehicleType,
                            vehicleBrand: formData.vehicleBrand,
                            vehicleModel: formData.vehicleModel,
                            vehicleYear: formData.vehicleYear,
                            licensePlate: formData.licensePlate
                        }
                    );
                    if (result.success) {
                        userId = result.user.id;
                    }
                }

                if (result.success && userId) {
                    // Upload documents
                    const documentUpdates = await uploadDocuments(userId);

                    // Update profile with document URLs
                    if (Object.keys(documentUpdates).length > 0) {
                        await updateProfile(documentUpdates);
                    }

                    // Navigate to dashboard
                    navigate('/dashboard');
                } else {
                    setSubmitError(result.error || 'Error al registrar. Por favor intenta nuevamente.');
                }
            } catch (err) {
                console.error('Registration error:', err);
                setSubmitError('Ocurrió un error inesperado.');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getCommunes = () => {
        const region = chileanRegions.find(r => r.name === formData.region);
        return region ? region.communes : [];
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="form-step">
                        <h3 className="step-heading">Información Personal</h3>

                        {!isAuthenticated && (
                            <div className="social-login-container">
                                <button type="button" onClick={handleGoogleRegister} className="btn btn-google-outline">
                                    <svg width="20" height="20" viewBox="0 0 24 24">
                                        <path
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            fill="#4285F4"
                                        />
                                        <path
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            fill="#34A853"
                                        />
                                        <path
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z"
                                            fill="#FBBC05"
                                        />
                                        <path
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            fill="#EA4335"
                                        />
                                    </svg>
                                    Registrarse con Google
                                </button>
                                <div className="divider">
                                    <span>o completa el formulario</span>
                                </div>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    className={`form-input ${errors.fullName && touched.fullName ? 'error' : ''}`}
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Juan Pérez González"
                                />
                                {errors.fullName && touched.fullName && (
                                    <span className="form-error">{errors.fullName}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">RUT</label>
                                <input
                                    type="text"
                                    name="rut"
                                    className={`form-input ${errors.rut && touched.rut ? 'error' : ''}`}
                                    value={formData.rut}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="12.345.678-9"
                                />
                                {errors.rut && touched.rut && (
                                    <span className="form-error">{errors.rut}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="juan.perez@email.com"
                                    disabled={isAuthenticated} // Disable if logged in
                                />
                                {errors.email && touched.email && (
                                    <span className="form-error">{errors.email}</span>
                                )}
                            </div>

                            {!isAuthenticated && (
                                <div className="form-group">
                                    <label className="form-label form-label-required">Contraseña</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-input ${errors.password && touched.password ? 'error' : ''}`}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        onBlur={handleBlur}
                                        placeholder="********"
                                    />
                                    {errors.password && touched.password && (
                                        <span className="form-error">{errors.password}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className={`form-input ${errors.phone && touched.phone ? 'error' : ''}`}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="+56 9 1234 5678"
                                />
                                {errors.phone && touched.phone && (
                                    <span className="form-error">{errors.phone}</span>
                                )}
                                <span className="form-help">Formato: +56 9 XXXX XXXX</span>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Región</label>
                                <select
                                    name="region"
                                    className={`form-select ${errors.region && touched.region ? 'error' : ''}`}
                                    value={formData.region}
                                    onChange={(e) => {
                                        handleInputChange(e);
                                        setFormData(prev => ({ ...prev, commune: '' }));
                                    }}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Selecciona una región</option>
                                    {chileanRegions
                                        .filter(region => allowedRegions.includes(region.name))
                                        .map(region => (
                                            <option key={region.id} value={region.name}>{region.name}</option>
                                        ))}
                                </select>
                                {errors.region && touched.region && (
                                    <span className="form-error">{errors.region}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Comuna</label>
                                <select
                                    name="commune"
                                    className={`form-select ${errors.commune && touched.commune ? 'error' : ''}`}
                                    value={formData.commune}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    disabled={!formData.region}
                                >
                                    <option value="">Selecciona una comuna</option>
                                    {getCommunes().map(commune => (
                                        <option key={commune} value={commune}>{commune}</option>
                                    ))}
                                </select>
                                {errors.commune && touched.commune && (
                                    <span className="form-error">{errors.commune}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label form-label-required">Dirección</label>
                            <input
                                type="text"
                                name="street"
                                className={`form-input ${errors.street && touched.street ? 'error' : ''}`}
                                value={formData.street}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                placeholder="Av. Libertador Bernardo O'Higgins 123"
                            />
                            {errors.street && touched.street && (
                                <span className="form-error">{errors.street}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label form-label-required">Fecha de Nacimiento</label>
                            <input
                                type="date"
                                name="birthDate"
                                className={`form-input ${errors.birthDate && touched.birthDate ? 'error' : ''}`}
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            />
                            {errors.birthDate && touched.birthDate && (
                                <span className="form-error">{errors.birthDate}</span>
                            )}
                            <span className="form-help">Debes ser mayor de 18 años</span>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="form-step">
                        <h3 className="step-heading">Licencia de Conducir</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Número de Licencia</label>
                                <input
                                    type="text"
                                    name="licenseNumber"
                                    className={`form-input ${errors.licenseNumber && touched.licenseNumber ? 'error' : ''}`}
                                    value={formData.licenseNumber}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="12345678"
                                />
                                {errors.licenseNumber && touched.licenseNumber && (
                                    <span className="form-error">{errors.licenseNumber}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Clase de Licencia</label>
                                <select
                                    name="licenseType"
                                    className={`form-select ${errors.licenseType && touched.licenseType ? 'error' : ''}`}
                                    value={formData.licenseType}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                >
                                    <option value="">Selecciona una clase</option>
                                    <option value="B">Clase B (Automóviles)</option>
                                    <option value="A1">Clase A1 (Motocicletas hasta 125cc)</option>
                                    <option value="A2">Clase A2 (Motocicletas hasta 400cc)</option>
                                    <option value="A3">Clase A3 (Motocicletas sin límite)</option>
                                    <option value="A4">Clase A4 (Vehículos motorizados de 3 ruedas)</option>
                                    <option value="A5">Clase A5 (Vehículos motorizados de 3 ruedas de carga)</option>
                                </select>
                                {errors.licenseType && touched.licenseType && (
                                    <span className="form-error">{errors.licenseType}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Fecha de Vencimiento</label>
                                <input
                                    type="date"
                                    name="licenseExpiration"
                                    className={`form-input ${errors.licenseExpiration && touched.licenseExpiration ? 'error' : ''}`}
                                    value={formData.licenseExpiration}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                />
                                {errors.licenseExpiration && touched.licenseExpiration && (
                                    <span className="form-error">{errors.licenseExpiration}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Años de Experiencia</label>
                                <input
                                    type="number"
                                    name="yearsExperience"
                                    className={`form-input ${errors.yearsExperience && touched.yearsExperience ? 'error' : ''}`}
                                    value={formData.yearsExperience}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    min="0"
                                    max="70"
                                    placeholder="5"
                                />
                                {errors.yearsExperience && touched.yearsExperience && (
                                    <span className="form-error">{errors.yearsExperience}</span>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="form-step">
                        <h3 className="step-heading">Información del Vehículo Eléctrico</h3>

                        <div className="form-group">
                            <label className="form-label form-label-required">Tipo de Vehículo</label>
                            <select
                                name="vehicleType"
                                className={`form-select ${errors.vehicleType && touched.vehicleType ? 'error' : ''}`}
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                            >
                                <option value="">Selecciona un tipo</option>
                                <option value="electric-bike">🚲 Bicicleta Eléctrica</option>
                                <option value="electric-scooter">🛴 Scooter Eléctrico</option>
                                <option value="electric-motorcycle">🏍️ Motocicleta Eléctrica</option>
                                <option value="electric-car">🚗 Automóvil Eléctrico</option>
                                <option value="electric-van">🚐 Furgoneta Eléctrica</option>
                            </select>
                            {errors.vehicleType && touched.vehicleType && (
                                <span className="form-error">{errors.vehicleType}</span>
                            )}
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Marca</label>
                                <input
                                    type="text"
                                    name="vehicleBrand"
                                    className={`form-input ${errors.vehicleBrand && touched.vehicleBrand ? 'error' : ''}`}
                                    value={formData.vehicleBrand}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Tesla, Nissan, BYD, etc."
                                />
                                {errors.vehicleBrand && touched.vehicleBrand && (
                                    <span className="form-error">{errors.vehicleBrand}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Modelo</label>
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    className={`form-input ${errors.vehicleModel && touched.vehicleModel ? 'error' : ''}`}
                                    value={formData.vehicleModel}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="Model 3, Leaf, etc."
                                />
                                {errors.vehicleModel && touched.vehicleModel && (
                                    <span className="form-error">{errors.vehicleModel}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label form-label-required">Año</label>
                                <input
                                    type="number"
                                    name="vehicleYear"
                                    className={`form-input ${errors.vehicleYear && touched.vehicleYear ? 'error' : ''}`}
                                    value={formData.vehicleYear}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    min="2010"
                                    max="2025"
                                    placeholder="2023"
                                />
                                {errors.vehicleYear && touched.vehicleYear && (
                                    <span className="form-error">{errors.vehicleYear}</span>
                                )}
                            </div>

                            <div className="form-group">
                                <label className="form-label form-label-required">Patente</label>
                                <input
                                    type="text"
                                    name="licensePlate"
                                    className={`form-input ${errors.licensePlate && touched.licensePlate ? 'error' : ''}`}
                                    value={formData.licensePlate}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    placeholder="ABCD12 o AB1234"
                                />
                                {errors.licensePlate && touched.licensePlate && (
                                    <span className="form-error">{errors.licensePlate}</span>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label form-label-required">Autonomía de Batería (km)</label>
                            <input
                                type="number"
                                name="batteryRange"
                                className={`form-input ${errors.batteryRange && touched.batteryRange ? 'error' : ''}`}
                                value={formData.batteryRange}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                min="10"
                                max="1000"
                                placeholder="300"
                            />
                            {errors.batteryRange && touched.batteryRange && (
                                <span className="form-error">{errors.batteryRange}</span>
                            )}
                            <span className="form-help">Autonomía aproximada con carga completa</span>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="form-step">
                        <h3 className="step-heading">Documentos</h3>
                        <p className="step-description">
                            Sube los siguientes documentos para verificar tu identidad y vehículo
                        </p>

                        <div className="upload-grid">
                            <div className="upload-card">
                                <div className="upload-icon">📄</div>
                                <h4>Licencia de Conducir</h4>
                                <p>Foto clara de ambos lados</p>
                                <input
                                    type="file"
                                    id="driversLicensePhoto"
                                    className="hidden-input"
                                    onChange={(e) => handleFileChange(e, 'driversLicensePhoto')}
                                    accept="image/*,.pdf"
                                />
                                <label htmlFor="driversLicensePhoto" className={`btn btn-sm ${formData.driversLicensePhoto ? 'btn-success' : 'btn-outline'}`}>
                                    {formData.driversLicensePhoto ? 'Archivo Seleccionado' : 'Subir Archivo'}
                                </label>
                                {formData.driversLicensePhoto && <span className="file-name">{formData.driversLicensePhoto.name}</span>}
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">🚗</div>
                                <h4>Permiso de Circulación</h4>
                                <p>Documento vigente del vehículo</p>
                                <input
                                    type="file"
                                    id="vehicleRegistration"
                                    className="hidden-input"
                                    onChange={(e) => handleFileChange(e, 'vehicleRegistration')}
                                    accept="image/*,.pdf"
                                />
                                <label htmlFor="vehicleRegistration" className={`btn btn-sm ${formData.vehicleRegistration ? 'btn-success' : 'btn-outline'}`}>
                                    {formData.vehicleRegistration ? 'Archivo Seleccionado' : 'Subir Archivo'}
                                </label>
                                {formData.vehicleRegistration && <span className="file-name">{formData.vehicleRegistration.name}</span>}
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">🛡️</div>
                                <h4>Seguro Obligatorio</h4>
                                <p>SOAP vigente</p>
                                <input
                                    type="file"
                                    id="insuranceCertificate"
                                    className="hidden-input"
                                    onChange={(e) => handleFileChange(e, 'insuranceCertificate')}
                                    accept="image/*,.pdf"
                                />
                                <label htmlFor="insuranceCertificate" className={`btn btn-sm ${formData.insuranceCertificate ? 'btn-success' : 'btn-outline'}`}>
                                    {formData.insuranceCertificate ? 'Archivo Seleccionado' : 'Subir Archivo'}
                                </label>
                                {formData.insuranceCertificate && <span className="file-name">{formData.insuranceCertificate.name}</span>}
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">👤</div>
                                <h4>Foto de Perfil</h4>
                                <p>Foto reciente tipo carnet</p>
                                <input
                                    type="file"
                                    id="profilePhoto"
                                    className="hidden-input"
                                    onChange={(e) => handleFileChange(e, 'profilePhoto')}
                                    accept="image/*"
                                />
                                <label htmlFor="profilePhoto" className={`btn btn-sm ${formData.profilePhoto ? 'btn-success' : 'btn-outline'}`}>
                                    {formData.profilePhoto ? 'Archivo Seleccionado' : 'Subir Archivo'}
                                </label>
                                {formData.profilePhoto && <span className="file-name">{formData.profilePhoto.name}</span>}
                            </div>
                        </div>

                        <div className="info-box">
                            <p>
                                <strong>Nota:</strong> Los documentos serán verificados por nuestro equipo en un plazo de 24 horas.
                            </p>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="form-step">
                        <h3 className="step-heading">Disponibilidad</h3>
                        <p className="step-description">
                            Cuéntanos cuándo y dónde prefieres trabajar
                        </p>

                        <div className="form-group">
                            <label className="form-label">Horarios Preferidos</label>
                            <div className="checkbox-group">
                                {['Mañana (6:00 - 12:00)', 'Tarde (12:00 - 18:00)', 'Noche (18:00 - 24:00)', 'Madrugada (00:00 - 6:00)'].map(hour => (
                                    <label key={hour} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={hour}
                                            checked={formData.preferredHours.includes(hour)}
                                            onChange={(e) => handleCheckboxChange(e, 'preferredHours')}
                                        />
                                        <span>{hour}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Días Disponibles</label>
                            <div className="checkbox-group">
                                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                                    <label key={day} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={day}
                                            checked={formData.availableDays.includes(day)}
                                            onChange={(e) => handleCheckboxChange(e, 'availableDays')}
                                        />
                                        <span>{day}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Zonas Preferidas</label>
                            <div className="checkbox-group">
                                {['Centro', 'Zona Norte', 'Zona Sur', 'Zona Oriente', 'Zona Poniente'].map(zone => (
                                    <label key={zone} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            value={zone}
                                            checked={formData.preferredZones.includes(zone)}
                                            onChange={(e) => handleCheckboxChange(e, 'preferredZones')}
                                        />
                                        <span>{zone}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="registration-form-container">
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }}></div>
            </div>

            <div className="progress-steps">
                {[1, 2, 3, 4, 5].map(step => (
                    <div
                        key={step}
                        className={`progress-step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}
                    >
                        <div className="step-circle">
                            {currentStep > step ? '✓' : step}
                        </div>
                        <div className="step-label">
                            {step === 1 && 'Personal'}
                            {step === 2 && 'Licencia'}
                            {step === 3 && 'Vehículo'}
                            {step === 4 && 'Documentos'}
                            {step === 5 && 'Disponibilidad'}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="registration-form">
                {renderStepContent()}

                <div className="form-actions">
                    {submitError && (
                        <div className="submit-error">
                            {submitError}
                        </div>
                    )}

                    {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className="btn btn-ghost" disabled={isSubmitting}>
                            ← Anterior
                        </button>
                    )}

                    <div className="spacer"></div>

                    {currentStep < totalSteps ? (
                        <button type="button" onClick={nextStep} className="btn btn-primary">
                            Siguiente →
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
        .social-login-container {
            margin-bottom: var(--space-6);
            text-align: center;
        }

        .btn-google-outline {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: var(--space-3);
            width: 100%;
            background: white;
            border: 1px solid var(--color-gray-300);
            color: var(--color-gray-700);
            font-weight: 500;
            padding: var(--space-3);
            border-radius: var(--radius-md);
            transition: all var(--transition-fast);
            margin-bottom: var(--space-4);
        }

        .btn-google-outline:hover {
            background: var(--color-gray-50);
            border-color: var(--color-gray-400);
        }

        .divider {
            display: flex;
            align-items: center;
            text-align: center;
            color: var(--color-gray-500);
            font-size: var(--font-size-sm);
        }

        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid var(--color-gray-200);
        }

        .divider span {
            padding: 0 var(--space-4);
        }

        .hidden-input {
            display: none;
        }

        .file-name {
            display: block;
            font-size: var(--font-size-xs);
            color: var(--color-gray-600);
            margin-top: var(--space-2);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100%;
        }

        .btn-success {
            background-color: var(--color-success-100);
            color: var(--color-success-700);
            border-color: var(--color-success-300);
        }

        .registration-form-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .progress-bar {
          height: 4px;
          background: var(--color-gray-200);
          border-radius: var(--radius-full);
          margin-bottom: var(--space-8);
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary-500), var(--color-electric-500));
          transition: width var(--transition-base);
        }
        
        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: var(--space-12);
        }
        
        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
          flex: 1;
        }
        
        .step-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-gray-200);
          color: var(--color-gray-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          transition: all var(--transition-base);
        }
        
        .progress-step.active .step-circle {
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-electric-500));
          color: white;
          box-shadow: var(--shadow-glow);
        }
        
        .progress-step.completed .step-circle {
          background: var(--color-primary-600);
          color: white;
        }
        
        .step-label {
          font-size: var(--font-size-xs);
          color: var(--color-gray-600);
          font-weight: 600;
          text-align: center;
        }
        
        .progress-step.active .step-label {
          color: var(--color-primary-700);
        }
        
        .registration-form {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-lg);
        }
        
        .form-step {
          min-height: 400px;
        }
        
        .step-heading {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--space-2);
          color: var(--color-gray-900);
        }
        
        .step-description {
          color: var(--color-gray-600);
          margin-bottom: var(--space-8);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-6);
        }
        
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }
        
        .checkbox-label:hover {
          background: var(--color-gray-50);
        }
        
        .checkbox-label input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }
        
        .upload-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-8);
        }
        
        .upload-card {
          text-align: center;
          padding: var(--space-6);
          border: 2px dashed var(--color-gray-300);
          border-radius: var(--radius-lg);
          transition: all var(--transition-base);
        }
        
        .upload-card:hover {
          border-color: var(--color-primary-400);
          background: var(--color-primary-50);
        }
        
        .upload-icon {
          font-size: 3rem;
          margin-bottom: var(--space-3);
        }
        
        .upload-card h4 {
          font-size: var(--font-size-base);
          margin-bottom: var(--space-2);
        }
        
        .upload-card p {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          margin-bottom: var(--space-4);
        }
        
        .info-box {
          background: var(--color-electric-50);
          border-left: 4px solid var(--color-electric-500);
          padding: var(--space-4);
          border-radius: var(--radius-md);
        }
        
        .info-box p {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-gray-700);
        }
        
        .form-actions {
          display: flex;
          gap: var(--space-4);
          margin-top: var(--space-8);
          padding-top: var(--space-6);
          border-top: 1px solid var(--color-gray-200);
        }
        
        .spacer {
          flex: 1;
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .upload-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-steps {
            display: none;
          }
          
          .step-label {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}

export default DriverRegistrationForm;
