/**
 * Location Service
 * Handles geolocation tracking for the EcoFleet driver app
 */

class LocationService {
    constructor() {
        this.watchId = null;
        this.currentPosition = null;
        this.onLocationUpdate = null;
    }

    /**
     * Check if geolocation is supported
     */
    isSupported() {
        return 'geolocation' in navigator;
    }

    /**
     * Get current position once
     * @returns {Promise<GeolocationPosition>}
     */
    async getCurrentPosition() {
        if (!this.isSupported()) {
            throw new Error('Geolocation is not supported in this browser');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.currentPosition = position;
                    resolve(position);
                },
                (error) => {
                    reject(this.handleError(error));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    /**
     * Start watching position changes
     * @param {Function} callback - Called when position updates
     */
    startTracking(callback) {
        if (!this.isSupported()) {
            throw new Error('Geolocation is not supported in this browser');
        }

        if (this.watchId !== null) {
            console.warn('Already tracking location');
            return;
        }

        this.onLocationUpdate = callback;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = position;
                if (this.onLocationUpdate) {
                    this.onLocationUpdate(position);
                }
            },
            (error) => {
                console.error('Location tracking error:', this.handleError(error));
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        console.log('Started location tracking');
    }

    /**
     * Stop watching position changes
     */
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            this.onLocationUpdate = null;
            console.log('Stopped location tracking');
        }
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * @param {number} lat1 - Latitude of first point
     * @param {number} lon1 - Longitude of first point
     * @param {number} lat2 - Latitude of second point
     * @param {number} lon2 - Longitude of second point
     * @returns {number} Distance in kilometers
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 100) / 100;
    }

    /**
     * Convert degrees to radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Get distance to destination
     * @param {Object} destination - Destination with lat/lng
     * @returns {number|null} Distance in km or null if no current position
     */
    getDistanceToDestination(destination) {
        if (!this.currentPosition || !destination) {
            return null;
        }

        return this.calculateDistance(
            this.currentPosition.coords.latitude,
            this.currentPosition.coords.longitude,
            destination.lat,
            destination.lng
        );
    }

    /**
     * Estimate time to arrival
     * @param {number} distance - Distance in km
     * @param {number} averageSpeed - Average speed in km/h (default: 30)
     * @returns {number} Time in minutes
     */
    estimateTimeToArrival(distance, averageSpeed = 30) {
        if (!distance) return null;
        const hours = distance / averageSpeed;
        return Math.round(hours * 60);
    }

    /**
     * Handle geolocation errors
     */
    handleError(error) {
        const errors = {
            1: 'Permiso de ubicación denegado. Por favor, habilita el acceso a la ubicación en la configuración.',
            2: 'No se pudo obtener la ubicación. Verifica tu conexión GPS.',
            3: 'Tiempo de espera agotado al obtener la ubicación.'
        };

        return new Error(errors[error.code] || 'Error desconocido al obtener la ubicación');
    }

    /**
     * Request location permission
     */
    async requestPermission() {
        try {
            await this.getCurrentPosition();
            return 'granted';
        } catch (error) {
            if (error.message.includes('denegado')) {
                return 'denied';
            }
            throw error;
        }
    }

    /**
     * Get formatted address from coordinates (requires geocoding API)
     * This is a placeholder - implement with Google Maps or similar
     */
    async getAddressFromCoordinates(lat, lng) {
        // TODO: Implement with geocoding service
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

// Export singleton instance
export default new LocationService();
