
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

            <Features />
            <HowItWorks />
            <Stats />
            <Footer />
        </div>
    );
}

export default LandingPage;

