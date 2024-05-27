import RestoredTreeTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/RestoredTreeTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';

const RestoreAreaTarget = () => {
  return (
    <div className={targetBarStyle.targetMainContainerRestoreArea}>
      <div className={targetBarStyle.targetSubContainer}>
        <div className={targetBarStyle.editTargetContainer}>
          <EditTargetIcon width={9} color={'rgba(155, 81, 224, 1)'} />
          <p className={targetBarStyle.restoreTargetLabel}>Edit Target</p>
        </div>
        <div className={targetBarStyle.StatisticsContainer}>
          <div className={targetBarStyle.iconContainerRestoreArea}>
            <RestoredTreeTargetIcon width={17} />
          </div>
          <div className={targetBarStyle.targetStatisticsContainer}>
            <div className={targetBarStyle.stat}>
              34,001 of 50,000 m2 restored
            </div>
            <div className={targetBarStyle.barContainer}>
              <div className={targetBarStyle.barSubContainerRestoreArea}>
                <div />
                <div />
              </div>
              <div>60%</div>
            </div>
            <div className={targetBarStyle.communityReceived}>
              27 from our community
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestoreAreaTarget;
