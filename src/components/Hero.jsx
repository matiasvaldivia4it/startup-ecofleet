import { Link } from 'react-router-dom';

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
            <div className="hero-cta">
              <Link to="/registro-conductor" className="btn btn-primary btn-lg">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Regístrate como Conductor
              </Link>
              <Link to="/customer" className="btn btn-secondary btn-lg">
                📦 Portal Cliente
              </Link>
              <a href="#como-funciona" className="btn btn-outline btn-lg">
                Conocer Más
              </a>
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
          <div className="hero-image animate-float">
            <div className="hero-illustration">
              <div className="electric-vehicle">
                <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Electric Delivery Van */}
                  <rect x="80" y="120" width="240" height="120" rx="20" fill="url(#gradient1)" />
                  <rect x="100" y="140" width="80" height="60" rx="8" fill="#fff" opacity="0.3" />
                  <rect x="220" y="140" width="80" height="60" rx="8" fill="#fff" opacity="0.3" />
                  <circle cx="140" cy="240" r="25" fill="#1f2937" />
                  <circle cx="140" cy="240" r="15" fill="#6b7280" />
                  <circle cx="280" cy="240" r="25" fill="#1f2937" />
                  <circle cx="280" cy="240" r="15" fill="#6b7280" />
                  {/* Lightning bolt */}
                  <path d="M200 160 L190 180 L200 180 L190 200 L210 180 L200 180 Z" fill="#fbbf24" />
                  {/* Leaf decoration */}
                  <path d="M50 80 Q70 60 90 80 Q70 100 50 80" fill="#10b981" />
                  <path d="M330 60 Q350 40 370 60 Q350 80 330 60" fill="#10b981" />
                  <defs>
                    <linearGradient id="gradient1" x1="80" y1="120" x2="320" y2="240">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
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
        
        .hero-cta {
          display: flex;
          gap: var(--space-4);
          margin-bottom: var(--space-12);
          flex-wrap: wrap;
        }
        
        .hero-stats {
          display: flex;
          gap: var(--space-8);
          flex-wrap: wrap;
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
        
        .hero-illustration {
          width: 100%;
          max-width: 400px;
          margin: 0 auto;
        }
        
        .electric-vehicle svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 20px 40px rgba(16, 185, 129, 0.2));
        }
        
        @media (max-width: 768px) {
          .hero-section {
            min-height: auto;
            padding: var(--space-12) 0;
          }
          
          .hero-content {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
          
          .hero-title {
            font-size: var(--font-size-4xl);
          }
          
          .hero-subtitle {
            font-size: var(--font-size-lg);
          }
          
          .hero-cta {
            flex-direction: column;
          }
          
          .hero-cta .btn {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero;
