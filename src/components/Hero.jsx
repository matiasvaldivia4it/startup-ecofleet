import { Link } from 'react-router-dom';
import VideoCarousel from './VideoCarousel';

function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-background"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-text animate-fade-in">
            <h1 className="hero-title">
              Entregas <span className="text-gradient">100% Ecológicas</span> con Movilidad Eléctrica
            </h1>
            <p className="hero-subtitle">
              Únete a la revolución del delivery sustentable en Chile. Conduce vehículos eléctricos,
              gana dinero y ayuda a construir un futuro más limpio para todos.
            </p>

            <div className="hero-actions">
              <div className="primary-actions">
                <Link to="/registro-conductor" className="btn btn-primary btn-xl pulse-animation">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 14C20.49 14 22 15.51 22 17V20C22 21.1 21.1 22 20 22H4C2.9 22 2 21.1 2 20V17C2 15.51 3.51 14 5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 14V4M12 4L15 7M12 4L9 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Regístrate como Conductor
                </Link>
                <Link to="/registro-cliente" className="btn btn-electric btn-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h18v18H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Regístrate como Cliente
                </Link>
              </div>

              <div className="secondary-actions">
                <span className="action-label">¿Ya tienes cuenta?</span>
                <div className="portal-buttons">
                  <Link to="/customer" className="btn btn-secondary">
                    📦 Portal Cliente
                  </Link>
                  <Link to="/dashboard" className="btn btn-secondary">
                    🚚 Portal Conductor
                  </Link>
                </div>
              </div>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">🌱</div>
                <div className="stat-text">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Cero Emisiones</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⚡</div>
                <div className="stat-text">
                  <div className="stat-value">Eléctrico</div>
                  <div className="stat-label">Flota Completa</div>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🇨🇱</div>
                <div className="stat-text">
                  <div className="stat-value">Chile</div>
                  <div className="stat-label">Hecho en Chile</div>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-visual animate-float">
            <VideoCarousel />
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: var(--space-16) 0;
        }
        
        .hero-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, 
            var(--color-primary-50) 0%, 
            var(--color-electric-50) 50%,
            var(--color-primary-50) 100%
          );
          z-index: -1;
        }
        
        .hero-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
        }
        
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-12);
          align-items: center;
        }
        
        .hero-text {
          max-width: 600px;
        }
        
        .hero-title {
          font-size: var(--font-size-6xl);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: var(--space-6);
          color: var(--color-gray-900);
        }
        
        .hero-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-gray-600);
          margin-bottom: var(--space-8);
          line-height: 1.6;
        }
        
        .hero-actions {
          margin-bottom: var(--space-12);
        }

        .primary-actions {
          margin-bottom: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .btn-xl {
          font-size: 1.25rem;
          padding: 1rem 2rem;
          display: inline-flex;
          align-items: center;
          gap: var(--space-3);
          box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
        }

        .pulse-animation {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .secondary-actions {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .action-label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-500);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .portal-buttons {
          display: flex;
          gap: var(--space-4);
        }
        
        .hero-stats {
          display: flex;
          gap: var(--space-8);
          flex-wrap: wrap;
          padding-top: var(--space-8);
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }
        
        .stat-icon {
          font-size: 2.5rem;
        }
        
        .stat-value {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-primary-700);
        }
        
        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
        }
        
        .hero-visual {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }
        
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: var(--space-12);
          }

          .hero-text {
            margin: 0 auto;
          }

          .hero-actions {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .portal-buttons {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .hero-title {
            font-size: var(--font-size-4xl);
          }
          
          .portal-buttons {
            flex-direction: column;
            width: 100%;
          }

          .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
