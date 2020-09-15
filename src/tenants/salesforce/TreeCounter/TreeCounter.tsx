import React from 'react';
import Sugar from 'sugar';
import treeCounterStyles from './TreeCounter.module.scss';

export default function TpoProfile(props: any) {
  return (
    <div className={treeCounterStyles.treeCounter}>
      <div className={treeCounterStyles.backgroundCircle}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h2 className={treeCounterStyles.countNumber}>
            {Sugar.Number.format(Number(props.planted))}
          </h2>
          <h2 className={treeCounterStyles.countLabel}>
            Trees Supported by the Salesforce Community
          </h2>
        </div>
      </div>
    </div>
  );
}
