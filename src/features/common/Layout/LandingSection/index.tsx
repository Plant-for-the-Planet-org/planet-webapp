import type { ReactNode } from 'react';

import styles from './LandingSection.module.scss';

interface Props {
  fixedBg?: boolean;
  imageSrc?: string;
  children?: ReactNode;
}

export default function LandingSection(props: Props) {
  return (
    <div
      className={`${styles.landingSection} ${
        props.fixedBg ? styles.landingSectionFixedBG : styles.landingSection
      }
      `}
      style={{
        background: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.4), rgba(0,0,0,0), rgba(0,0,0,0)), url(${
          props.imageSrc
            ? props.imageSrc
            : `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
        }) 0% 0% no-repeat padding-box`,
        backgroundSize: 'cover',
      }}
    >
      {props.children}
    </div>
  );
}
