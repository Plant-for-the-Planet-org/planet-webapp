import LazyLoad from 'react-lazyload';
import styles from './../LeaderBoard.module.scss';

export default function Landing() {
  return (
    <section className={styles.landingSection}>
      <div className={styles.backgroundImage}>
        <LazyLoad>
          <img src={'/tenants/salesforce/images/Background.png'} />
        </LazyLoad>
      </div>

      <div className={styles.landingContent}>
        <h2>Plant the Seeds for a More Sustainable Future</h2>
        <p>
          To address climate change, we need to do two things: cut emissions and
          draw down the carbon in the atmosphere. In terms of carbon drawdown,
          forests are our largest, most advanced tool.
        </p>
        <button className={styles.buttonStyle}>
          Plant Trees with Salesforce
        </button>
      </div>
    </section>
  );
}
