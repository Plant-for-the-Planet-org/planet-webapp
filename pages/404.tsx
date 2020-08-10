import Custom404Image from '../src/assets/images/Custom404Image';
import Layout from '../src/features/common/Layout';

export default function Custom404() {
  return (
    <Layout>
      <div
        style={{
          width: '100vw',
          height: '60vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '40px',
        }}
      >
        <Custom404Image />
      </div>
    </Layout>
  );
}
