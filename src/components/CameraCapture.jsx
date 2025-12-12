import { useState, useRef, useEffect } from 'react';
import { StorageService } from '../services/StorageService';

/**
 * Camera Capture Component
 * Allows drivers to capture photos for proof of delivery
 */
function CameraCapture({ onCapture, onClose }) {
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use back camera on mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Error accessing camera:', err);
            setError('No se pudo acceder a la cámara. Verifica los permisos.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert to blob
        canvas.toBlob((blob) => {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage({ url: imageUrl, blob });
            stopCamera();
        }, 'image/jpeg', 0.9);
    };

    const retake = () => {
        if (capturedImage) {
            URL.revokeObjectURL(capturedImage.url);
        }
        setCapturedImage(null);
        startCamera();
    };

    const confirmCapture = async () => {
        if (!capturedImage) return;

        setIsUploading(true);
        try {
            // Create a File object from the blob
            const file = new File(
                [capturedImage.blob],
                `delivery-proof-${Date.now()}.jpg`,
                { type: 'image/jpeg' }
            );

            // Upload to storage
            const { url, error: uploadError } = await StorageService.uploadFile(
                file,
                'delivery-proofs',
                `proof-${Date.now()}`
            );

            if (uploadError) {
                throw new Error(uploadError);
            }

            // Call parent callback with the uploaded URL
            if (onCapture) {
                onCapture(url);
            }

            // Clean up
            URL.revokeObjectURL(capturedImage.url);
            if (onClose) {
                onClose();
            }
        } catch (err) {
            console.error('Error uploading photo:', err);
            setError('Error al subir la foto. Intenta nuevamente.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        if (capturedImage) {
            URL.revokeObjectURL(capturedImage.url);
        }
        stopCamera();
        if (onClose) {
            onClose();
        }
    };

    return (
        <div className="camera-capture-modal">
            <div className="camera-container">
                <div className="camera-header">
                    <h3>📸 Capturar Foto de Entrega</h3>
                    <button onClick={handleClose} className="btn-close">✕</button>
                </div>

                {error && (
                    <div className="camera-error">
                        <p>{error}</p>
                    </div>
                )}

                <div className="camera-viewport">
                    {!capturedImage ? (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="camera-video"
                        />
                    ) : (
                        <img
                            src={capturedImage.url}
                            alt="Captured"
                            className="camera-preview"
                        />
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                <div className="camera-controls">
                    {!capturedImage ? (
                        <button
                            onClick={capturePhoto}
                            className="btn btn-primary btn-capture"
                            disabled={!stream}
                        >
                            📷 Capturar
                        </button>
                    ) : (
                        <div className="camera-actions">
                            <button
                                onClick={retake}
                                className="btn btn-outline"
                                disabled={isUploading}
                            >
                                🔄 Repetir
                            </button>
                            <button
                                onClick={confirmCapture}
                                className="btn btn-success"
                                disabled={isUploading}
                            >
                                {isUploading ? 'Subiendo...' : '✓ Confirmar'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .camera-capture-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.95);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: var(--space-4);
                }

                .camera-container {
                    background: var(--color-gray-900);
                    border-radius: var(--radius-lg);
                    max-width: 600px;
                    width: 100%;
                    overflow: hidden;
                }

                .camera-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: var(--space-4);
                    background: var(--color-gray-800);
                    color: white;
                }

                .camera-header h3 {
                    margin: 0;
                    font-size: var(--font-size-lg);
                }

                .btn-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: var(--font-size-2xl);
                    cursor: pointer;
                    padding: var(--space-2);
                    line-height: 1;
                }

                .camera-error {
                    padding: var(--space-4);
                    background: var(--color-error-100);
                    color: var(--color-error-700);
                    text-align: center;
                }

                .camera-viewport {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 4 / 3;
                    background: black;
                    overflow: hidden;
                }

                .camera-video,
                .camera-preview {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .camera-controls {
                    padding: var(--space-6);
                    background: var(--color-gray-800);
                    display: flex;
                    justify-content: center;
                }

                .btn-capture {
                    font-size: var(--font-size-lg);
                    padding: var(--space-4) var(--space-8);
                    min-width: 200px;
                }

                .camera-actions {
                    display: flex;
                    gap: var(--space-4);
                    width: 100%;
                    max-width: 400px;
                }

                .camera-actions button {
                    flex: 1;
                }

                @media (max-width: 768px) {
                    .camera-capture-modal {
                        padding: 0;
                    }

                    .camera-container {
                        max-width: 100%;
                        height: 100vh;
                        border-radius: 0;
                        display: flex;
                        flex-direction: column;
                    }

                    .camera-viewport {
                        flex: 1;
                        aspect-ratio: auto;
                    }
                }
            `}</style>
        </div>
    );
}

export default CameraCapture;
