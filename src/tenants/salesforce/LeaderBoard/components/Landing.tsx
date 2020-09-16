import styles from './../LeaderBoard.module.scss';

export default function Landing() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.landingContent}>
        <h1>Plant the Seeds for a More Sustainable Future</h1>
        <p>
          Salesforce set a goal to conserve, restore, and grow 100 million trees
          by 2030. We partnered with Plant for the Planet to share our progress
          and empower our community to support trees all over the world.
        </p>
        <p style={{ marginTop: '10px' }}>Join us and start planting!</p>
      </div>
    </section>
  );
}
