import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';
import HomePage from '../src/tenants/plantfortheplanet/About/About';
// import HomePage from '../src/tenants/salesforce/About/About';
export default function Home() {
  return (
    <Layout>
      <HomePage />
      <Footer />
    </Layout>
  );
}
