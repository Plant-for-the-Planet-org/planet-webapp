import style from '../styles/MapPreview.module.scss';
import ShowMapButton from './microComponents/ShowMapButton';

type MapPreviewProps = {
  handleMap: () => void;
};
const MapPreview = ({ handleMap }: MapPreviewProps) => {
  return (
    <div className={style.mapPreviewContainer}>
      <ShowMapButton handleMap={handleMap} />
    </div>
  );
};

export default MapPreview;
