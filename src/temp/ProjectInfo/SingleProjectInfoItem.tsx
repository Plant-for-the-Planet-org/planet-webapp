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
        {typeof title === 'string' ? (
          <h2 className={styles.singleRowInfoTitle}>{title}</h2>
        ) : (
          <div className={styles.singleRowInfoTitle}>{title}</div>
        )}
        {children}
      </div>
    </div>
  );
};

export default SingleProjectInfoItem;
