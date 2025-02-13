import type { AdditionalInfo } from '../../../../../utils/mapsV2/mapSettings.config';
import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  additionalInfo: AdditionalInfo | undefined;
  handleMouseLeave: () => void;
  setAnchorElement: SetState<HTMLDivElement | null>;
  anchorElement: HTMLDivElement | null;
}

const LayerInfoPopupContent = ({
  additionalInfo,
  handleMouseLeave,
  setAnchorElement,
  anchorElement,
}: Props) => {
  const tExplore = useTranslations('Maps.exploreLayers');
  return (
    <div
      className={styles.layerInfoPopupContainer}
      onMouseEnter={(e) => {
        setAnchorElement(anchorElement);
        e.stopPropagation();
      }}
      onMouseLeave={() => setTimeout(handleMouseLeave, 500)}
    >
      {additionalInfo?.dataYears && (
        <div>
          <p className={styles.label}>{tExplore('additionalInfo.dataYears')}</p>
          <p>{additionalInfo?.dataYears}</p>
        </div>
      )}
      {additionalInfo?.resolution && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.resolution')}
          </p>
          <p>{additionalInfo?.resolution}</p>
        </div>
      )}
      {additionalInfo?.description && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.description')}
          </p>
          <p>{additionalInfo.description}</p>
        </div>
      )}
      {additionalInfo?.underlyingData && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.underlyingData')}
          </p>
          <p>{additionalInfo.underlyingData}</p>
        </div>
      )}
      {additionalInfo?.source && (
        <div>
          <p className={styles.label}>{tExplore('additionalInfo.source')}</p>
          <a
            href={additionalInfo.source.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.source}
          >
            {additionalInfo.source.text}
          </a>
        </div>
      )}
    </div>
  );
};

export default LayerInfoPopupContent;
