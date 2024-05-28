import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';

const RestoreTreeTargetModal = () => {
  return (
    <div className={targetBarStyle.restoreTreeTargetModalMainContainer}>
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.restoreTreeModalIconContainer}>
            <RestoredTreeTargetIcon width={14} />
          </div>
          <div className={targetBarStyle.label}>Area restored target</div>
        </div>
        <CustomTargetSwitch switchColor="#9B51E0" />
      </div>
      <CustomTargetTextField variant="outlined" focusColor="#9B51E0" />
    </div>
  );
};

export default RestoreTreeTargetModal;
