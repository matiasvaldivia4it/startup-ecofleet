/**
 * Notification Service
 * Handles push notifications for the EcoFleet driver app
 */

class NotificationService {
    constructor() {
        this.permission = 'default';
        this.registration = null;
    }

    /**
     * Check if notifications are supported
     */
    isSupported() {
        return 'Notification' in window && 'serviceWorker' in navigator;
    }

    /**
     * Get current notification permission status
     */
    getPermission() {
        if (!this.isSupported()) return 'denied';
        return Notification.permission;
    }

    /**
     * Request notification permission from user
     */
    async requestPermission() {
        if (!this.isSupported()) {
            throw new Error('Notifications are not supported in this browser');
        }

        if (this.getPermission() === 'granted') {
            return 'granted';
        }

        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission;
        } catch (error) {
            console.error('Error requesting notification permission:', error);
            throw error;
        }
    }

    /**
     * Show a local notification
     * @param {string} title - Notification title
     * @param {Object} options - Notification options
     */
    async showNotification(title, options = {}) {
        if (!this.isSupported()) {
            console.warn('Notifications not supported');
            return;
        }

        if (this.getPermission() !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        const defaultOptions = {
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            vibrate: [200, 100, 200],
            tag: 'ecofleet-notification',
            requireInteraction: false,
            ...options
        };

        try {
            if (this.registration) {
                // Use service worker to show notification
                await this.registration.showNotification(title, defaultOptions);
            } else {
                // Fallback to regular notification
                new Notification(title, defaultOptions);
            }
        } catch (error) {
            console.error('Error showing notification:', error);
        }
    }

    /**
     * Show notification for new order assignment
     * @param {Object} order - Order object
     */
    async notifyNewOrder(order) {
        await this.showNotification('Nueva Orden Asignada', {
            body: `Orden #${order.trackingNumber}\nRecogida: ${order.pickupAddress.commune}\nEntrega: ${order.deliveryAddress.commune}`,
            icon: '/pwa-192x192.png',
            badge: '/pwa-192x192.png',
            tag: `order-${order.id}`,
            data: { orderId: order.id, type: 'new_order' },
            actions: [
                { action: 'view', title: 'Ver Orden' },
                { action: 'dismiss', title: 'Cerrar' }
            ],
            requireInteraction: true
        });
    }

    /**
     * Show notification for order status change
     * @param {Object} order - Order object
     * @param {string} status - New status
     */
    async notifyOrderStatus(order, status) {
        const statusMessages = {
            accepted: 'Orden aceptada',
            picked_up: 'Paquete recogido',
            in_transit: 'En camino',
            delivered: 'Entregado exitosamente',
            cancelled: 'Orden cancelada'
        };

        const message = statusMessages[status] || 'Estado actualizado';

        await this.showNotification(`Orden #${order.trackingNumber}`, {
            body: message,
            tag: `order-status-${order.id}`,
            data: { orderId: order.id, type: 'status_change', status }
        });
    }

    /**
     * Register service worker for notifications
     */
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service workers not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            this.registration = registration;
            console.log('Service worker registered for notifications');
            return registration;
        } catch (error) {
            console.error('Service worker registration failed:', error);
            throw error;
        }
    }

    /**
     * Subscribe to push notifications (for future server push)
     */
    async subscribeToPush() {
        if (!this.registration) {
            await this.registerServiceWorker();
        }

        try {
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    // Replace with your VAPID public key when implementing server push
                    'YOUR_VAPID_PUBLIC_KEY'
                )
            });

            console.log('Push subscription:', subscription);
            // Send subscription to your server here
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push:', error);
            throw error;
        }
    }

    /**
     * Convert VAPID key to Uint8Array
     */
    urlBase64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
}

// Export singleton instance
export default new NotificationService();
