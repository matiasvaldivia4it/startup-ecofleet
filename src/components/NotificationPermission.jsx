import { useState, useEffect } from 'react';
import NotificationService from '../services/NotificationService';

/**
 * Notification Permission Component
 * Prompts user to enable notifications
 */
function NotificationPermission({ onPermissionGranted, onDismiss }) {
    const [permission, setPermission] = useState('default');
    const [isRequesting, setIsRequesting] = useState(false);

    useEffect(() => {
        setPermission(NotificationService.getPermission());
    }, []);

    const requestPermission = async () => {
        setIsRequesting(true);
        try {
            const result = await NotificationService.requestPermission();
            setPermission(result);

            if (result === 'granted') {
                // Register service worker for notifications
                await NotificationService.registerServiceWorker();

                if (onPermissionGranted) {
                    onPermissionGranted();
                }
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        } finally {
            setIsRequesting(false);
        }
    };

    // Don't show if already granted or denied
    if (permission === 'granted' || permission === 'denied') {
        return null;
    }

    return (
        <div className="notification-permission-banner">
            <div className="permission-content">
                <div className="permission-icon">🔔</div>
                <div className="permission-text">
                    <h4>Habilitar Notificaciones</h4>
                    <p>Recibe alertas cuando se te asignen nuevas órdenes</p>
                </div>
            </div>
            <div className="permission-actions">
                <button
                    onClick={requestPermission}
                    className="btn btn-primary btn-sm"
                    disabled={isRequesting}
                >
                    {isRequesting ? 'Solicitando...' : 'Habilitar'}
                </button>
                {onDismiss && (
                    <button
                        onClick={onDismiss}
                        className="btn btn-outline btn-sm"
                    >
                        Ahora no
                    </button>
                )}
            </div>

            <style jsx>{`
                .notification-permission-banner {
                    background: linear-gradient(135deg, var(--color-primary-50), var(--color-electric-50));
                    border: 2px solid var(--color-primary-200);
                    border-radius: var(--radius-lg);
                    padding: var(--space-5);
                    margin-bottom: var(--space-6);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: var(--space-4);
                    box-shadow: var(--shadow-md);
                }

                .permission-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-4);
                    flex: 1;
                }

                .permission-icon {
                    font-size: 2.5rem;
                    flex-shrink: 0;
                }

                .permission-text h4 {
                    margin: 0 0 var(--space-1) 0;
                    font-size: var(--font-size-lg);
                    font-weight: 700;
                    color: var(--color-gray-900);
                }

                .permission-text p {
                    margin: 0;
                    font-size: var(--font-size-sm);
                    color: var(--color-gray-600);
                }

                .permission-actions {
                    display: flex;
                    gap: var(--space-3);
                    flex-shrink: 0;
                }

                @media (max-width: 768px) {
                    .notification-permission-banner {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .permission-actions {
                        width: 100%;
                    }

                    .permission-actions button {
                        flex: 1;
                    }
                }
            `}</style>
        </div>
    );
}

export default NotificationPermission;
