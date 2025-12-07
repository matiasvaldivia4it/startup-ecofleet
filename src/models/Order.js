// Order data model
export class Order {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.customerId = data.customerId || '';
        this.customerName = data.customerName || '';
        this.customerEmail = data.customerEmail || '';
        this.pickupAddress = data.pickupAddress || {
            street: '',
            commune: '',
            region: '',
            coordinates: { lat: -33.4489, lng: -70.6693 } // Default Santiago
        };
        this.deliveryAddress = data.deliveryAddress || {
            street: '',
            commune: '',
            region: '',
            coordinates: { lat: -33.4489, lng: -70.6693 }
        };
        this.package = data.package || {
            weight: 0,
            dimensions: { length: 0, width: 0, height: 0 },
            type: 'standard',
            fragile: false,
            description: ''
        };
        this.status = data.status || 'pending';
        this.driverId = data.driverId || null;
        this.driverName = data.driverName || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.scheduledFor = data.scheduledFor || null;
        this.pickedUpAt = data.pickedUpAt || null;
        this.deliveredAt = data.deliveredAt || null;
        this.cost = data.cost || 0;
        this.distance = data.distance || 0;
        this.specialInstructions = data.specialInstructions || '';
        this.trackingNumber = data.trackingNumber || this.generateTrackingNumber();
    }

    generateId() {
        return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    generateTrackingNumber() {
        return `ECO${Date.now().toString().slice(-8)}`;
    }

    // Calculate cost based on distance and package weight
    calculateCost() {
        const baseCost = 2500; // CLP
        const distanceCost = this.distance * 150; // CLP per km
        const weightCost = this.package.weight * 100; // CLP per kg
        const fragileFee = this.package.fragile ? 1000 : 0;

        this.cost = Math.round(baseCost + distanceCost + weightCost + fragileFee);
        return this.cost;
    }

    // Get status display info
    getStatusInfo() {
        const statusMap = {
            pending: { label: 'Pendiente', color: 'warning', icon: '⏳' },
            assigned: { label: 'Asignado', color: 'info', icon: '👤' },
            picked_up: { label: 'Recogido', color: 'primary', icon: '📦' },
            in_transit: { label: 'En Tránsito', color: 'electric', icon: '🚗' },
            delivered: { label: 'Entregado', color: 'success', icon: '✅' },
            cancelled: { label: 'Cancelado', color: 'error', icon: '❌' }
        };
        return statusMap[this.status] || statusMap.pending;
    }

    // Update status with timestamp
    updateStatus(newStatus) {
        this.status = newStatus;

        if (newStatus === 'picked_up') {
            this.pickedUpAt = new Date().toISOString();
        } else if (newStatus === 'delivered') {
            this.deliveredAt = new Date().toISOString();
        }
    }

    // Check if order can be assigned to driver
    canAssign() {
        return this.status === 'pending' && !this.driverId;
    }

    // Assign to driver
    assignDriver(driverId, driverName) {
        if (this.canAssign()) {
            this.driverId = driverId;
            this.driverName = driverName;
            this.status = 'assigned';
            return true;
        }
        return false;
    }

    // Get formatted address
    getFormattedAddress(type = 'pickup') {
        const address = type === 'pickup' ? this.pickupAddress : this.deliveryAddress;
        return `${address.street}, ${address.commune}, ${address.region}`;
    }

    // Convert to JSON
    toJSON() {
        return {
            id: this.id,
            customerId: this.customerId,
            customerName: this.customerName,
            customerEmail: this.customerEmail,
            pickupAddress: this.pickupAddress,
            deliveryAddress: this.deliveryAddress,
            package: this.package,
            status: this.status,
            driverId: this.driverId,
            driverName: this.driverName,
            createdAt: this.createdAt,
            scheduledFor: this.scheduledFor,
            pickedUpAt: this.pickedUpAt,
            deliveredAt: this.deliveredAt,
            cost: this.cost,
            distance: this.distance,
            specialInstructions: this.specialInstructions,
            trackingNumber: this.trackingNumber
        };
    }
}

export default Order;
