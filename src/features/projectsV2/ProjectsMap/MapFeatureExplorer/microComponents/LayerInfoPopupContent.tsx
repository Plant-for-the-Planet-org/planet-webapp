import type {
  AdditionalInfo,
  ApiMapLayerOptionsType,
} from '../../../../../utils/mapsV2/mapSettings.config';
import type { SetState } from '../../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../MapFeatureExplorer.module.scss';

interface Props {
  layerKey: ApiMapLayerOptionsType;
  additionalInfo: AdditionalInfo | undefined;
  handleMouseLeave: () => void;
  setAnchorElement: SetState<HTMLDivElement | null>;
  anchorElement: HTMLDivElement | null;
}

const LayerInfoPopupContent = ({
  layerKey,
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
      onMouseLeave={handleMouseLeave}
    >
      {additionalInfo?.dataYears && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.labels.dataYears')}
          </p>
          <p>{tExplore(`additionalInfo.${layerKey}.dataYears`)}</p>
        </div>
      )}
      {additionalInfo?.resolution && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.labels.resolution')}
          </p>
          <p>{tExplore(`additionalInfo.${layerKey}.resolution`)}</p>
        </div>
      )}
      {additionalInfo?.description && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.labels.description')}
          </p>
          <p>{tExplore(`additionalInfo.${layerKey}.description`)}</p>
        </div>
      )}
      {additionalInfo?.underlyingData && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.labels.underlyingData')}
          </p>
          <p>{tExplore(`additionalInfo.${layerKey}.underlyingData`)}</p>
        </div>
      )}
      {additionalInfo?.source && (
        <div>
          <p className={styles.label}>
            {tExplore('additionalInfo.labels.source')}
          </p>
          <a
            href={tExplore(`additionalInfo.${layerKey}.source.url`)}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.source}
          >
            {tExplore(`additionalInfo.${layerKey}.source.text`)}
          </a>
        </div>
      )}
    </div>
  );
};

export default LayerInfoPopupContent;
