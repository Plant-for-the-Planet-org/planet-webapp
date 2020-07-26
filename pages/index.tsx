import Footer from '../src/features/common/Footer';
import Layout from '../src/features/common/Layout';
import HomePage from '../src/features/public/Home';

export default function Home() {
  return (
    <Layout>
      <HomePage />
      <Footer />
    </Layout>
  );
}
