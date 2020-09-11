import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';

export default function TpoProfile(props: any) {
  return (
    <div className={treeCounterStyles.treeCounter}>
      <div className={treeCounterStyles.backgroundCircle}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <p className={treeCounterStyles.countNumber}>
            {Number(props.planted)} Million
          </p>
          <p className={treeCounterStyles.countLabel}>
            Trees Supported by the Salesforce Community
          </p>
        </div>
      </div>
    </div>
  );
}
