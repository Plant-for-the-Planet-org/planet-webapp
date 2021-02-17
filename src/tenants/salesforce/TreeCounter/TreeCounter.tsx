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
              {props.title}
            </h2>
          )}
          {props.target ? (
            <>
            <h2 className={treeCounterStyles.countNumber} style={{marginTop:'24px'}}>
              {getFormattedNumber('en', Number(props.target))}
            </h2>
            <p className={treeCounterStyles.countLabel}>target</p>
            </>
          ): <></>}
        </div>
      </div>
    </div>
  );
}
