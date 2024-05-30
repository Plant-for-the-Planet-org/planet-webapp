import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import targetBarStyle from '../TreeTargetBar.module.scss';
import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';

const ConservAreaTarget = ({ handleOpen }) => {
  return (
    <div className={targetBarStyle.targetMainContainerConservArea}>
      <div className={targetBarStyle.targetSubContainer}>
        <button
          className={targetBarStyle.editTargetContainer}
          onClick={handleOpen}
        >
          <EditTargetIcon width={9} color={'rgba(45, 156, 219, 1)'} />
          <p className={targetBarStyle.conservTargetLabel}>Edit target</p>
        </button>
        <div className={targetBarStyle.statisticsContainer}>
          <div className={targetBarStyle.iconContainerConservArea}>
            <ConservedAreaTargetIcon width={13} />
          </div>
          <div className={targetBarStyle.targetStatisticsContainer}>
            <div className={targetBarStyle.stat}>
              34,001 of 50,000 m2 conserved
            </div>
            <div className={targetBarStyle.barContainer}>
              <div className={targetBarStyle.barSubContainerConservArea}>
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

export default ConservAreaTarget;
