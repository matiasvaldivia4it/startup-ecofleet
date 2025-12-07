import { useState, useEffect } from 'react';

function Stats() {
    const [counts, setCounts] = useState({
        co2Saved: 0,
        deliveries: 0,
        drivers: 0,
        cities: 0
    });

    const targets = {
        co2Saved: 15420,
        deliveries: 50000,
        drivers: 250,
        cities: 8
    };

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        let currentStep = 0;
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;

            setCounts({
                co2Saved: Math.floor(targets.co2Saved * progress),
                deliveries: Math.floor(targets.deliveries * progress),
                drivers: Math.floor(targets.drivers * progress),
                cities: Math.floor(targets.cities * progress)
            });

            if (currentStep >= steps) {
                clearInterval(timer);
                setCounts(targets);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    const stats = [
        {
            value: `${counts.co2Saved.toLocaleString('es-CL')}`,
            unit: 'kg',
            label: 'CO₂ Ahorrado',
            icon: '🌱',
            color: 'primary'
        },
        {
            value: counts.deliveries.toLocaleString('es-CL'),
            unit: '+',
            label: 'Entregas Realizadas',
            icon: '📦',
            color: 'electric'
        },
        {
            value: counts.drivers.toLocaleString('es-CL'),
            unit: '+',
            label: 'Conductores Activos',
            icon: '👥',
            color: 'accent'
        },
        {
            value: counts.cities.toLocaleString('es-CL'),
            unit: '',
            label: 'Ciudades',
            icon: '🏙️',
            color: 'primary'
        }
    ];

    return (
        <section className="stats-section">
            <div className="stats-background"></div>
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title-light">Nuestro Impacto</h2>
                    <p className="section-subtitle-light">
                        Juntos estamos construyendo un futuro más limpio y sostenible
                    </p>
                </div>

                <div className="stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-icon-large">{stat.icon}</div>
                            <div className="stat-value-large">
                                {stat.value}
                                <span className="stat-unit">{stat.unit}</span>
                            </div>
                            <div className="stat-label-large">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .stats-section {
          position: relative;
          padding: var(--space-20) 0;
          overflow: hidden;
        }
        
        .stats-background {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--color-primary-600), var(--color-electric-600));
          z-index: -1;
        }
        
        .stats-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
        }
        
        .section-header {
          margin-bottom: var(--space-16);
        }
        
        .section-title-light {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-4);
          color: white;
        }
        
        .section-subtitle-light {
          font-size: var(--font-size-xl);
          color: rgba(255, 255, 255, 0.9);
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-8);
        }
        
        .stat-card {
          text-align: center;
          padding: var(--space-8);
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: var(--radius-xl);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all var(--transition-base);
        }
        
        .stat-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-8px);
        }
        
        .stat-icon-large {
          font-size: 3.5rem;
          margin-bottom: var(--space-4);
        }
        
        .stat-value-large {
          font-size: var(--font-size-5xl);
          font-weight: 800;
          color: white;
          margin-bottom: var(--space-2);
          line-height: 1;
        }
        
        .stat-unit {
          font-size: var(--font-size-2xl);
          font-weight: 600;
          margin-left: var(--space-1);
        }
        
        .stat-label-large {
          font-size: var(--font-size-lg);
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
        
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .stats-section {
            padding: var(--space-16) 0;
          }
          
          .section-title-light {
            font-size: var(--font-size-3xl);
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
          
          .stat-value-large {
            font-size: var(--font-size-4xl);
          }
        }
      `}</style>
        </section>
    );
}

export default Stats;
