import Custom404Image from '../src/assets/images/Custom404Image';
import Layout from '../src/features/common/Layout';

interface Props {
  initialized: Boolean;
}

export default function Custom404(initialized: Props) {
  return (
    <>
      {initialized ? (
        <Layout>
          <div
            style={{
              width: '100vw',
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '80px',
            }}
          >
            <Custom404Image />
          </div>
        </Layout>
      ) : (
        <></>
      )}
    </>
  );
}
