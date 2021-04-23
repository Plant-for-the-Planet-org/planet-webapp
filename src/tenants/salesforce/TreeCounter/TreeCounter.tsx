import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';

export default function TpoProfile(props: any) {
  return (
    <div className={`${treeCounterStyles.treeCounter} ${props.planted > 0 ? treeCounterStyles.treeCounterReady : ''}`}>
      <div className={treeCounterStyles.treeCounterDataField}>
        <span aria-label={props.planted} role="heading">
          {String(getFormattedNumber('en', Number(props.planted))).padStart(11, "0").split("").map(function(char, index){
            return <span aria-hidden="true" key={`planted-${index}`} className={char === ',' ? treeCounterStyles.treeCounterComma : treeCounterStyles.treeCounterNumber}>{char}</span>;
          })}
        </span>
      </div>
    </div>
  );
}
