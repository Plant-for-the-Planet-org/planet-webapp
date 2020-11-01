import Custom404Image from '../../../../../public/assets/images/Custom404Image';
import Footer from '../../Layout/Footer';
import Layout from '../../Layout';

export default function UserNotFound() {
    return (
        <Layout>
            <h2 style={{ textAlign: 'center', paddingBottom: '20px', paddingTop: '80px' }}>User Not Found</h2>
            <div
                style={{
                    width: '100vw',
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Custom404Image />
            </div>
            <Footer />
        </Layout>
    );
}
