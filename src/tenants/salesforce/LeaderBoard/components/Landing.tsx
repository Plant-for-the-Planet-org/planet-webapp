import styles from './../styles/Landing.module.scss';

export default function Landing() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <h1>Plant the Seeds for a More Sustainable Future</h1>
        <p>
        Salesforce set a goal to support and mobilize the conservation, restoration, and growth of 100 million trees by 2030. Here, we partnered with Plant-for-the-Planet to track and share our progress while also empowering our community to join us and start planting!
        </p>
        {/* <p style={{ marginTop: '10px' }}>Join us and start planting!</p> */}
      </div>
    </section>
  );
}
