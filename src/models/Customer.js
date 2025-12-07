// Customer data model
export class Customer {
    constructor(data = {}) {
        this.id = data.id || this.generateId();
        this.name = data.name || '';
        this.email = data.email || '';
        this.phone = data.phone || '';
        this.company = data.company || '';
        this.rut = data.rut || '';
        this.address = data.address || {
            street: '',
            commune: '',
            region: ''
        };
        this.apiKey = data.apiKey || null;
        this.apiSecret = data.apiSecret || null;
        this.webhookUrl = data.webhookUrl || null;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.totalOrders = data.totalOrders || 0;
        this.totalSpent = data.totalSpent || 0;
    }

    generateId() {
        return `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate API credentials
    generateApiCredentials() {
        this.apiKey = `ek_${this.generateRandomString(32)}`;
        this.apiSecret = `es_${this.generateRandomString(48)}`;
        return {
            apiKey: this.apiKey,
            apiSecret: this.apiSecret
        };
    }

    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Verify API key
    verifyApiKey(apiKey) {
        return this.apiKey === apiKey && this.isActive;
    }

    // Update webhook URL
    setWebhookUrl(url) {
        this.webhookUrl = url;
    }

    // Increment order count
    addOrder(orderCost) {
        this.totalOrders += 1;
        this.totalSpent += orderCost;
    }

    // Convert to JSON (excluding sensitive data)
    toJSON(includeSensitive = false) {
        const data = {
            id: this.id,
            name: this.name,
            email: this.email,
            phone: this.phone,
            company: this.company,
            rut: this.rut,
            address: this.address,
            createdAt: this.createdAt,
            isActive: this.isActive,
            totalOrders: this.totalOrders,
            totalSpent: this.totalSpent,
            webhookUrl: this.webhookUrl
        };

        if (includeSensitive) {
            data.apiKey = this.apiKey;
            data.apiSecret = this.apiSecret;
        }

        return data;
    }
}

export default Customer;
