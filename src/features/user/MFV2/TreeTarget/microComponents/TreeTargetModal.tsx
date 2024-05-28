import TreeTargetPlantedTrees from '../../../../../../public/assets/images/icons/Mfv2/TreeTargetPlantedTrees';
import CustomTargetTextField from './CustomTargetTextField';
import CustomTargetSwitch from './CustomTargetSwitch';
import targetBarStyle from '../TreeTargetBar.module.scss';

const TreeTargetModal = () => {
  return (
    <div className={targetBarStyle.treeTargetModalMainContainer}>
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.treeTargetModalIconConatainer}>
            <TreeTargetPlantedTrees width={16} />
          </div>
          <div className={targetBarStyle.label}>Planted trees target</div>
        </div>
        <CustomTargetSwitch switchColor="#007A49" />
      </div>
      <CustomTargetTextField variant="outlined" focusColor="#007A49" />
    </div>
  );
};

export default TreeTargetModal;
