import React from 'react';
import LazyLoad from 'react-lazyload';
import styles from './LandingSection.module.scss';

export default function LandingSection({ props }: any) {
  return (
    <section className={styles.landingSection}>
      <div className={styles.backgroundImage}>
        <LazyLoad>
          <img src={'/static/images/home/BGHome.jpg'} />
        </LazyLoad>
      </div>

      <div className={styles.landingContent}>{props.children}</div>
    </section>
  );
}
