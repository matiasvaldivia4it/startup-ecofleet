import { createContext, useContext, useState, useEffect } from 'react';
import { mockApi } from '../api/mockApi';
import { useAuth } from './AuthContext';

const OrderContext = createContext(null);

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrders must be used within an OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const { user, userType } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders based on user type
    const fetchOrders = async (filters = {}) => {
        setIsLoading(true);
        setError(null);

        try {
            let result;

            if (userType === 'customer' && user) {
                result = await mockApi.orders.getAll({ ...filters, customerId: user.id });
            } else if (userType === 'driver' && user) {
                result = await mockApi.orders.getAll({ ...filters, driverId: user.id });
            } else if (userType === 'admin') {
                result = await mockApi.orders.getAll(filters);
            } else {
                result = await mockApi.orders.getAll(filters);
            }

            if (result.success) {
                setOrders(result.data);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al cargar órdenes');
            return { success: false, error: 'Error al cargar órdenes' };
        } finally {
            setIsLoading(false);
        }
    };

    // Create new order
    const createOrder = async (orderData) => {
        setIsLoading(true);
        setError(null);

        try {
            // Add customer info if logged in
            if (user && userType === 'customer') {
                orderData.customerId = user.id;
                orderData.customerName = user.name;
                orderData.customerEmail = user.email;
            }

            const result = await mockApi.orders.create(orderData);

            if (result.success) {
                setOrders(prev => [result.data, ...prev]);
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al crear orden');
            return { success: false, error: 'Error al crear orden' };
        } finally {
            setIsLoading(false);
        }
    };

    // Update order
    const updateOrder = async (orderId, updates) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.orders.update(orderId, updates);

            if (result.success) {
                setOrders(prev =>
                    prev.map(order => (order.id === orderId ? result.data : order))
                );
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al actualizar orden');
            return { success: false, error: 'Error al actualizar orden' };
        } finally {
            setIsLoading(false);
        }
    };

    // Update order status
    const updateOrderStatus = async (orderId, newStatus) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.orders.updateStatus(orderId, newStatus);

            if (result.success) {
                setOrders(prev =>
                    prev.map(order => (order.id === orderId ? result.data : order))
                );
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al actualizar estado');
            return { success: false, error: 'Error al actualizar estado' };
        } finally {
            setIsLoading(false);
        }
    };

    // Assign driver to order
    const assignDriver = async (orderId, driverId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.orders.assignDriver(orderId, driverId);

            if (result.success) {
                setOrders(prev =>
                    prev.map(order => (order.id === orderId ? result.data : order))
                );
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al asignar conductor');
            return { success: false, error: 'Error al asignar conductor' };
        } finally {
            setIsLoading(false);
        }
    };

    // Cancel order
    const cancelOrder = async (orderId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.orders.cancel(orderId);

            if (result.success) {
                setOrders(prev =>
                    prev.map(order => (order.id === orderId ? result.data : order))
                );
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al cancelar orden');
            return { success: false, error: 'Error al cancelar orden' };
        } finally {
            setIsLoading(false);
        }
    };

    // Get order by ID
    const getOrderById = async (orderId) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await mockApi.orders.getById(orderId);

            if (result.success) {
                return { success: true, data: result.data };
            } else {
                setError(result.error);
                return { success: false, error: result.error };
            }
        } catch (err) {
            setError('Error al cargar orden');
            return { success: false, error: 'Error al cargar orden' };
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-fetch orders when user changes
    useEffect(() => {
        if (user && userType) {
            fetchOrders();
        }
    }, [user, userType]);

    const value = {
        orders,
        isLoading,
        error,
        fetchOrders,
        createOrder,
        updateOrder,
        updateOrderStatus,
        assignDriver,
        cancelOrder,
        getOrderById
    };

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export default OrderContext;
