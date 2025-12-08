/**
 * Driver Model
 * Represents a delivery driver with vehicle and location information
 */

export class Driver {
    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.email = data.email;
        this.phone = data.phone;
        this.status = data.status || 'offline'; // 'available', 'busy', 'offline'
        this.currentLocation = data.currentLocation || null;
        this.vehicle = data.vehicle;
        this.activeOrders = data.activeOrders || 0;
        this.maxConcurrentOrders = data.maxConcurrentOrders || 3;
        this.rating = data.rating || 5.0;
        this.totalDeliveries = data.totalDeliveries || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    isAvailable() {
        return this.status === 'available' && this.activeOrders < this.maxConcurrentOrders;
    }

    canHandlePackage(packageData) {
        if (!this.vehicle) return false;

        const weight = packageData.weight || 0;
        const volume = this.calculatePackageVolume(packageData.dimensions);

        return (
            weight <= this.vehicle.maxWeight &&
            volume <= this.vehicle.maxVolume
        );
    }

    calculatePackageVolume(dimensions) {
        if (!dimensions) return 0;
        const { length = 0, width = 0, height = 0 } = dimensions;
        return (length * width * height) / 1000; // Convert cm³ to liters
    }

    updateLocation(lat, lng) {
        this.currentLocation = {
            lat,
            lng,
            lastUpdated: new Date().toISOString()
        };
    }

    assignOrder() {
        this.activeOrders++;
        if (this.activeOrders >= this.maxConcurrentOrders) {
            this.status = 'busy';
        }
    }

    completeOrder() {
        this.activeOrders = Math.max(0, this.activeOrders - 1);
        this.totalDeliveries++;
        if (this.activeOrders < this.maxConcurrentOrders) {
            this.status = 'available';
        }
    }
}

export default Driver;
