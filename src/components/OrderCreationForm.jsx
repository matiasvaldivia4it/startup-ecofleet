import { useState } from 'react';
import { chileanRegions } from '../data/chileanRegions';
import { validateRequired } from '../utils/validation';

function OrderCreationForm({ onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        pickupAddress: {
            street: '',
            commune: '',
            region: ''
        },
        deliveryAddress: {
            street: '',
            commune: '',
            region: ''
        },
        package: {
            weight: '',
            dimensions: { length: '', width: '', height: '' },
            type: 'standard',
            fragile: false,
            description: ''
        },
        scheduledFor: '',
        specialInstructions: ''
    });

    const [errors, setErrors] = useState({});
    const [estimatedCost, setEstimatedCost] = useState(null);

    const handleInputChange = (e, section, field, subfield = null) => {
        const { value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            if (subfield) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: {
                            ...prev[section][field],
                            [subfield]: newValue
                        }
                    }
                };
            } else if (field) {
                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        [field]: newValue
                    }
                };
            } else {
                return {
                    ...prev,
                    [section]: newValue
                };
            }
        });

        // Clear error
        if (errors[`${section}.${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`${section}.${field}`]: ''
            }));
        }
    };

    const getCommunes = (region) => {
        const regionData = chileanRegions.find(r => r.name === region);
        return regionData ? regionData.communes : [];
    };

    const calculateEstimate = () => {
        const weight = parseFloat(formData.package.weight) || 0;
        const baseCost = 2500;
        const weightCost = weight * 100;
        const fragileFee = formData.package.fragile ? 1000 : 0;
        const estimated = baseCost + weightCost + fragileFee;
        setEstimatedCost(estimated);
    };

    const validate = () => {
        const newErrors = {};

        if (!validateRequired(formData.pickupAddress.street)) {
            newErrors['pickupAddress.street'] = 'Requerido';
        }
        if (!validateRequired(formData.pickupAddress.commune)) {
            newErrors['pickupAddress.commune'] = 'Requerido';
        }
        if (!validateRequired(formData.pickupAddress.region)) {
            newErrors['pickupAddress.region'] = 'Requerido';
        }
        if (!validateRequired(formData.deliveryAddress.street)) {
            newErrors['deliveryAddress.street'] = 'Requerido';
        }
        if (!validateRequired(formData.deliveryAddress.commune)) {
            newErrors['deliveryAddress.commune'] = 'Requerido';
        }
        if (!validateRequired(formData.deliveryAddress.region)) {
            newErrors['deliveryAddress.region'] = 'Requerido';
        }
        if (!validateRequired(formData.package.weight)) {
            newErrors['package.weight'] = 'Requerido';
        }
        if (!validateRequired(formData.package.description)) {
            newErrors['package.description'] = 'Requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="order-form">
            <div className="form-section">
                <h3 className="section-title">📍 Dirección de Recogida</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label form-label-required">Región</label>
                        <select
                            className={`form-select ${errors['pickupAddress.region'] ? 'error' : ''}`}
                            value={formData.pickupAddress.region}
                            onChange={(e) => {
                                handleInputChange(e, 'pickupAddress', 'region');
                                setFormData(prev => ({
                                    ...prev,
                                    pickupAddress: { ...prev.pickupAddress, commune: '' }
                                }));
                            }}
                        >
                            <option value="">Selecciona una región</option>
                            {chileanRegions.map(region => (
                                <option key={region.id} value={region.name}>{region.name}</option>
                            ))}
                        </select>
                        {errors['pickupAddress.region'] && (
                            <span className="form-error">{errors['pickupAddress.region']}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label form-label-required">Comuna</label>
                        <select
                            className={`form-select ${errors['pickupAddress.commune'] ? 'error' : ''}`}
                            value={formData.pickupAddress.commune}
                            onChange={(e) => handleInputChange(e, 'pickupAddress', 'commune')}
                            disabled={!formData.pickupAddress.region}
                        >
                            <option value="">Selecciona una comuna</option>
                            {getCommunes(formData.pickupAddress.region).map(commune => (
                                <option key={commune} value={commune}>{commune}</option>
                            ))}
                        </select>
                        {errors['pickupAddress.commune'] && (
                            <span className="form-error">{errors['pickupAddress.commune']}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label form-label-required">Dirección</label>
                    <input
                        type="text"
                        className={`form-input ${errors['pickupAddress.street'] ? 'error' : ''}`}
                        value={formData.pickupAddress.street}
                        onChange={(e) => handleInputChange(e, 'pickupAddress', 'street')}
                        placeholder="Calle, número, depto/oficina"
                    />
                    {errors['pickupAddress.street'] && (
                        <span className="form-error">{errors['pickupAddress.street']}</span>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">🎯 Dirección de Entrega</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label form-label-required">Región</label>
                        <select
                            className={`form-select ${errors['deliveryAddress.region'] ? 'error' : ''}`}
                            value={formData.deliveryAddress.region}
                            onChange={(e) => {
                                handleInputChange(e, 'deliveryAddress', 'region');
                                setFormData(prev => ({
                                    ...prev,
                                    deliveryAddress: { ...prev.deliveryAddress, commune: '' }
                                }));
                            }}
                        >
                            <option value="">Selecciona una región</option>
                            {chileanRegions.map(region => (
                                <option key={region.id} value={region.name}>{region.name}</option>
                            ))}
                        </select>
                        {errors['deliveryAddress.region'] && (
                            <span className="form-error">{errors['deliveryAddress.region']}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label form-label-required">Comuna</label>
                        <select
                            className={`form-select ${errors['deliveryAddress.commune'] ? 'error' : ''}`}
                            value={formData.deliveryAddress.commune}
                            onChange={(e) => handleInputChange(e, 'deliveryAddress', 'commune')}
                            disabled={!formData.deliveryAddress.region}
                        >
                            <option value="">Selecciona una comuna</option>
                            {getCommunes(formData.deliveryAddress.region).map(commune => (
                                <option key={commune} value={commune}>{commune}</option>
                            ))}
                        </select>
                        {errors['deliveryAddress.commune'] && (
                            <span className="form-error">{errors['deliveryAddress.commune']}</span>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label form-label-required">Dirección</label>
                    <input
                        type="text"
                        className={`form-input ${errors['deliveryAddress.street'] ? 'error' : ''}`}
                        value={formData.deliveryAddress.street}
                        onChange={(e) => handleInputChange(e, 'deliveryAddress', 'street')}
                        placeholder="Calle, número, depto/oficina"
                    />
                    {errors['deliveryAddress.street'] && (
                        <span className="form-error">{errors['deliveryAddress.street']}</span>
                    )}
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">📦 Detalles del Paquete</h3>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label form-label-required">Peso (kg)</label>
                        <input
                            type="number"
                            className={`form-input ${errors['package.weight'] ? 'error' : ''}`}
                            value={formData.package.weight}
                            onChange={(e) => {
                                handleInputChange(e, 'package', 'weight');
                                calculateEstimate();
                            }}
                            min="0.1"
                            step="0.1"
                            placeholder="2.5"
                        />
                        {errors['package.weight'] && (
                            <span className="form-error">{errors['package.weight']}</span>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Tipo de Paquete</label>
                        <select
                            className="form-select"
                            value={formData.package.type}
                            onChange={(e) => handleInputChange(e, 'package', 'type')}
                        >
                            <option value="standard">Estándar</option>
                            <option value="express">Express</option>
                            <option value="fragile">Frágil</option>
                            <option value="food">Alimentos</option>
                            <option value="documents">Documentos</option>
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label className="form-label">Largo (cm)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.package.dimensions.length}
                            onChange={(e) => handleInputChange(e, 'package', 'dimensions', 'length')}
                            min="1"
                            placeholder="30"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Ancho (cm)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.package.dimensions.width}
                            onChange={(e) => handleInputChange(e, 'package', 'dimensions', 'width')}
                            min="1"
                            placeholder="20"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Alto (cm)</label>
                        <input
                            type="number"
                            className="form-input"
                            value={formData.package.dimensions.height}
                            onChange={(e) => handleInputChange(e, 'package', 'dimensions', 'height')}
                            min="1"
                            placeholder="10"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label form-label-required">Descripción del Contenido</label>
                    <textarea
                        className={`form-textarea ${errors['package.description'] ? 'error' : ''}`}
                        value={formData.package.description}
                        onChange={(e) => handleInputChange(e, 'package', 'description')}
                        placeholder="Describe brevemente el contenido del paquete"
                        rows="3"
                    />
                    {errors['package.description'] && (
                        <span className="form-error">{errors['package.description']}</span>
                    )}
                </div>

                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={formData.package.fragile}
                            onChange={(e) => {
                                handleInputChange(e, 'package', 'fragile');
                                calculateEstimate();
                            }}
                        />
                        <span>Contenido frágil (cargo adicional de $1.000)</span>
                    </label>
                </div>
            </div>

            <div className="form-section">
                <h3 className="section-title">⏰ Programación y Detalles</h3>

                <div className="form-group">
                    <label className="form-label">Fecha y Hora Preferida</label>
                    <input
                        type="datetime-local"
                        className="form-input"
                        value={formData.scheduledFor}
                        onChange={(e) => handleInputChange(e, 'scheduledFor')}
                        min={new Date().toISOString().slice(0, 16)}
                    />
                    <span className="form-help">Opcional - Si no se especifica, se procesará lo antes posible</span>
                </div>

                <div className="form-group">
                    <label className="form-label">Instrucciones Especiales</label>
                    <textarea
                        className="form-textarea"
                        value={formData.specialInstructions}
                        onChange={(e) => handleInputChange(e, 'specialInstructions')}
                        placeholder="Ej: Tocar timbre, dejar en portería, etc."
                        rows="2"
                    />
                </div>
            </div>

            {estimatedCost && (
                <div className="cost-estimate card">
                    <div className="estimate-header">
                        <span className="estimate-label">Costo Estimado:</span>
                        <span className="estimate-value">${estimatedCost.toLocaleString('es-CL')}</span>
                    </div>
                    <span className="estimate-note">El costo final puede variar según la distancia exacta</span>
                </div>
            )}

            <div className="form-actions">
                {onCancel && (
                    <button type="button" onClick={onCancel} className="btn btn-ghost">
                        Cancelar
                    </button>
                )}
                <button type="submit" className="btn btn-primary">
                    Crear Orden
                </button>
            </div>

            <style jsx>{`
        .order-form {
          max-width: 800px;
        }

        .form-section {
          background: white;
          padding: var(--space-6);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-6);
          box-shadow: var(--shadow-sm);
        }

        .section-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          margin-bottom: var(--space-5);
          color: var(--color-gray-900);
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4);
        }

        .cost-estimate {
          background: linear-gradient(135deg, var(--color-primary-50), var(--color-electric-50));
          border: 2px solid var(--color-primary-200);
          padding: var(--space-5);
          margin-bottom: var(--space-6);
        }

        .estimate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-2);
        }

        .estimate-label {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-gray-700);
        }

        .estimate-value {
          font-size: var(--font-size-3xl);
          font-weight: 800;
          color: var(--color-primary-700);
        }

        .estimate-note {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
        }

        .form-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </form>
    );
}

export default OrderCreationForm;
