import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';

interface Props {
  planted: number;
}

export default function TpoProfile({ planted }: Props) {
  const estMillionTreesPlanted = Math.floor(planted / 1000000);
  const treeCounterValue = `${estMillionTreesPlanted} Million`;

  return (
    <div
      className={`${treeCounterStyles.treeCounter} ${
        estMillionTreesPlanted > 0 ? treeCounterStyles.treeCounterReady : ''
      }`}
    >
      <div className={treeCounterStyles.treeCounterDataField}>
        <div
          aria-label={treeCounterValue}
          role="heading"
          className={treeCounterStyles.treeCounterValue}
        >
          {treeCounterValue}
        </div>
      </div>
    </div>
  );
}
