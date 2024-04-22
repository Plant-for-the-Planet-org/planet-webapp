import style from './DiveIntoMap.module.scss';
import ShowMapButton from './ShowMapButton';

const MapPreview = () => {
  return (
    <div className={style.diveIntoMapMainContainer}>
      <ShowMapButton />
    </div>
  );
};

export default MapPreview;
