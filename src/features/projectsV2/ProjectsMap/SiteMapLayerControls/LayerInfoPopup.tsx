import type { LayerOption } from './SiteLayerOptions';

import { forwardRef } from 'react';
import CrossIcon from '../../../../../public/assets/images/icons/projectV2/CrossIcon';
import styles from './SiteMapLayerControls.module.scss';

interface LayerInfoPopupProps {
  closePopup: () => void;
  selectedLayer: LayerOption;
}

const LayerInfoPopup = forwardRef<HTMLDivElement, LayerInfoPopupProps>(
  ({ closePopup, selectedLayer }, ref) => {
    return (
      <div className={styles.layerInfoPopup} ref={ref}>
        <button
          className={styles.closeButton}
          type="button"
          onClick={closePopup}
        >
          <CrossIcon width={18} />
        </button>
        <div className={styles.popupContent}>
          <h2>{`${selectedLayer.label} Map`}</h2>
          <p>
            Areas where biomass has increased since the project begin appear in
            green. Areas where it has decreased substantially appear in red. No
            change appears white and mild decreases in grey.
          </p>{' '}
          <h3>Why the grey?</h3>
          <p>
            This is because restoration projects routinely experience a small
            decrease in biomass at the beginning of the restoration work. This
            is not necessarily a bad thing.
          </p>
          <p>
            For instance, when converting a degraded cattle ranch back to
            forest, a project might initially have to cut tall grass in order to
            plant small tree seedlings. It will take a few years before the
            biomass of the young trees exceeds the biomass of the removed grass.
          </p>{' '}
          <h3>Source</h3>{' '}
          <p>
            The change is biomass is calculated by a Plant-for-the-Planet
            analysis model based on satellite data.
          </p>
        </div>
      </div>
    );
  }
);

LayerInfoPopup.displayName = 'LayerInfoPopup';
export default LayerInfoPopup;
