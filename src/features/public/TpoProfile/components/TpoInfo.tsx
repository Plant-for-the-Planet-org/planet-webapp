import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Layout from '../../../common/Layout';
import styles from '../styles/TpoInfo.module.scss';
import TreeCounter from '../../../common/TreeCounter/TreeCounter';

export default function TpoInfo({ tpoprofile }: any) {
  console.log('tpoprofile', tpoprofile)
  return (
    <div className={styles.landingContent}>
      <TreeCounter
        target={tpoprofile.countTarget}
        planted={tpoprofile.countPlanted}
      />

      <h2 className={styles.tpoName}>
        {tpoprofile.displayName}
      </h2>

      {/* tpo description */}
      <p className={styles.tpoDescription}>
        {tpoprofile.userProfile.synopsis1 ? tpoprofile.userProfile.synopsis1 : ""}
      </p>
    </div>
  );
}
