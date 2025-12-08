import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

function Dashboard() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

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
    status: 'pending',
    applicationDate: '2025-12-06',
    profileCompletion: 100
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
              Aquí puedes ver el estado de tu solicitud y gestionar tu perfil
            </p>
          </div>

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
        </div>
      </section>

      <Footer />

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
