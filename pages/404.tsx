import Custom404Image from '../public/assets/images/Custom404Image';
import Footer from '../src/features/common/Layout/Footer';
import { useRouter } from 'next/router';

interface Props {
  initialized: Boolean;
}

export default function Custom404(initialized: Props) {
  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'column'
  }
  const router = useRouter();

  return (
    <>
      {initialized ? (
           <div style={styles}>
            <h2>{router.query.error}</h2>
            <div style={{width:'300px',height:'175px'}}>
              <Custom404Image />
            </div>
            
          </div>
      ) : (
        <></>
      )}
      <Footer/>
    </>
  );
}
