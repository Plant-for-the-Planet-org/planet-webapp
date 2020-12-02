import React from 'react';
import styles from './LandingSection.module.scss';

export default function LandingSection(props: any) {
  return (
    <div
      className={
        `${props.noFixedHeight ? styles.landingSectionNoFixedHeight : styles.landingSection} ${props.fixedBg ? styles.landingSectionFixedBG : styles.landingSection}
      `}
      style={{
        background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)), url(${props.imageSrc
          ? props.imageSrc
          : `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
          }) 0% 0% no-repeat padding-box`,
        mixBlendMode: 'darken',
        backgroundSize: 'cover',
      }}
    >
      {props.children}
    </div>
  );
}
