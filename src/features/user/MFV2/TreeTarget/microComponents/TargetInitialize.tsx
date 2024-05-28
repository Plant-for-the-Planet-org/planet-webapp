import targetBarStyle from '../TreeTargetBar.module.scss';

const TargetInitialize = ({ handleOpen }) => {
  return (
    <div className={targetBarStyle.targetInitializeMainContainer}>
      <div className={targetBarStyle.setTargetLabel}>
        Set targets for planted trees, area conserved, and area restored
      </div>
      <button className={targetBarStyle.setTargetButton} onClick={handleOpen}>
        Set target
      </button>
    </div>
  );
};

export default TargetInitialize;
