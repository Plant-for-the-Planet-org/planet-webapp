import Custom404Image from '../src/assets/images/Custom404Image';
import Layout from '../src/features/common/Layout';

interface Props {
  initialized: Boolean;
}

export default function Custom404(initialized: Props) {
  const styles = {
    width: '100vw',
    height: '60vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '80px',
  }
  return (
    <>
      {initialized ? (
        <Layout>
           <div style={styles}>
            <Custom404Image />
          </div>
        </Layout>
      ) : (
        <></>
      )}
    </>
  );
}
