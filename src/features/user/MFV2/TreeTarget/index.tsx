import ConservAreaTarget from './microComponents/ConservAreaTarget';
import PlantTreeTarget from './microComponents/PlantTreeTarget';
import RestoreAreaTarget from './microComponents/RestoreTreeTarget';
import targetBarStyle from './TreeTargetBar.module.scss';

const TreeTarget = () => {
  return (
    <div className={targetBarStyle.targetMainContainer}>
      <PlantTreeTarget />
      <RestoreAreaTarget />
      <ConservAreaTarget />
    </div>
  );
};

export default TreeTarget;
