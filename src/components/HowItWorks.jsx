function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Regístrate Online',
            description: 'Completa el formulario de registro con tus datos personales, licencia de conducir y vehículo eléctrico.',
            icon: '📝'
        },
        {
            number: '02',
            title: 'Verificación',
            description: 'Nuestro equipo revisa tu solicitud y verifica tus documentos en un plazo de 24-48 horas.',
            icon: '✅'
        },
        {
            number: '03',
            title: 'Capacitación',
            description: 'Participa en nuestra capacitación online sobre la plataforma, seguridad y mejores prácticas.',
            icon: '🎓'
        },
        {
            number: '04',
            title: '¡Comienza a Entregar!',
            description: 'Activa tu cuenta, conecta tu vehículo y empieza a recibir solicitudes de entrega inmediatamente.',
            icon: '🚀'
        }
    ];

    return (
        <section className="how-it-works-section" id="como-funciona">
            <div className="container">
                <div className="section-header text-center">
                    <h2 className="section-title">¿Cómo Funciona?</h2>
                    <p className="section-subtitle">
                        Únete a EcoFleet en 4 simples pasos
                    </p>
                </div>

                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-item">
                            <div className="step-number">{step.number}</div>
                            <div className="step-content card card-glass">
                                <div className="step-icon">{step.icon}</div>
                                <h3 className="step-title">{step.title}</h3>
                                <p className="step-description">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="step-connector">
                                    <svg width="100%" height="4" viewBox="0 0 100 4" preserveAspectRatio="none">
                                        <line x1="0" y1="2" x2="100" y2="2" stroke="url(#lineGradient)" strokeWidth="4" strokeDasharray="8 4" />
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="var(--color-primary-400)" />
                                                <stop offset="100%" stopColor="var(--color-electric-400)" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .how-it-works-section {
          padding: var(--space-20) 0;
          background: linear-gradient(180deg, white 0%, var(--color-gray-50) 100%);
        }
        
        .section-header {
          margin-bottom: var(--space-16);
        }
        
        .section-title {
          font-size: var(--font-size-4xl);
          margin-bottom: var(--space-4);
        }
        
        .section-subtitle {
          font-size: var(--font-size-xl);
          color: var(--color-gray-600);
        }
        
        .steps-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-6);
          position: relative;
        }
        
        .step-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .step-number {
          font-size: var(--font-size-3xl);
          font-weight: 800;
          background: linear-gradient(135deg, var(--color-primary-500), var(--color-electric-500));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: var(--space-4);
        }
        
        .step-content {
          text-align: center;
          padding: var(--space-6);
          width: 100%;
          height: 100%;
        }
        
        .step-icon {
          font-size: 3rem;
          margin-bottom: var(--space-4);
        }
        
        .step-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          margin-bottom: var(--space-3);
          color: var(--color-gray-900);
        }
        
        .step-description {
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          line-height: 1.6;
          margin: 0;
        }
        
        .step-connector {
          position: absolute;
          top: 2rem;
          left: 100%;
          width: 100%;
          display: none;
        }
        
        @media (max-width: 1024px) {
          .steps-container {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .how-it-works-section {
            padding: var(--space-16) 0;
          }
          
          .section-title {
            font-size: var(--font-size-3xl);
          }
          
          .steps-container {
            grid-template-columns: 1fr;
            gap: var(--space-8);
          }
        }
      `}</style>
        </section>
    );
}

export default HowItWorks;
