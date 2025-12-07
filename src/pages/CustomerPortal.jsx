import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { getDemoCustomer } from '../api/mockApi';
import OrderCreationForm from '../components/OrderCreationForm';
import Footer from '../components/Footer';

function CustomerPortal() {
    const { user, login, isAuthenticated } = useAuth();
    const { orders, createOrder, fetchOrders, isLoading } = useOrders();
    const [activeTab, setActiveTab] = useState('orders');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [apiCredentials, setApiCredentials] = useState(null);

    // Auto-login with demo customer for testing
    useEffect(() => {
        if (!isAuthenticated) {
            const demoCustomer = getDemoCustomer();
            login(demoCustomer.email, 'demo', 'customer');
            setApiCredentials({
                apiKey: demoCustomer.apiKey,
                apiSecret: demoCustomer.apiSecret
            });
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const handleCreateOrder = async (orderData) => {
        const result = await createOrder(orderData);
        if (result.success) {
            setShowCreateForm(false);
            setActiveTab('orders');
        }
    };

    const getStatusBadge = (status) => {
        const statusInfo = {
            pending: { label: 'Pendiente', class: 'badge-warning' },
            assigned: { label: 'Asignado', class: 'badge-info' },
            picked_up: { label: 'Recogido', class: 'badge-primary' },
            in_transit: { label: 'En Tránsito', class: 'badge-electric' },
            delivered: { label: 'Entregado', class: 'badge-success' },
            cancelled: { label: 'Cancelado', class: 'badge-error' }
        };
        const info = statusInfo[status] || statusInfo.pending;
        return <span className={`badge ${info.class}`}>{info.label}</span>;
    };

    return (
        <div className="customer-portal-page">
            <header className="portal-header">
                <div className="container">
                    <Link to="/" className="logo-link">
                        <h2 className="logo">
                            <span className="text-gradient">EcoFleet</span> Cliente
                        </h2>
                    </Link>
                    <nav className="portal-nav">
                        <Link to="/" className="nav-link">Inicio</Link>
                        <span className="nav-user">👤 {user?.name || 'Cliente'}</span>
                    </nav>
                </div>
            </header>

            <section className="portal-section">
                <div className="container">
                    <div className="portal-welcome">
                        <h1 className="welcome-title">Portal de Cliente</h1>
                        <p className="welcome-subtitle">
                            Gestiona tus entregas ecológicas de forma simple y eficiente
                        </p>
                    </div>

                    <div className="portal-tabs">
                        <button
                            className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            📦 Mis Órdenes
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                            onClick={() => setActiveTab('create')}
                        >
                            ➕ Nueva Orden
                        </button>
                        <button
                            className={`tab-button ${activeTab === 'api' ? 'active' : ''}`}
                            onClick={() => setActiveTab('api')}
                        >
                            🔑 API
                        </button>
                    </div>

                    <div className="portal-content">
                        {activeTab === 'orders' && (
                            <div className="orders-tab">
                                <div className="tab-header">
                                    <h2>Mis Órdenes</h2>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setActiveTab('create')}
                                    >
                                        + Nueva Orden
                                    </button>
                                </div>

                                {isLoading ? (
                                    <div className="loading-state">Cargando órdenes...</div>
                                ) : orders.length === 0 ? (
                                    <div className="empty-state card">
                                        <div className="empty-icon">📦</div>
                                        <h3>No tienes órdenes aún</h3>
                                        <p>Crea tu primera orden para comenzar</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setActiveTab('create')}
                                        >
                                            Crear Primera Orden
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-grid">
                                        {orders.map(order => (
                                            <div key={order.id} className="order-card card">
                                                <div className="order-header">
                                                    <div>
                                                        <div className="order-id">#{order.trackingNumber}</div>
                                                        <div className="order-date">
                                                            {new Date(order.createdAt).toLocaleDateString('es-CL')}
                                                        </div>
                                                    </div>
                                                    {getStatusBadge(order.status)}
                                                </div>

                                                <div className="order-body">
                                                    <div className="address-info">
                                                        <div className="address-item">
                                                            <span className="address-label">📍 Recogida:</span>
                                                            <span className="address-text">
                                                                {order.pickupAddress.commune}, {order.pickupAddress.region}
                                                            </span>
                                                        </div>
                                                        <div className="address-item">
                                                            <span className="address-label">🎯 Entrega:</span>
                                                            <span className="address-text">
                                                                {order.deliveryAddress.commune}, {order.deliveryAddress.region}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {order.driverName && (
                                                        <div className="driver-info">
                                                            <span className="driver-icon">👤</span>
                                                            <span>Conductor: {order.driverName}</span>
                                                        </div>
                                                    )}

                                                    <div className="order-footer">
                                                        <span className="order-cost">
                                                            ${order.cost.toLocaleString('es-CL')}
                                                        </span>
                                                        <button className="btn btn-outline btn-sm">
                                                            Ver Detalles
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'create' && (
                            <div className="create-tab">
                                <div className="tab-header">
                                    <h2>Crear Nueva Orden</h2>
                                </div>
                                <OrderCreationForm
                                    onSubmit={handleCreateOrder}
                                    onCancel={() => setActiveTab('orders')}
                                />
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="api-tab">
                                <div className="tab-header">
                                    <h2>Integración API</h2>
                                </div>

                                <div className="api-section card">
                                    <h3>Credenciales API</h3>
                                    <p className="api-description">
                                        Usa estas credenciales para integrar EcoFleet con tu sistema ERP
                                    </p>

                                    {apiCredentials && (
                                        <div className="credentials-box">
                                            <div className="credential-item">
                                                <label>API Key:</label>
                                                <code className="credential-value">{apiCredentials.apiKey}</code>
                                            </div>
                                            <div className="credential-item">
                                                <label>API Secret:</label>
                                                <code className="credential-value">{apiCredentials.apiSecret}</code>
                                            </div>
                                        </div>
                                    )}

                                    <div className="api-warning">
                                        <strong>⚠️ Importante:</strong> Mantén estas credenciales seguras. No las compartas públicamente.
                                    </div>
                                </div>

                                <div className="api-section card">
                                    <h3>Ejemplo de Uso</h3>
                                    <p>Crear una orden mediante API:</p>

                                    <pre className="code-block">
                                        {`curl -X POST https://api.ecofleet.cl/v1/orders \\
  -H "Authorization: Bearer ${apiCredentials?.apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "pickupAddress": {
      "street": "Av. Providencia 123",
      "commune": "Providencia",
      "region": "Región Metropolitana de Santiago"
    },
    "deliveryAddress": {
      "street": "Av. Apoquindo 456",
      "commune": "Las Condes",
      "region": "Región Metropolitana de Santiago"
    },
    "package": {
      "weight": 2.5,
      "type": "standard",
      "description": "Documentos"
    }
  }'`}
                                    </pre>
                                </div>

                                <div className="api-section card">
                                    <h3>Documentación Completa</h3>
                                    <p>
                                        Consulta la documentación completa de la API para más detalles sobre endpoints,
                                        autenticación, webhooks y ejemplos de integración.
                                    </p>
                                    <Link to="/api-docs" className="btn btn-primary">
                                        Ver Documentación API
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .customer-portal-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }

        .portal-header {
          background: white;
          padding: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .portal-header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-link {
          text-decoration: none;
        }

        .logo {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          margin: 0;
        }

        .portal-nav {
          display: flex;
          gap: var(--space-6);
          align-items: center;
        }

        .nav-link {
          color: var(--color-gray-600);
          font-weight: 600;
          transition: color var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--color-primary-600);
        }

        .nav-user {
          color: var(--color-gray-700);
          font-weight: 600;
        }

        .portal-section {
          padding: var(--space-16) 0;
        }

        .portal-welcome {
          margin-bottom: var(--space-12);
        }

        .welcome-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-3);
        }

        .welcome-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-gray-600);
        }

        .portal-tabs {
          display: flex;
          gap: var(--space-2);
          margin-bottom: var(--space-8);
          border-bottom: 2px solid var(--color-gray-200);
        }

        .tab-button {
          padding: var(--space-4) var(--space-6);
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: var(--font-size-base);
          font-weight: 600;
          color: var(--color-gray-600);
          cursor: pointer;
          transition: all var(--transition-fast);
          margin-bottom: -2px;
        }

        .tab-button:hover {
          color: var(--color-primary-600);
        }

        .tab-button.active {
          color: var(--color-primary-700);
          border-bottom-color: var(--color-primary-600);
        }

        .portal-content {
          min-height: 400px;
        }

        .tab-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-8);
        }

        .tab-header h2 {
          font-size: var(--font-size-2xl);
          margin: 0;
        }

        .loading-state {
          text-align: center;
          padding: var(--space-12);
          color: var(--color-gray-600);
        }

        .empty-state {
          text-align: center;
          padding: var(--space-12);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: var(--space-4);
        }

        .empty-state h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-2);
        }

        .empty-state p {
          color: var(--color-gray-600);
          margin-bottom: var(--space-6);
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: var(--space-6);
        }

        .order-card {
          padding: 0;
          overflow: hidden;
        }

        .order-header {
          padding: var(--space-5);
          background: var(--color-gray-50);
          border-bottom: 1px solid var(--color-gray-200);
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .order-id {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-gray-900);
        }

        .order-date {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          margin-top: var(--space-1);
        }

        .order-body {
          padding: var(--space-5);
        }

        .address-info {
          margin-bottom: var(--space-4);
        }

        .address-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          margin-bottom: var(--space-3);
        }

        .address-label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-700);
        }

        .address-text {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
        }

        .driver-info {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--color-primary-50);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-4);
        }

        .driver-icon {
          font-size: var(--font-size-lg);
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-gray-200);
        }

        .order-cost {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-primary-700);
        }

        .api-section {
          margin-bottom: var(--space-8);
          padding: var(--space-6);
        }

        .api-section h3 {
          font-size: var(--font-size-xl);
          margin-bottom: var(--space-4);
        }

        .api-description {
          color: var(--color-gray-600);
          margin-bottom: var(--space-6);
        }

        .credentials-box {
          background: var(--color-gray-50);
          padding: var(--space-5);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-4);
        }

        .credential-item {
          margin-bottom: var(--space-4);
        }

        .credential-item:last-child {
          margin-bottom: 0;
        }

        .credential-item label {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-700);
          margin-bottom: var(--space-2);
        }

        .credential-value {
          display: block;
          padding: var(--space-3);
          background: white;
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-family: 'Courier New', monospace;
          font-size: var(--font-size-sm);
          color: var(--color-primary-700);
          word-break: break-all;
        }

        .api-warning {
          padding: var(--space-4);
          background: var(--color-accent-50);
          border-left: 4px solid var(--color-accent-500);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
        }

        .code-block {
          background: var(--color-gray-900);
          color: #a9dc76;
          padding: var(--space-5);
          border-radius: var(--radius-md);
          overflow-x: auto;
          font-size: var(--font-size-sm);
          line-height: 1.6;
          margin: var(--space-4) 0;
        }

        @media (max-width: 768px) {
          .portal-section {
            padding: var(--space-8) 0;
          }

          .welcome-title {
            font-size: var(--font-size-3xl);
          }

          .portal-tabs {
            overflow-x: auto;
          }

          .orders-grid {
            grid-template-columns: 1fr;
          }

          .portal-nav {
            display: none;
          }
        }
      `}</style>
        </div>
    );
}

export default CustomerPortal;
