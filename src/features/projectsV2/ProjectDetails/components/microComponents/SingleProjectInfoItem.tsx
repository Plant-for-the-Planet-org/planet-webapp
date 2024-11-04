import React, { type ReactElement } from 'react';
import styles from '../../styles/ProjectInfo.module.scss';

interface Props {
  title: ReactElement | string;
  children: ReactElement;
}

const SingleProjectInfoItem = ({ title, children }: Props) => {
  return (
    <div className={styles.singleRowInfoContent}>
      {typeof title === 'string' ? (
        <h2 className={styles.singleRowInfoTitle}>{title}</h2>
      ) : (
        <div className={styles.singleRowInfoTitle}>{title}</div>
      )}
      {children}
    </div>
  );
};

export default SingleProjectInfoItem;
