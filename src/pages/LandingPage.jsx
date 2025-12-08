
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Stats from '../components/Stats';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom'; // Assuming Link is needed and comes from react-router-dom

function LandingPage() {
    return (
        <div className="landing-page">
            <Hero />
            <div className="hero-buttons">
                <Link to="/registro-cliente" className="btn btn-primary btn-lg">
                    Registrar mi Negocio
                </Link>
                <Link to="/registro-conductor" className="btn btn-outline btn-lg">
                    Ser Conductor
                </Link>
            </div>
            <Features />
            <HowItWorks />
            <Stats />
            <Footer />
        </div>
    );
}

export default LandingPage;

