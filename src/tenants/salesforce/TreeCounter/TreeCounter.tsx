import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';

export default function TpoProfile(props: any) {
  return (
    <div className={treeCounterStyles.treeCounter}>
      <div className={treeCounterStyles.backgroundCircle}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h3 className={treeCounterStyles.countNumber}>
            {Number(props.planted)} Million
          </h3>
          <h3 className={treeCounterStyles.countLabel}>
            Trees Supported by the Salesforce Community
          </h3>
        </div>
      </div>
    </div>
  );
}
