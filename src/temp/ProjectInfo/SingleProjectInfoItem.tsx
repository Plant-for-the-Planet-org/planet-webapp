import React, { ReactElement } from 'react';
import styles from './ProjectInfo.module.scss';

interface Props {
  title: ReactElement | string;
  children: ReactElement;
}

const SingleProjectInfoItem = ({ title, children }: Props) => {
  return (
    <div className={styles.singleRowInfoContainer}>
      <div className={styles.singleRowInfoContent}>
        <div className={styles.singleRowInfoTitle}>{title}</div>
        {children}
      </div>
    </div>
  );
};

export default SingleProjectInfoItem;
