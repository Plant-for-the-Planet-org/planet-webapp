import AboutSection from './components/AboutSection';
import AdditionalNavbar from './components/AdditionalNavbar';
import Blogs from './components/Blogs';
import ClimateNeutrality from './components/ClimateNeutrality';
import Landing from './components/Landing';
import Testimonials from './components/Testimonials';
import TheChangeChocolate from './components/TheChangeChocolate';
import WhyTrees from './components/WhyTrees';
import Yucantan from './components/Yucantan';

export default function About() {
  return (
    <main style={{ height: '100vh', overflowX: 'hidden' }}>
      <AdditionalNavbar />
      <Landing />
      <AboutSection />
      <Yucantan />
      <TheChangeChocolate />
      <WhyTrees />
      <ClimateNeutrality />
      <Testimonials />
      <Blogs />
    </main>
  );
}
