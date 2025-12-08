import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { ConfigService } from '../services/ConfigService';
import { chileanRegions } from '../data/chileanRegions';

function Admin() {
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'config'
  const [filter, setFilter] = useState('all');
  const [allowedRegions, setAllowedRegions] = useState([]);
  const [isSavingConfig, setIsSavingConfig] = useState(false);
  const [configMessage, setConfigMessage] = useState('');

  // Mock data - in a real app, this would come from backend
  const [applications, setApplications] = useState([
    {
      id: 1,
      name: 'Juan Pérez González',
      email: 'juan.perez@email.com',
      phone: '+56 9 1234 5678',
      vehicleType: 'Automóvil Eléctrico',
      applicationDate: '2025-12-06',
      status: 'pending'
    },
    {
      id: 2,
      name: 'María González Silva',
      email: 'maria.gonzalez@email.com',
      phone: '+56 9 8765 4321',
      vehicleType: 'Bicicleta Eléctrica',
      applicationDate: '2025-12-05',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Carlos Rodríguez López',
      email: 'carlos.rodriguez@email.com',
      phone: '+56 9 5555 6666',
      vehicleType: 'Scooter Eléctrico',
      applicationDate: '2025-12-04',
      status: 'pending'
    }
  ]);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const regions = await ConfigService.getAllowedRegions();
    setAllowedRegions(regions);
  };

  const handleRegionToggle = (regionName) => {
    setAllowedRegions(prev => {
      if (prev.includes(regionName)) {
        return prev.filter(r => r !== regionName);
      } else {
        return [...prev, regionName];
      }
    });
  };

  const saveConfig = async () => {
    setIsSavingConfig(true);
    setConfigMessage('');
    const result = await ConfigService.setAllowedRegions(allowedRegions);
    setIsSavingConfig(false);

    if (result.success) {
      setConfigMessage('Configuración guardada exitosamente');
      setTimeout(() => setConfigMessage(''), 3000);
    } else {
      setConfigMessage('Error al guardar: ' + result.error);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-warning">Pendiente</span>;
      case 'approved':
        return <span className="badge badge-success">Aprobado</span>;
      case 'rejected':
        return <span className="badge badge-error">Rechazado</span>;
      default:
        return <span className="badge badge-info">En Proceso</span>;
    }
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="container">
          <Link to="/" className="logo-link">
            <h2 className="logo">
              <span className="text-gradient">EcoFleet</span> Chile - Admin
            </h2>
          </Link>
          <nav className="admin-nav">
            <Link to="/" className="nav-link">Inicio</Link>
            <button
              className={`nav-link-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Solicitudes
            </button>
            <button
              className={`nav-link-btn ${activeTab === 'config' ? 'active' : ''}`}
              onClick={() => setActiveTab('config')}
            >
              Configuración
            </button>
          </nav>
        </div>
      </header>

      <section className="admin-section">
        <div className="container">
          <div className="admin-header-section">
            <h1 className="page-title">Panel de Administración</h1>
            <p className="page-subtitle">
              {activeTab === 'applications' ? 'Gestiona las solicitudes de conductores' : 'Configuración del Sistema'}
            </p>
          </div>

          {activeTab === 'applications' ? (
            <>
              <div className="stats-grid">
                <div className="stat-card card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-value">{stats.total}</div>
                  <div className="stat-label">Total Solicitudes</div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">⏳</div>
                  <div className="stat-value">{stats.pending}</div>
                  <div className="stat-label">Pendientes</div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-value">{stats.approved}</div>
                  <div className="stat-label">Aprobados</div>
                </div>
                <div className="stat-card card">
                  <div className="stat-icon">❌</div>
                  <div className="stat-value">{stats.rejected}</div>
                  <div className="stat-label">Rechazados</div>
                </div>
              </div>

              <div className="applications-section card">
                <div className="applications-header">
                  <h2 className="section-title">Solicitudes de Conductores</h2>
                  <div className="filter-buttons">
                    <button
                      className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                      onClick={() => setFilter('all')}
                    >
                      Todas
                    </button>
                    <button
                      className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                      onClick={() => setFilter('pending')}
                    >
                      Pendientes
                    </button>
                    <button
                      className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                      onClick={() => setFilter('approved')}
                    >
                      Aprobadas
                    </button>
                    <button
                      className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                      onClick={() => setFilter('rejected')}
                    >
                      Rechazadas
                    </button>
                  </div>
                </div>

                <div className="applications-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th>Vehículo</th>
                        <th>Fecha</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredApplications.map(app => (
                        <tr key={app.id}>
                          <td className="name-cell">{app.name}</td>
                          <td>{app.email}</td>
                          <td>{app.phone}</td>
                          <td>{app.vehicleType}</td>
                          <td>{new Date(app.applicationDate).toLocaleDateString('es-CL')}</td>
                          <td>{getStatusBadge(app.status)}</td>
                          <td>
                            <div className="action-buttons">
                              {app.status === 'pending' && (
                                <>
                                  <button
                                    className="btn-action btn-approve"
                                    onClick={() => handleStatusChange(app.id, 'approved')}
                                    title="Aprobar"
                                  >
                                    ✓
                                  </button>
                                  <button
                                    className="btn-action btn-reject"
                                    onClick={() => handleStatusChange(app.id, 'rejected')}
                                    title="Rechazar"
                                  >
                                    ✕
                                  </button>
                                </>
                              )}
                              <button className="btn-action btn-view" title="Ver Detalles">
                                👁️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredApplications.length === 0 && (
                    <div className="empty-state">
                      <p>No hay solicitudes con este filtro</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="config-section card">
              <div className="card-header">
                <h2 className="section-title">Configuración de Regiones</h2>
                <p className="section-subtitle">Selecciona las regiones disponibles en el formulario de registro</p>
              </div>

              <div className="regions-grid">
                {chileanRegions.map(region => (
                  <label key={region.id} className="region-checkbox-item">
                    <input
                      type="checkbox"
                      checked={allowedRegions.includes(region.name)}
                      onChange={() => handleRegionToggle(region.name)}
                    />
                    <span className="region-name">{region.name}</span>
                  </label>
                ))}
              </div>

              <div className="config-actions">
                <button
                  className="btn btn-primary"
                  onClick={saveConfig}
                  disabled={isSavingConfig}
                >
                  {isSavingConfig ? 'Guardando...' : 'Guardar Configuración'}
                </button>
                {configMessage && (
                  <span className={`config-message ${configMessage.includes('Error') ? 'error' : 'success'}`}>
                    {configMessage}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .admin-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .admin-header {
          background: white;
          padding: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .admin-header .container {
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
        
        .admin-nav {
          display: flex;
          gap: var(--space-6);
        }
        
        .nav-link {
          color: var(--color-gray-600);
          font-weight: 600;
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .nav-link-btn {
            background: none;
            border: none;
            color: var(--color-gray-600);
            font-weight: 600;
            font-size: 1rem;
            cursor: pointer;
            padding: 0;
            transition: color var(--transition-fast);
        }
        
        .nav-link:hover,
        .nav-link.active,
        .nav-link-btn:hover,
        .nav-link-btn.active {
          color: var(--color-primary-600);
        }
        
        .admin-section {
          padding: var(--space-16) 0;
        }
        
        .admin-header-section {
          margin-bottom: var(--space-12);
        }
        
        .page-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-3);
        }
        
        .page-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-gray-600);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          margin-bottom: var(--space-12);
        }
        
        .stat-card {
          text-align: center;
          padding: var(--space-6);
        }
        
        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: var(--space-3);
        }
        
        .stat-value {
          font-size: var(--font-size-4xl);
          font-weight: 800;
          color: var(--color-primary-600);
          margin-bottom: var(--space-2);
        }
        
        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          font-weight: 600;
        }
        
        .applications-section, .config-section {
          padding: 0;
          overflow: hidden;
        }

        .config-section {
            padding: var(--space-8);
        }

        .card-header {
            margin-bottom: var(--space-6);
        }

        .section-subtitle {
            color: var(--color-gray-600);
            margin-top: var(--space-2);
        }
        
        .applications-header {
          padding: var(--space-6);
          border-bottom: 1px solid var(--color-gray-200);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--space-4);
        }
        
        .section-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin: 0;
        }
        
        .filter-buttons {
          display: flex;
          gap: var(--space-2);
        }
        
        .filter-btn {
          padding: var(--space-2) var(--space-4);
          border: 2px solid var(--color-gray-300);
          background: white;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-700);
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        
        .filter-btn:hover {
          border-color: var(--color-primary-400);
          color: var(--color-primary-600);
        }
        
        .filter-btn.active {
          background: var(--color-primary-600);
          border-color: var(--color-primary-600);
          color: white;
        }
        
        .applications-table {
          overflow-x: auto;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        thead {
          background: var(--color-gray-50);
        }
        
        th {
          padding: var(--space-4);
          text-align: left;
          font-size: var(--font-size-sm);
          font-weight: 700;
          color: var(--color-gray-700);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        td {
          padding: var(--space-4);
          border-bottom: 1px solid var(--color-gray-200);
          font-size: var(--font-size-sm);
        }
        
        .name-cell {
          font-weight: 600;
          color: var(--color-gray-900);
        }
        
        .action-buttons {
          display: flex;
          gap: var(--space-2);
        }
        
        .btn-action {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: all var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-approve {
          background: var(--color-primary-100);
          color: var(--color-primary-700);
        }
        
        .btn-approve:hover {
          background: var(--color-primary-600);
          color: white;
        }
        
        .btn-reject {
          background: #fee2e2;
          color: #991b1b;
        }
        
        .btn-reject:hover {
          background: #ef4444;
          color: white;
        }
        
        .btn-view {
          background: var(--color-electric-100);
          color: var(--color-electric-700);
        }
        
        .btn-view:hover {
          background: var(--color-electric-600);
          color: white;
        }
        
        .empty-state {
          padding: var(--space-12);
          text-align: center;
          color: var(--color-gray-500);
        }

        .regions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: var(--space-4);
            margin-bottom: var(--space-8);
            max-height: 500px;
            overflow-y: auto;
            padding: var(--space-4);
            border: 1px solid var(--color-gray-200);
            border-radius: var(--radius-md);
        }

        .region-checkbox-item {
            display: flex;
            align-items: center;
            gap: var(--space-3);
            padding: var(--space-2);
            cursor: pointer;
            transition: background var(--transition-fast);
            border-radius: var(--radius-sm);
        }

        .region-checkbox-item:hover {
            background: var(--color-gray-50);
        }

        .region-checkbox-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: var(--color-primary-600);
        }

        .config-actions {
            display: flex;
            align-items: center;
            gap: var(--space-4);
        }

        .config-message {
            font-size: var(--font-size-sm);
            font-weight: 500;
        }

        .config-message.success {
            color: var(--color-success-600);
        }

        .config-message.error {
            color: var(--color-error-600);
        }
        
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .admin-section {
            padding: var(--space-8) 0;
          }
          
          .page-title {
            font-size: var(--font-size-3xl);
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }
          
          .admin-nav {
            display: none;
          }
          
          .applications-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .filter-buttons {
            width: 100%;
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default Admin;
