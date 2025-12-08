import { Order } from '../models/Order';
import { Customer } from '../models/Customer';
import Driver from '../models/Driver';
import { findBestDriver, assignDriverToOrder } from '../services/driverAssignment';

// Mock database
let orders = [];
let customers = [];
let drivers = [
    new Driver({
        id: 'DRV-001',
        name: 'Carlos Muñoz',
        email: 'carlos.munoz@ecofleet.cl',
        phone: '+56 9 8765 4321',
        status: 'available',
        currentLocation: {
            lat: -33.4489,
            lng: -70.6693, // Santiago Centro
            lastUpdated: new Date().toISOString()
        },
        vehicle: {
            type: 'scooter',
            maxWeight: 30,
            maxVolume: 100,
            licensePlate: 'ABCD12',
            brand: 'Honda',
            model: 'PCX 150'
        },
        activeOrders: 0,
        maxConcurrentOrders: 3,
        rating: 4.8,
        totalDeliveries: 145
    }),
    new Driver({
        id: 'DRV-002',
        name: 'María González',
        email: 'maria.gonzalez@ecofleet.cl',
        phone: '+56 9 7654 3210',
        status: 'available',
        currentLocation: {
            lat: -33.4372,
            lng: -70.6506, // Providencia
            lastUpdated: new Date().toISOString()
        },
        vehicle: {
            type: 'bicycle',
            maxWeight: 15,
            maxVolume: 50,
            licensePlate: 'N/A',
            brand: 'Trek',
            model: 'FX 3'
        },
        activeOrders: 0,
        maxConcurrentOrders: 2,
        rating: 4.9,
        totalDeliveries: 89
    }),
    new Driver({
        id: 'DRV-003',
        name: 'Roberto Silva',
        email: 'roberto.silva@ecofleet.cl',
        phone: '+56 9 6543 2109',
        status: 'available',
        currentLocation: {
            lat: -33.4569,
            lng: -70.6483, // Las Condes
            lastUpdated: new Date().toISOString()
        },
        vehicle: {
            type: 'van',
            maxWeight: 500,
            maxVolume: 3000,
            licensePlate: 'WXYZ99',
            brand: 'Nissan',
            model: 'e-NV200'
        },
        activeOrders: 0,
        maxConcurrentOrders: 5,
        rating: 4.7,
        totalDeliveries: 234
    }),
    new Driver({
        id: 'DRV-004',
        name: 'Ana Martínez',
        email: 'ana.martinez@ecofleet.cl',
        phone: '+56 9 5432 1098',
        status: 'busy',
        currentLocation: {
            lat: -33.4250,
            lng: -70.6100, // Vitacura
            lastUpdated: new Date().toISOString()
        },
        vehicle: {
            type: 'motorcycle',
            maxWeight: 50,
            maxVolume: 150,
            licensePlate: 'MOTO88',
            brand: 'Zero',
            model: 'SR/F'
        },
        activeOrders: 2,
        maxConcurrentOrders: 3,
        rating: 5.0,
        totalDeliveries: 312
    })
];

// Initialize with demo customer
const demoCustomer = new Customer({
    name: 'Empresa Demo',
    email: 'demo@empresa.cl',
    phone: '+56 9 8888 8888',
    company: 'Demo Corp',
    rut: '76.123.456-7'
});
demoCustomer.generateApiCredentials();
customers.push(demoCustomer);

