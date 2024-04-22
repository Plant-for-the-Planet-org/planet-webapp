import style from './MapPreview.module.scss';
import ShowMapButton from './ShowMapButton';

const MapPreview = () => {
  return (
    <div className={style.mapPreviewContainer}>
      <ShowMapButton />
    </div>
  );
};

export default MapPreview;
