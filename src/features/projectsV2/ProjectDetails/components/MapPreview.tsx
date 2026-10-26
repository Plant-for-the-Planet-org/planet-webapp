import { useMobileViewModeStore } from '../../../../stores';
import styles from '../styles/MapPreview.module.scss';
import ShowMapButton from './microComponents/ShowMapButton';

const MapPreview = () => {
  const setSelectedMode = useMobileViewModeStore(
    (state) => state.setSelectedMode
  );

  return (
    <div className={styles.mapPreviewContainer}>
      <ShowMapButton handleMap={() => setSelectedMode('map')} />
    </div>
  );
};

export default MapPreview;
