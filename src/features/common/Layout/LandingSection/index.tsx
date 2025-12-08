import type { ReactNode } from 'react';

import styles from './LandingSection.module.scss';
import { clsx } from 'clsx';

interface Props {
  fixedBg?: boolean;
  imageSrc?: string;
  children?: ReactNode;
}

export default function LandingSection(props: Props) {
  return (
    <div
      className={clsx(styles.landingSection, {
        [styles.landingSectionFixedBG]: props.fixedBg,
      })}
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
