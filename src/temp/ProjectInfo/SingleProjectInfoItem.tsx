import React, { ReactElement } from 'react';
import styles from './ProjectInfo.module.scss';

interface Props {
  title: string;
  itemContent: ReactElement;
}

const SingleProjectInfoItem = ({ title, itemContent }: Props) => {
  return (
    <div className={styles.singleInfo}>
      <div className={styles.halfInfo}>
        <div className={styles.infoTitle}>{title}</div>
        {itemContent}
      </div>
    </div>
  );
};

export default SingleProjectInfoItem;
