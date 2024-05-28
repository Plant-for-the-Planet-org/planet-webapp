import ConservedAreaTargetIcon from '../../../../../../public/assets/images/icons/Mfv2/ConservAreaTargetIcon';
import CustomTargetSwitch from './CustomTargetSwitch';
import CustomTargetTextField from './CustomTargetTextField';
import targetBarStyle from '../TreeTargetBar.module.scss';

const ConservAreaTargetModal = () => {
  return (
    <div className={targetBarStyle.conservAreaTargetModalMainContainer}>
      <div className={targetBarStyle.switchMainContainer}>
        <div className={targetBarStyle.switchSubContainer}>
          <div className={targetBarStyle.conservAreaModalIconConatiner}>
            <ConservedAreaTargetIcon width={12} />
          </div>
          <div className={targetBarStyle.label}>Area conserved target</div>
        </div>
        <CustomTargetSwitch switchColor="rgba(45, 156, 219, 1)" />
      </div>
      <CustomTargetTextField
        variant="outlined"
        focusColor="rgba(45, 156, 219, 1)"
      />
    </div>
  );
};

export default ConservAreaTargetModal;
