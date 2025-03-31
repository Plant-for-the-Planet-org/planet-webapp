import React from 'react';
import treeCounterStyles from './TreeCounter.module.scss';

interface Props {
  planted: number;
  isLight?: boolean;
  shouldShowMillions?: boolean;
}

export default function TreeCounter({
  planted,
  isLight = false,
  shouldShowMillions = false,
}: Props) {
  const estMillionTreesPlanted = Math.floor(planted / 1000000);
  const treeCounterValue = shouldShowMillions
    ? `${estMillionTreesPlanted} Million`
    : planted > 999999
    ? Math.floor(planted).toLocaleString()
    : Math.floor(planted).toString();
  return (
    <div
      className={`${treeCounterStyles.treeCounter} ${
        isLight ? treeCounterStyles.treeCounterLight : ''
      } ${
        (shouldShowMillions && estMillionTreesPlanted >= 0) ||
        (!shouldShowMillions && planted >= 0)
          ? treeCounterStyles.treeCounterReady
          : ''
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