// Simulate network delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API implementation
export const mockApi = {
    // Authentication
    auth: {
        async login(email, password) {
            await delay();
            const customer = customers.find(c => c.email === email);
            if (customer) {
                return {
                    success: true,
                    data: {
                        user: customer.toJSON(),
                        token: `token_${Date.now()}`
                    }
                };
            }
            return {
                success: false,
                error: 'Credenciales inválidas'
            };
        },

        async register(customerData) {
            await delay();
            const customer = new Customer(customerData);
            customer.generateApiCredentials();
            customers.push(customer);
            return {
                success: true,
                data: {
                    user: customer.toJSON(true),
                    token: `token_${Date.now()}`
                }
            };
        },

        async generateApiKey(customerId) {
            await delay();
            const customer = customers.find(c => c.id === customerId);
            if (customer) {
                const credentials = customer.generateApiCredentials();
                return {
                    success: true,
                    data: credentials
                };
            }
            return {
                success: false,
                error: 'Cliente no encontrado'
            };
        },

        async verifyApiKey(apiKey) {
            await delay();
            const customer = customers.find(c => c.verifyApiKey(apiKey));
            if (customer) {
                return {
                    success: true,
                    data: { customerId: customer.id }
                };
            }
            return {
                success: false,
                error: 'API key inválida'
            };
        }
    },

    // Orders
    orders: {
        async create(orderData, apiKey = null) {
            await delay();

            // Verify API key if provided
            if (apiKey) {
                const authResult = await mockApi.auth.verifyApiKey(apiKey);
                if (!authResult.success) {
                    return authResult;
                }
                orderData.customerId = authResult.data.customerId;
            }

            const order = new Order(orderData);

            // Calculate distance (simplified)
            order.distance = Math.random() * 20 + 2; // 2-22 km
            order.calculateCost();

            orders.push(order);

            // Attempt automatic driver assignment
            const assignmentResult = findBestDriver(order, drivers);

            if (assignmentResult.success) {
                // Assign the best driver
                assignDriverToOrder(order, assignmentResult.driver, assignmentResult.distance);
                console.log(`[AUTO-ASSIGN] Order ${order.id} assigned to ${assignmentResult.driver.name} (${assignmentResult.distance}km away)`);
            } else {
                console.log(`[AUTO-ASSIGN] Failed for order ${order.id}: ${assignmentResult.reason}`);
                // Order remains in 'pending' status for manual assignment
            }

            // Update customer stats
            const customer = customers.find(c => c.id === order.customerId);
            if (customer) {
                customer.addOrder(order.cost);
            }

            // Simulate webhook notification
            if (customer && customer.webhookUrl) {
                this.sendWebhook(customer.webhookUrl, {
                    event: 'order.created',
                    order: order.toJSON(),
                    assignment: assignmentResult.success ? {
                        method: 'auto',
                        driver: assignmentResult.driver.name,
                        distance: assignmentResult.distance
                    } : {
                        method: 'pending',
                        reason: assignmentResult.reason
                    }
                });
            }

            return {
                success: true,
                data: order.toJSON()
            };
        },

        async getAll(filters = {}) {
            await delay();
            let filteredOrders = [...orders];

            if (filters.customerId) {
                filteredOrders = filteredOrders.filter(o => o.customerId === filters.customerId);
            }
            if (filters.driverId) {
                filteredOrders = filteredOrders.filter(o => o.driverId === filters.driverId);
            }
            if (filters.status) {
                filteredOrders = filteredOrders.filter(o => o.status === filters.status);
            }

            return {
                success: true,
                data: filteredOrders.map(o => o.toJSON())
            };
        },

        async getById(orderId) {
            await delay();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                return {
                    success: true,
                    data: order.toJSON()
                };
            }
            return {
                success: false,
                error: 'Orden no encontrada'
            };
        },

        async update(orderId, updates) {
            await delay();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                Object.assign(order, updates);

                // Send webhook notification
                const customer = customers.find(c => c.id === order.customerId);
                if (customer && customer.webhookUrl) {
                    this.sendWebhook(customer.webhookUrl, {
                        event: 'order.updated',
                        order: order.toJSON()
                    });
                }

                return {
                    success: true,
                    data: order.toJSON()
                };
            }
            return {
                success: false,
                error: 'Orden no encontrada'
            };
        },

        async updateStatus(orderId, newStatus) {
            await delay();
            const order = orders.find(o => o.id === orderId);
            if (order) {
                order.updateStatus(newStatus);

                // Send webhook notification
                const customer = customers.find(c => c.id === order.customerId);
                if (customer && customer.webhookUrl) {
                    this.sendWebhook(customer.webhookUrl, {
                        event: 'order.status_changed',
                        order: order.toJSON(),
                        previousStatus: order.status,
                        newStatus: newStatus
                    });
                }

                return {
                    success: true,
                    data: order.toJSON()
                };
            }
            return {
                success: false,
                error: 'Orden no encontrada'
            };
        },

        async assignDriver(orderId, driverId) {
            await delay();
            const order = orders.find(o => o.id === orderId);
            const driver = drivers.find(d => d.id === driverId);

            if (!order) {
                return {
                    success: false,
                    error: 'Orden no encontrada'
                };
            }

            if (!driver) {
                return {
                    success: false,
                    error: 'Conductor no encontrado'
                };
            }

            if (order.assignDriver(driverId, driver.name)) {
                driver.status = 'busy';

                // Send webhook notification
                const customer = customers.find(c => c.id === order.customerId);
                if (customer && customer.webhookUrl) {
                    this.sendWebhook(customer.webhookUrl, {
                        event: 'order.assigned',
                        order: order.toJSON()
                    });
                }

                return {
                    success: true,
                    data: order.toJSON()
                };
            }

            return {
                success: false,
                error: 'No se pudo asignar el conductor'
            };
        },

        async cancel(orderId) {
            await delay();
            const order = orders.find(o => o.id === orderId);
            if (order && order.status !== 'delivered') {
                order.updateStatus('cancelled');

                // Free up driver if assigned
                if (order.driverId) {
                    const driver = drivers.find(d => d.id === order.driverId);
                    if (driver) {
                        driver.status = 'available';
                    }
                }

                return {
                    success: true,
                    data: order.toJSON()
                };
            }
            return {
                success: false,
                error: 'No se puede cancelar esta orden'
            };
        },

        // Simulate webhook call
        sendWebhook(url, payload) {
            console.log(`[WEBHOOK] Sending to ${url}:`, payload);
            // In production, this would make an actual HTTP POST request
        }
    },

    // Drivers
    drivers: {
        async getAvailable() {
            await delay();
            const availableDrivers = drivers.filter(d => d.status === 'available');
            return {
                success: true,
                data: availableDrivers
            };
        },

        async getAll() {
            await delay();
            return {
                success: true,
                data: drivers
            };
        },

        async updateStatus(driverId, status) {
            await delay();
            const driver = drivers.find(d => d.id === driverId);
            if (driver) {
                driver.status = status;
                return {
                    success: true,
                    data: driver
                };
            }
            return {
                success: false,
                error: 'Conductor no encontrado'
            };
        }
    },

    // Customers
    customers: {
        async getById(customerId) {
            await delay();
            const customer = customers.find(c => c.id === customerId);
            if (customer) {
                return {
                    success: true,
                    data: customer.toJSON()
                };
            }
            return {
                success: false,
                error: 'Cliente no encontrado'
            };
        },

        async updateWebhook(customerId, webhookUrl) {
            await delay();
            const customer = customers.find(c => c.id === customerId);
            if (customer) {
                customer.setWebhookUrl(webhookUrl);
                return {
                    success: true,
                    data: customer.toJSON()
                };
            }
            return {
                success: false,
                error: 'Cliente no encontrado'
            };
        }
    },

    // Statistics
    stats: {
        async getOverview() {
            await delay();
            return {
                success: true,
                data: {
                    totalOrders: orders.length,
                    pendingOrders: orders.filter(o => o.status === 'pending').length,
                    inTransitOrders: orders.filter(o => o.status === 'in_transit').length,
                    deliveredOrders: orders.filter(o => o.status === 'delivered').length,
                    totalRevenue: orders.reduce((sum, o) => sum + o.cost, 0),
                    activeDrivers: drivers.filter(d => d.status === 'busy').length,
                    availableDrivers: drivers.filter(d => d.status === 'available').length
                }
            };
        }
    }
};

// Export demo customer for testing
export const getDemoCustomer = () => demoCustomer.toJSON(true);

export default mockApi;
