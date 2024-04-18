import React from 'react';
import styles from './ProjectInfo.module.scss';

interface CertificationLabelProps {
  children: React.JSX.Element;
}

const CertificationLabel = ({ children }: CertificationLabelProps) => {
  return <div className={styles.certificationLabel}>{children}</div>;
};

export default CertificationLabel;
