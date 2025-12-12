import { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';

/**
 * Location Tracker Component
 * Displays current location and distance to destination
 */
function LocationTracker({ destination, onLocationUpdate }) {
    const [position, setPosition] = useState(null);
    const [distance, setDistance] = useState(null);
    const [eta, setEta] = useState(null);
    const [error, setError] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    useEffect(() => {
        // Get initial position
        getCurrentLocation();

        return () => {
            LocationService.stopTracking();
        };
    }, []);

    useEffect(() => {
        if (position && destination) {
            const dist = LocationService.calculateDistance(
                position.coords.latitude,
                position.coords.longitude,
                destination.lat,
                destination.lng
            );
            setDistance(dist);

            const estimatedTime = LocationService.estimateTimeToArrival(dist);
            setEta(estimatedTime);
        }
    }, [position, destination]);

    const getCurrentLocation = async () => {
        try {
            const pos = await LocationService.getCurrentPosition();
            setPosition(pos);
            setError(null);

            if (onLocationUpdate) {
                onLocationUpdate(pos);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const startTracking = () => {
        setIsTracking(true);
        LocationService.startTracking((pos) => {
            setPosition(pos);
            if (onLocationUpdate) {
                onLocationUpdate(pos);
            }
        });
    };

    const stopTracking = () => {
        setIsTracking(false);
        LocationService.stopTracking();
    };

    if (error) {
        return (
            <div className="location-tracker error">
                <div className="location-icon">⚠️</div>
                <div className="location-info">
                    <p className="location-error">{error}</p>
                    <button onClick={getCurrentLocation} className="btn btn-sm btn-outline">
                        Reintentar
                    </button>
                </div>

                <style jsx>{`
                    .location-tracker {
                        padding: var(--space-4);
                        background: var(--color-error-50);
                        border: 1px solid var(--color-error-200);
                        border-radius: var(--radius-md);
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                    }

                    .location-icon {
                        font-size: 1.5rem;
                    }

                    .location-info {
                        flex: 1;
                    }

                    .location-error {
                        margin: 0 0 var(--space-2) 0;
                        font-size: var(--font-size-sm);
                        color: var(--color-error-700);
                    }
                `}</style>
            </div>
        );
    }

    if (!position) {
        return (
            <div className="location-tracker loading">
                <div className="spinner-small"></div>
                <span>Obteniendo ubicación...</span>

                <style jsx>{`
                    .location-tracker.loading {
                        padding: var(--space-4);
                        background: var(--color-gray-50);
                        border-radius: var(--radius-md);
                        display: flex;
                        align-items: center;
                        gap: var(--space-3);
                        color: var(--color-gray-600);
                    }

                    .spinner-small {
                        width: 20px;
                        height: 20px;
                        border: 2px solid var(--color-gray-200);
                        border-top-color: var(--color-primary-600);
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                    }

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="location-tracker">
            <div className="location-header">
                <div className="location-icon">📍</div>
                <div className="location-coords">
                    <span className="location-label">Tu ubicación</span>
                    <span className="location-value">
                        {position.coords.latitude.toFixed(4)}, {position.coords.longitude.toFixed(4)}
                    </span>
                </div>
                <button
                    onClick={isTracking ? stopTracking : startTracking}
                    className={`btn btn-sm ${isTracking ? 'btn-accent' : 'btn-outline'}`}
                >
                    {isTracking ? '⏸ Pausar' : '▶ Rastrear'}
                </button>
            </div>

            {destination && distance !== null && (
                <div className="location-destination">
                    <div className="destination-info">
                        <span className="destination-label">🎯 Distancia al destino:</span>
                        <span className="destination-value">{distance} km</span>
                    </div>
                    {eta && (
                        <div className="destination-info">
                            <span className="destination-label">⏱️ Tiempo estimado:</span>
                            <span className="destination-value">{eta} min</span>
                        </div>
                    )}
                </div>
            )}

            <style jsx>{`
                .location-tracker {
                    background: linear-gradient(135deg, var(--color-primary-50), var(--color-electric-50));
                    border: 1px solid var(--color-primary-200);
                    border-radius: var(--radius-md);
                    padding: var(--space-4);
                }

                .location-header {
                    display: flex;
                    align-items: center;
                    gap: var(--space-3);
                    margin-bottom: var(--space-3);
                }

                .location-icon {
                    font-size: 1.5rem;
                }

                .location-coords {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }

                .location-label {
                    font-size: var(--font-size-xs);
                    font-weight: 600;
                    color: var(--color-gray-600);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .location-value {
                    font-size: var(--font-size-sm);
                    font-weight: 600;
                    color: var(--color-gray-900);
                    font-family: monospace;
                }

                .location-destination {
                    padding-top: var(--space-3);
                    border-top: 1px solid var(--color-primary-200);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-2);
                }

                .destination-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .destination-label {
                    font-size: var(--font-size-sm);
                    color: var(--color-gray-700);
                }

                .destination-value {
                    font-size: var(--font-size-base);
                    font-weight: 700;
                    color: var(--color-primary-700);
                }

                @media (max-width: 768px) {
                    .location-header {
                        flex-wrap: wrap;
                    }

                    .location-coords {
                        flex-basis: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default LocationTracker;
