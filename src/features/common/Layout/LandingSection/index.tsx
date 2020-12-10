import React from 'react';
import styles from './LandingSection.module.scss';

export default function LandingSection(props: any) {
  return (
    <div
      className={
        props.noFixedHeight
          ? styles.landingSectionNoFixedHeight
          : styles.landingSection
      }
      style={{
        background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)), url(${
          props.imageSrc
            ? props.imageSrc
            : '/tenants/planet/images/home/BackgroundImage.png'
        }) 0% 0% no-repeat padding-box`,
        mixBlendMode: 'darken',
        backgroundSize: 'cover',
      }}
    >
      {props.children}
    </div>
  );
}
