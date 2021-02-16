import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';

export default function TpoProfile(props: any) {
  return (
    <div className={treeCounterStyles.treeCounter}>
      <div className={treeCounterStyles.backgroundCircle}>
        <div className={treeCounterStyles.treeCounterDataField}>
          <h2 className={treeCounterStyles.countNumber}>
            {getFormattedNumber('en', Number(props.planted))}
          </h2>
          <h2 className={treeCounterStyles.countLabel}>
            Bäume. DerSAT.1 Waldwächst.
          </h2>
        </div>
      </div>
    </div>
  );
}
