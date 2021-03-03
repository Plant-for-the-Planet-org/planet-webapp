import Layout from '../Layout';

export default function BrowserNotSupported() {
    return (
        <Layout>
            <div
                style={{
                    width: '100vw',
                    height: '60vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <p>Your browser is not supported. Please use a newer version or another browser.</p>
            </div>
        </Layout>
    );
}
