import type { ReactElement } from 'react';

import React from 'react';
import MinusIcon from '../../../../../public/assets/images/icons/MinusIcon';
import PlusIcon from '../../../../../public/assets/images/icons/PlusIcon';
import styles from '../../styles/ZoomButtons.module.scss';
import { easeCubic } from 'd3-ease';

interface Props {
  map: any;
}

export default function ZoomButtons({ map }: Props): ReactElement {
  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1, {
      animate: true,
      duration: 1000,
      easing: easeCubic,
    });
  };
  const zoomOut = () => {
    map.setZoom(map.getZoom() - 1, {
      animate: true,
      duration: 1000,
      easing: easeCubic,
    });
  };
  return (
    <div className={styles.zoomButtons}>
      <div className={styles.zoomIn} onClick={zoomIn}>
        <PlusIcon />
      </div>
      <div className={styles.zoomOut} onClick={zoomOut}>
        <MinusIcon />
      </div>
    </div>
  );
}
