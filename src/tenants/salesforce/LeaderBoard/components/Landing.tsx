import styles from './../LeaderBoard.module.scss';

export default function Landing() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <h2>Plant the Seeds for a More Sustainable Future</h2>
        <p>
          Salesforce set a goal to support and mobilize the conservation,
          restoration, and growth of 100 million trees by 2030.
        </p>
        <p style={{ marginTop: '10px' }}>Join us and start planting!</p>
      </div>
    </section>
  );
}
