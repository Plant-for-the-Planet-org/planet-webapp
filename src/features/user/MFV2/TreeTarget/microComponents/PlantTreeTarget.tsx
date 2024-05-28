import EditTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/EditTargetIcon';
import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import targetBarStyle from '../TreeTargetBar.module.scss';
import themeProperties from '../../../../../theme/themeProperties';

const PlantTreeTarget = ({ handleOpen }) => {
  return (
    <div className={targetBarStyle.targetMainContainerTreeTarget}>
      <div className={targetBarStyle.targetSubContainer}>
        <button
          className={targetBarStyle.editTargetContainer}
          onClick={handleOpen}
        >
          <EditTargetIcon width={9} color={themeProperties.primaryDarkColor} />
          <p className={targetBarStyle.treeTargetLabel}>Edit Target</p>
        </button>
        <div className={targetBarStyle.StatisticsContainer}>
          <div className={targetBarStyle.iconContainerTreeTarget}>
            <TreeTargetPlantedTrees width={19} />
          </div>
          <div className={targetBarStyle.targetStatisticsContainer}>
            <div className={targetBarStyle.stat}>146 of 200 trees planted</div>
            <div className={targetBarStyle.barContainer}>
              <div className={targetBarStyle.barSubContainerTreeTarget}>
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

export default PlantTreeTarget;
