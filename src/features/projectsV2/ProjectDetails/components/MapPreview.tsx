import { ViewMode } from '../../../common/Layout/ProjectsLayout/MobileProjectsLayout';
import { SetState } from '../../../common/types/common';
import style from '../styles/MapPreview.module.scss';
import ShowMapButton from './microComponents/ShowMapButton';

type MapPreviewProps = {
  setSelectedMode: SetState<ViewMode> | undefined;
};
const MapPreview = ({ setSelectedMode }: MapPreviewProps) => {
  return (
    <div className={style.mapPreviewContainer}>
      <ShowMapButton setSelectedMode={setSelectedMode} />
    </div>
  );
};

export default MapPreview;
