import { useState, useRef, useEffect } from 'react';
import LayerInfoPopup from './LayerInfoPopup';
import SiteLayerInfo from './SiteLayerInfo';
import SiteLayerSelector from './SiteLayerSelector';
import styles from './SiteMapLayerControls.module.scss';
import { useProjectsMap } from '../../ProjectsMapContext';

const SiteMapLayerControls = () => {
  const [isLayerInfoOpen, setIsLayerInfoOpen] = useState(false);
  const { selectedSiteLayer } = useProjectsMap();
  const popupRef = useRef<HTMLDivElement>(null);

  if (!selectedSiteLayer) {
    return null;
  }

  useEffect(() => {
    const handleInteractionOutside = (event: MouseEvent | TouchEvent) => {
      if (
        isLayerInfoOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsLayerInfoOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isLayerInfoOpen) {
        setIsLayerInfoOpen(false);
      }
    };

    if (isLayerInfoOpen) {
      document.addEventListener('mousedown', handleInteractionOutside);
      document.addEventListener('touchstart', handleInteractionOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleInteractionOutside);
      document.removeEventListener('touchstart', handleInteractionOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLayerInfoOpen]);

  const closeLayerInfoPopup = () => {
    setIsLayerInfoOpen(false);
  };

  const openLayerInfoPopup = () => {
    setIsLayerInfoOpen(true);
  };

  return (
    <div className={styles.siteMapLayerControls}>
      {isLayerInfoOpen && (
        <LayerInfoPopup
          ref={popupRef}
          closePopup={closeLayerInfoPopup}
          selectedLayer={selectedSiteLayer}
        />
      )}
      <SiteLayerSelector />
      <SiteLayerInfo
        openInfoPopup={openLayerInfoPopup}
        selectedLayer={selectedSiteLayer}
      />
    </div>
  );
};

export default SiteMapLayerControls;
