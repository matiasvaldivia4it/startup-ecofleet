function Features() {
    const features = [
        {
            icon: '🔋',
            title: 'Flota 100% Eléctrica',
            description: 'Conduce vehículos eléctricos modernos y eficientes. Cero emisiones, máximo impacto positivo.'
        },
        {
            icon: '🌍',
            title: 'Impacto Ambiental',
            description: 'Cada entrega que realizas ayuda a reducir la huella de carbono y proteger nuestro planeta.'
        },
        {
            icon: '💰',
            title: 'Ganancias Competitivas',
            description: 'Tarifas justas y transparentes. Gana más mientras contribuyes a un futuro sostenible.'
        },
        {
            icon: '📱',
            title: 'Tecnología Avanzada',
            description: 'Plataforma intuitiva con rutas optimizadas, seguimiento en tiempo real y soporte 24/7.'
        },
        {
            icon: '⏰',
            title: 'Horarios Flexibles',
            description: 'Tú decides cuándo trabajar. Compatibiliza con tus actividades y responsabilidades.'
        },
        {
            icon: '🎓',
            title: 'Capacitación Continua',
            description: 'Formación en conducción eficiente, seguridad vial y atención al cliente de excelencia.'
        }
    ];

    return (
        <section className="features-section" id="caracteristicas">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">¿Por qué elegir EcoFleet?</h2>
                    <p className="section-subtitle">
                        Únete a la plataforma de delivery más innovadora y sustentable de Chile
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card card"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="feature-icon">{feature.icon}</div>
                            <h3 className="feature-title">{feature.title}</h3>
                            <p className="feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .features-section {
          padding: var(--space-20) 0;
          background: white;
        }
        
        .section-header {
          margin-bottom: var(--space-16);
        }
        
        .section-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-4);
          color: var(--color-gray-900);
        }
        
        .section-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-gray-600);
          max-width: 600px;
          margin: 0 auto;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-8);
        }
        
        .feature-card {
          text-align: center;
          padding: var(--space-8);
          animation: fadeIn 0.6s ease-out backwards;
        }
        
        .feature-icon {
          font-size: 4rem;
          margin-bottom: var(--space-4);
        }
        
        .feature-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          margin-bottom: var(--space-3);
          color: var(--color-gray-900);
        }
        
        .feature-description {
          font-size: var(--font-size-base);
          color: var(--color-gray-600);
          line-height: 1.6;
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .features-section {
            padding: var(--space-16) 0;
          }
          
          .section-title {
            font-size: var(--font-size-3xl);
          }
          
          .features-grid {
            grid-template-columns: 1fr;
            gap: var(--space-6);
          }
        }
      `}</style>
        </section>
    );
}

export default Features;
