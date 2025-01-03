import type { AdditionalInfo } from './MapLayerControlPanel';
import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  additionalInfo: AdditionalInfo | undefined;
  handleMouseLeave: () => void;
  setAnchorEl: SetState<HTMLDivElement | null>;
  anchorEl: HTMLDivElement | null;
}

const LayerInfoPopupContent = ({
  additionalInfo,
  handleMouseLeave,
  setAnchorEl,
  anchorEl,
}: Props) => {
  const tMaps = useTranslations('Maps');
  return (
    <div
      className={styles.layerInfoPopupContainer}
      onMouseEnter={() => setAnchorEl(anchorEl)}
      onMouseLeave={handleMouseLeave}
    >
      {additionalInfo?.dataYears && (
        <div>
          <p className={styles.label}>{tMaps('layers.dataYears')}</p>
          <p>{additionalInfo?.dataYears}</p>
        </div>
      )}
      {additionalInfo?.resolution && (
        <div>
          <p className={styles.label}>{tMaps('layers.resolution')}</p>
          <p>~{additionalInfo?.resolution}</p>
        </div>
      )}
      {additionalInfo?.description && (
        <div>
          <p className={styles.label}>{tMaps('layers.description')}</p>
          <p>{additionalInfo.description}</p>
        </div>
      )}
      {additionalInfo?.underlyingData && (
        <div>
          <p className={styles.label}>{tMaps('layers.underlyingData')}</p>
          <p>{additionalInfo.underlyingData}</p>
        </div>
      )}
      {additionalInfo?.covariates && (
        <div>
          <p>{tMaps('layers.covariates')}</p>
          <a
            href={additionalInfo.source}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.source}
          >
            {additionalInfo.covariates}
          </a>
        </div>
      )}
    </div>
  );
};

export default LayerInfoPopupContent;
