import { useState, useEffect } from 'react';

const VideoCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "1. Tu Orden",
      description: "Pide desde nuestra app o web en segundos.",
      image: "/assets/carousel-1.png",
      icon: "📱"
    },
    {
      id: 2,
      title: "2. Empaque Eco",
      description: "Utilizamos materiales 100% reciclables o compostables.",
      image: "/assets/carousel-2.png",
      icon: "📦"
    },
    {
      id: 3,
      title: "3. Transporte Cero Emisiones",
      description: "Nuestra flota eléctrica lleva tu pedido sin contaminar.",
      image: "/assets/carousel-3.png",
      icon: "⚡"
    },
    {
      id: 4,
      title: "4. Entrega Feliz",
      description: "Recibe tu pedido sabiendo que ayudaste al planeta.",
      image: "/assets/carousel-4.png",
      icon: "😊"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="carousel-container">
      <div className="carousel-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-slide">
            <div className="slide-content">
              <div className="slide-image-container">
                {/* We will replace this with the actual generated image later */}
                <div className="placeholder-image" style={{ backgroundImage: `url(${slide.image})` }}>
                  <span className="slide-icon">{slide.icon}</span>
                </div>
                <div className="slide-overlay">
                  <h3>{slide.title}</h3>
                  <p>{slide.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="carousel-btn prev" onClick={prevSlide}>❮</button>
      <button className="carousel-btn next" onClick={nextSlide}>❯</button>

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>

      <style jsx>{`
        .carousel-container {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
          aspect-ratio: 16/9;
          background: var(--color-gray-900);
        }

        .carousel-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
          height: 100%;
        }

        .carousel-slide {
          min-width: 100%;
          height: 100%;
          position: relative;
        }

        .slide-content {
          width: 100%;
          height: 100%;
        }

        .slide-image-container {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          background-color: var(--color-primary-800);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slide-icon {
          font-size: 5rem;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }

        .slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-8);
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          color: white;
          text-align: left;
        }

        .slide-overlay h3 {
          font-size: var(--font-size-2xl);
          margin-bottom: var(--space-2);
          font-weight: 700;
        }

        .slide-overlay p {
          font-size: var(--font-size-lg);
          opacity: 0.9;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: var(--space-4);
          cursor: pointer;
          font-size: 1.5rem;
          backdrop-filter: blur(4px);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .carousel-btn:hover {
          background: rgba(255, 255, 255, 0.4);
        }

        .prev { left: var(--space-4); }
        .next { right: var(--space-4); }

        .carousel-indicators {
          position: absolute;
          bottom: var(--space-4);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: var(--space-2);
        }

        .indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          padding: 0;
          transition: all 0.2s;
        }

        .indicator.active {
          background: white;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default VideoCarousel;
