import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { chileanRegions } from '../data/chileanRegions';
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

function DriverRegistrationForm() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        // Step 1: Personal Information
        fullName: '',
        rut: '',
        email: '',
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
            1: ['fullName', 'rut', 'email', 'phone', 'region', 'commune', 'street', 'birthDate'],
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            // In a real app, this would send data to backend
            console.log('Form submitted:', formData);
            // Navigate to dashboard
            navigate('/dashboard');
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
                                />
                                {errors.email && touched.email && (
                                    <span className="form-error">{errors.email}</span>
                                )}
                            </div>

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
                                    {chileanRegions.map(region => (
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
                                <button type="button" className="btn btn-outline btn-sm">
                                    Subir Archivo
                                </button>
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">🚗</div>
                                <h4>Permiso de Circulación</h4>
                                <p>Documento vigente del vehículo</p>
                                <button type="button" className="btn btn-outline btn-sm">
                                    Subir Archivo
                                </button>
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">🛡️</div>
                                <h4>Seguro Obligatorio</h4>
                                <p>SOAP vigente</p>
                                <button type="button" className="btn btn-outline btn-sm">
                                    Subir Archivo
                                </button>
                            </div>

                            <div className="upload-card">
                                <div className="upload-icon">👤</div>
                                <h4>Foto de Perfil</h4>
                                <p>Foto reciente tipo carnet</p>
                                <button type="button" className="btn btn-outline btn-sm">
                                    Subir Archivo
                                </button>
                            </div>
                        </div>

                        <div className="info-box">
                            <p>
                                <strong>Nota:</strong> En esta demo, la carga de archivos está simulada.
                                En producción, podrás subir tus documentos de forma segura.
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
                    {currentStep > 1 && (
                        <button type="button" onClick={prevStep} className="btn btn-ghost">
                            ← Anterior
                        </button>
                    )}

                    <div className="spacer"></div>

                    {currentStep < totalSteps ? (
                        <button type="button" onClick={nextStep} className="btn btn-primary">
                            Siguiente →
                        </button>
                    ) : (
                        <button type="submit" className="btn btn-primary">
                            Enviar Solicitud
                        </button>
                    )}
                </div>
            </form>

            <style jsx>{`
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
