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
          {!props.hideText && (
            <h2 className={treeCounterStyles.countLabel}>
              trees supported by the Salesforce community through the projects on this platform
            </h2>
          )}

        </div>
      </div>
    </div>
  );
}
