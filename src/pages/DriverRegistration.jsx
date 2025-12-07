import { Link } from 'react-router-dom';
import DriverRegistrationForm from '../components/DriverRegistrationForm';
import Footer from '../components/Footer';

function DriverRegistration() {
    return (
        <div className="driver-registration-page">
            <header className="registration-header">
                <div className="container">
                    <Link to="/" className="logo-link">
                        <h2 className="logo">
                            <span className="text-gradient">EcoFleet</span> Chile
                        </h2>
                    </Link>
                </div>
            </header>

            <section className="registration-section">
                <div className="container">
                    <div className="registration-intro">
                        <h1 className="page-title">Registro de Conductor</h1>
                        <p className="page-subtitle">
                            Únete a la red de conductores ecológicos más grande de Chile.
                            Completa el formulario y comienza a generar ingresos mientras cuidas el planeta.
                        </p>
                    </div>

                    <DriverRegistrationForm />
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .driver-registration-page {
          min-height: 100vh;
          background: var(--color-gray-50);
        }
        
        .registration-header {
          background: white;
          padding: var(--space-6) 0;
          box-shadow: var(--shadow-sm);
          position: sticky;
          top: 0;
          z-index: 100;
        }
        
        .logo-link {
          text-decoration: none;
        }
        
        .logo {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          margin: 0;
        }
        
        .registration-section {
          padding: var(--space-16) 0;
        }
        
        .registration-intro {
          text-align: center;
          margin-bottom: var(--space-12);
        }
        
        .page-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-4);
        }
        
        .page-subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-gray-600);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .registration-section {
            padding: var(--space-8) 0;
          }
          
          .page-title {
            font-size: var(--font-size-3xl);
          }
        }
      `}</style>
        </div>
    );
}

export default DriverRegistration;
