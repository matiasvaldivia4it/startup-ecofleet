import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import Footer from '../components/Footer';
import NotificationPermission from '../components/NotificationPermission';
import LocationTracker from '../components/LocationTracker';
import CameraCapture from '../components/CameraCapture';
import NotificationService from '../services/NotificationService';
import OfflineQueue from '../services/OfflineQueue';

function Dashboard() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [activeTab, setActiveTab] = useState('status');
  const { orders, fetchOrders, updateOrderStatus } = useOrders();
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);
  const [showCamera, setShowCamera] = useState(false);
  const [selectedOrderForPhoto, setSelectedOrderForPhoto] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queueSize, setQueueSize] = useState(0);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();

    // Initialize offline queue
    OfflineQueue.init();

    // Listen for offline/online events
    const handleQueueEvent = async (event) => {
      if (event.type === 'online' || event.type === 'offline') {
        setIsOnline(event.type === 'online');
      }
      // Update queue size
      const size = await OfflineQueue.getQueueSize();
      setQueueSize(size);
    };

    OfflineQueue.addListener(handleQueueEvent);

    return () => {
      OfflineQueue.removeListener(handleQueueEvent);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  // In a real app, this would fetch user data from backend
  const driverData = {
    name: 'Juan Pérez',
    status: 'approved', // Changed to approved so they can see orders
    applicationDate: '2025-12-06',
    profileCompletion: 100
  };

  // Filter orders assigned to this driver
  const assignedOrders = orders.filter(order =>
    order.status === 'assigned' || order.status === 'accepted' || order.status === 'in_transit'
  );

  const handleAcceptOrder = async (orderId) => {
    try {
      if (isOnline) {
        await updateOrderStatus(orderId, 'accepted');
        const order = orders.find(o => o.id === orderId);
        if (order) {
          await NotificationService.notifyOrderStatus(order, 'accepted');
        }
      } else {
        // Queue for later if offline
        await OfflineQueue.addToQueue('order_accept', { orderId }, updateOrderStatus);
      }
      alert('Orden aceptada exitosamente');
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Error al aceptar la orden');
    }
  };

  const handleDenyOrder = async (orderId) => {
    try {
      if (isOnline) {
        await updateOrderStatus(orderId, 'pending');
      } else {
        await OfflineQueue.addToQueue('order_deny', { orderId }, updateOrderStatus);
      }
      alert('Orden rechazada. Será reasignada a otro conductor.');
    } catch (error) {
      console.error('Error denying order:', error);
      alert('Error al rechazar la orden');
    }
  };

  const handleCaptureProof = (orderId) => {
    setSelectedOrderForPhoto(orderId);
    setShowCamera(true);
  };

  const handlePhotoCapture = async (photoUrl) => {
    // Update order with proof of delivery photo
    console.log('Photo captured for order:', selectedOrderForPhoto, photoUrl);
    // TODO: Update order in database with photo URL
    setShowCamera(false);
    setSelectedOrderForPhoto(null);
    alert('Foto de entrega guardada exitosamente');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pendiente de Revisión</span>;
      case 'approved':
        return <span className="badge badge-success">Aprobado</span>;
      case 'rejected':
        return <span className="badge badge-error">Rechazado</span>;
      default:
        return <span className="badge badge-info">En Proceso</span>;
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusMap = {
      pending: { label: 'Pendiente', class: 'badge-warning' },
      assigned: { label: 'Asignado', class: 'badge-info' },
      accepted: { label: 'Aceptado', class: 'badge-success' },
      picked_up: { label: 'Recogido', class: 'badge-primary' },
      in_transit: { label: 'En Tránsito', class: 'badge-info' },
      delivered: { label: 'Entregado', class: 'badge-success' },
      cancelled: { label: 'Cancelado', class: 'badge-error' }
    };
    const info = statusMap[status] || statusMap.pending;
    return <span className={`badge ${info.class}`}>{info.label}</span>;
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="container">
          <Link to="/" className="logo-link">
            <h2 className="logo">
              <span className="text-gradient">EcoFleet</span> Chile
            </h2>
          </Link>
          <nav className="dashboard-nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <Link to="/dashboard" className="nav-link active">Dashboard</Link>
            {deferredPrompt && (
              <button onClick={handleInstallClick} className="btn btn-primary btn-sm btn-install">
                📱 Instalar App
              </button>
            )}
          </nav>
        </div>
      </header>

      <section className="dashboard-section">
        <div className="container">
          <div className="dashboard-welcome">
            <h1 className="welcome-title">¡Bienvenido, {driverData.name}! 👋</h1>
            <p className="welcome-subtitle">
              {driverData.status === 'approved'
                ? 'Gestiona tus órdenes y revisa tu rendimiento'
                : 'Aquí puedes ver el estado de tu solicitud y gestionar tu perfil'}
            </p>
          </div>

          {/* Tabs */}
          <div className="portal-tabs">
            <button
              className={`tab-button ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              📋 Estado
            </button>
            <button
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Órdenes ({assignedOrders.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Perfil
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'status' && (

            <div className="dashboard-grid">
              <div className="dashboard-card card">
                <div className="card-header">
                  <h3 className="card-title">Estado de Solicitud</h3>
                  {getStatusBadge(driverData.status)}
                </div>
                <div className="card-content">
                  <div className="status-info">
                    <div className="info-item">
                      <span className="info-label">Fecha de Solicitud:</span>
                      <span className="info-value">{new Date(driverData.applicationDate).toLocaleDateString('es-CL')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Completitud del Perfil:</span>
                      <span className="info-value">{driverData.profileCompletion}%</span>
                    </div>
                  </div>

                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${driverData.profileCompletion}%` }}></div>
                  </div>

                  {driverData.status === 'pending' && (
                    <div className="status-message">
                      <p>
                        Tu solicitud está siendo revisada por nuestro equipo.
                        Te notificaremos por email cuando tengamos una respuesta.
                      </p>
                      <p className="estimated-time">
                        ⏱️ Tiempo estimado de revisión: 24-48 horas
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="dashboard-card card">
                <div className="card-header">
                  <h3 className="card-title">Próximos Pasos</h3>
                </div>
                <div className="card-content">
                  <ul className="steps-list">
                    <li className="step-item completed">
                      <span className="step-icon">✓</span>
                      <span>Completar formulario de registro</span>
                    </li>
                    <li className="step-item active">
                      <span className="step-icon">⏳</span>
                      <span>Esperar verificación de documentos</span>
                    </li>
                    <li className="step-item">
                      <span className="step-icon">○</span>
                      <span>Completar capacitación online</span>
                    </li>
                    <li className="step-item">
                      <span className="step-icon">○</span>
                      <span>Activar cuenta y comenzar a entregar</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="dashboard-card card">
                <div className="card-header">
                  <h3 className="card-title">Información del Perfil</h3>
                </div>
                <div className="card-content">
                  <div className="profile-info">
                    <div className="profile-avatar">
                      <div className="avatar-circle">
                        {driverData.name.charAt(0)}
                      </div>
                    </div>
                    <div className="profile-details">
                      <h4>{driverData.name}</h4>
                      <p>Conductor en Proceso</p>
                    </div>
                  </div>
                  <Link to="/registro-conductor" className="btn btn-outline btn-sm">
                    Editar Perfil
                  </Link>
                </div>
              </div>

              <div className="dashboard-card card">
                <div className="card-header">
                  <h3 className="card-title">Recursos Útiles</h3>
                </div>
                <div className="card-content">
                  <ul className="resources-list">
                    <li>
                      <a href="#" className="resource-link">
                        📚 Centro de Ayuda
                      </a>
                    </li>
                    <li>
                      <a href="#" className="resource-link">
                        📖 Guía del Conductor
                      </a>
                    </li>
                    <li>
                      <a href="#" className="resource-link">
                        💬 Comunidad de Conductores
                      </a>
                    </li>
                    <li>
                      <a href="#" className="resource-link">
                        📞 Soporte Técnico
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="orders-tab">
              <div className="tab-header">
                <h2>Órdenes Asignadas</h2>
                <span className="order-count">{assignedOrders.length} órdenes</span>
              </div>

              {assignedOrders.length === 0 ? (
                <div className="empty-state card">
                  <div className="empty-icon">📦</div>
                  <h3>No tienes órdenes asignadas</h3>
                  <p>Las nuevas órdenes aparecerán aquí cuando sean asignadas</p>
                </div>
              ) : (
                <div className="orders-grid">
                  {assignedOrders.map(order => (
                    <div key={order.id} className="order-card card">
                      <div className="order-header">
                        <div>
                          <div className="order-id">#{order.trackingNumber}</div>
                          <div className="order-date">
                            {new Date(order.createdAt).toLocaleDateString('es-CL')}
                          </div>
                        </div>
                        {getOrderStatusBadge(order.status)}
                      </div>

                      <div className="order-body">
                        <div className="address-info">
                          <div className="address-item">
                            <span className="address-label">📍 Recogida:</span>
                            <span className="address-text">
                              {order.pickupAddress.street}, {order.pickupAddress.commune}
                            </span>
                          </div>
                          <div className="address-item">
                            <span className="address-label">🎯 Entrega:</span>
                            <span className="address-text">
                              {order.deliveryAddress.street}, {order.deliveryAddress.commune}
                            </span>
                          </div>
                        </div>

                        <div className="package-info">
                          <span className="package-icon">📦</span>
                          <span>{order.package.weight}kg - {order.package.type}</span>
                        </div>

                        {order.estimatedDistance && (
                          <div className="distance-info">
                            <span>🛣️ Distancia estimada: {order.estimatedDistance} km</span>
                          </div>
                        )}

                        <div className="order-footer">
                          <span className="order-cost">
                            ${order.cost.toLocaleString('es-CL')}
                          </span>

                          {order.status === 'assigned' && (
                            <div className="order-actions">
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleAcceptOrder(order.id)}
                              >
                                ✓ Aceptar
                              </button>
                              <button
                                className="btn btn-outline btn-sm"
                                onClick={() => handleDenyOrder(order.id)}
                              >
                                ✗ Rechazar
                              </button>
                            </div>
                          )}

                          {order.status === 'accepted' && (
                            <button className="btn btn-primary btn-sm">
                              Iniciar Entrega
                            </button>
                          )}

                          {order.status === 'in_transit' && (
                            <div className="order-in-transit">
                              <LocationTracker
                                destination={{
                                  lat: order.deliveryAddress.lat || -33.4489,
                                  lng: order.deliveryAddress.lng || -70.6693
                                }}
                              />
                              <div className="order-actions" style={{ marginTop: 'var(--space-3)' }}>
                                <button
                                  className="btn btn-accent btn-sm"
                                  onClick={() => handleCaptureProof(order.id)}
                                >
                                  📸 Foto de Entrega
                                </button>
                                <button className="btn btn-success btn-sm">
                                  ✓ Marcar Entregado
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <div className="dashboard-grid">
                <div className="dashboard-card card">
                  <div className="card-header">
                    <h3 className="card-title">Información del Perfil</h3>
                  </div>
                  <div className="card-content">
                    <div className="profile-info">
                      <div className="profile-avatar">
                        <div className="avatar-circle">
                          {driverData.name.charAt(0)}
                        </div>
                      </div>
                      <div className="profile-details">
                        <h4>{driverData.name}</h4>
                        <p>Conductor Aprobado</p>
                      </div>
                    </div>
                    <Link to="/registro-conductor" className="btn btn-outline btn-sm">
                      Editar Perfil
                    </Link>
                  </div>
                </div>

                <div className="dashboard-card card">
                  <div className="card-header">
                    <h3 className="card-title">Recursos Útiles</h3>
                  </div>
                  <div className="card-content">
                    <ul className="resources-list">
                      <li>
                        <a href="#" className="resource-link">
                          📚 Centro de Ayuda
                        </a>
                      </li>
                      <li>
                        <a href="#" className="resource-link">
                          📖 Guía del Conductor
                        </a>
                      </li>
                      <li>
                        <a href="#" className="resource-link">
                          💬 Comunidad de Conductores
                        </a>
                      </li>
                      <li>
                        <a href="#" className="resource-link">
                          📞 Soporte Técnico
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Camera Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <style jsx>{`
        .dashboard-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .dashboard-header {
          background: white;
          padding: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .dashboard-header .container {
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
        
        .dashboard-nav {
          display: flex;
          gap: var(--space-6);
        }
        
        .nav-link {
          color: var(--color-gray-600);
          font-weight: 600;
          transition: color var(--transition-fast);
        }
        
        .nav-link:hover,
        .nav-link.active {
          color: var(--color-primary-600);
        }
        
        .dashboard-section {
          padding: var(--space-16) 0;
        }
        
        .dashboard-welcome {
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
        
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-8);
        }
        
        .dashboard-card {
          padding: 0;
          overflow: hidden;
        }
        
        .card-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .card-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          margin: 0;
        }
        
        .card-content {
          padding: var(--space-6);
        }
        
        .status-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          margin-bottom: var(--space-6);
        }
        
        .info-item {
          display: flex;
          justify-content: space-between;
        }
        
        .info-label {
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
        }
        
        .info-value {
          font-weight: 600;
          color: var(--color-gray-900);
        }
        
        .progress-bar-container {
          height: 8px;
          background: var(--color-gray-200);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: var(--space-6);
        }
        
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--color-primary-500), var(--color-electric-500));
          transition: width var(--transition-base);
        }
        
        .status-message {
          background: var(--color-accent-50);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border-left: 4px solid var(--color-accent-500);
        }
        
        .status-message p {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-gray-700);
        }
        
        .estimated-time {
          margin-top: var(--space-2);
          font-weight: 600;
        }
        
        .steps-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        
        .step-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          transition: background var(--transition-fast);
        }
        
        .step-item.completed {
          color: var(--color-primary-700);
        }
        
        .step-item.active {
          background: var(--color-electric-50);
          color: var(--color-electric-700);
          font-weight: 600;
        }
        
        .step-icon {
          font-size: var(--font-size-lg);
        }
        
        .profile-info {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          margin-bottom: var(--space-6);
        }
        
        .avatar-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-electric-500));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-2xl);
          font-weight: 700;
        }
        
        .profile-details h4 {
          margin: 0 0 var(--space-1) 0;
          font-size: var(--font-size-lg);
        }
        
        .profile-details p {
          margin: 0;
          color: var(--color-gray-600);
          font-size: var(--font-size-sm);
        }
        
        .resources-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        
        .resource-link {
          display: block;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          color: var(--color-gray-700);
          font-size: var(--font-size-sm);
          transition: all var(--transition-fast);
        }
        
        .resource-link:hover {
          background: var(--color-primary-50);
          color: var(--color-primary-700);
        }
        
        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-section {
            padding: var(--space-8) 0;
          }
          
          .welcome-title {
            font-size: var(--font-size-3xl);
          }
          
          .dashboard-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: var(--space-4);
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-around;
            z-index: 1000;
          }

          .nav-link {
            font-size: var(--font-size-sm);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .btn-install {
            position: fixed;
            top: var(--space-4);
            right: var(--space-4);
            z-index: 1001;
            box-shadow: var(--shadow-lg);
            animation: bounce 2s infinite;
          }
        }

        /* Portal Tabs */
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

        /* Orders Tab */
        .orders-tab {
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

        .order-count {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-600);
          background: var(--color-gray-100);
          padding: var(--space-2) var(--space-4);
          border-radius: var(--radius-full);
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
          margin-bottom: 0;
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

        .package-info,
        .distance-info {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3);
          background: var(--color-primary-50);
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          margin-bottom: var(--space-3);
        }

        .package-icon {
          font-size: var(--font-size-lg);
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--space-4);
          border-top: 1px solid var(--color-gray-200);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .order-cost {
          font-size: var(--font-size-xl);
          font-weight: 700;
          color: var(--color-primary-700);
        }

        .order-actions {
          display: flex;
          gap: var(--space-2);
        }

        .btn-success {
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600));
          color: white;
        }

        .btn-success:hover {
          background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
          transform: translateY(-2px);
        }

        /* Offline Banner */
        .offline-banner {
          background: linear-gradient(135deg, var(--color-warning-100), var(--color-warning-200));
          border: 2px solid var(--color-warning-400);
          border-radius: var(--radius-lg);
          padding: var(--space-5);
          margin-bottom: var(--space-6);
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .offline-icon {
          font-size: 2rem;
        }

        .offline-banner strong {
          display: block;
          font-size: var(--font-size-base);
          color: var(--color-warning-800);
          margin-bottom: var(--space-1);
        }

        .offline-banner p {
          margin: 0;
          font-size: var(--font-size-sm);
          color: var(--color-warning-700);
        }

        .queue-info {
          font-weight: 600;
          color: var(--color-warning-800);
        }

        /* Order In Transit */
        .order-in-transit {
          width: 100%;
          margin-top: var(--space-4);
        }

        @media (max-width: 1024px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .orders-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 768px) {
          .dashboard-section {
            padding: var(--space-8) 0;
          }
          
          .welcome-title {
            font-size: var(--font-size-3xl);
          }

          .portal-tabs {
            overflow-x: auto;
          }
          
          .dashboard-nav {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            padding: var(--space-4);
            box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-around;
            z-index: 1000;
          }

          .nav-link {
            font-size: var(--font-size-sm);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;
          }

          .btn-install {
            position: fixed;
            top: var(--space-4);
            right: var(--space-4);
            z-index: 1001;
            box-shadow: var(--shadow-lg);
            animation: bounce 2s infinite;
          }
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(-10px);}
          60% {transform: translateY(-5px);}
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
