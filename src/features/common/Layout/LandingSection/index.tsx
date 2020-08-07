import React from 'react';
import LazyLoad from 'react-lazyload';
import styles from './LandingSection.module.scss';

export default function LandingSection(props: any) {
  return (
    <section className={styles.landingSection}>
      <div className={styles.backgroundImage}>
        <LazyLoad>
          <img
            style={{ maxHeight: '100vh', minWidth: '100vw' }}
            src={'/static/images/home/BackgroundImage.png'}
          />
        </LazyLoad>
      </div>

      <div className={styles.landingContent}>{props.children}</div>
    </section>
  );
}
