import styles from '../../styles/PlantLocationInfo.module.scss';
import { formatHid } from '../../../../../utils/projectV2';
import { AllIntervention } from '../../../../../utils/constants/intervention';

interface Props {
  plHid: string | undefined;
  interventionType: string | undefined
}

const InterventionHeader = ({
  plHid,
  interventionType
}: Props) => {
  const findInterventionHeader = (valueKey: string | undefined) => {
    const found = AllIntervention.find(item => item.value === valueKey);
    return found ? found.label : '';
  };
  return (
    <div
      className={`plant-location-header-container ${styles.plantLocationHeaderContainer}`}
    >
      <div className={`tree-count ${styles.treeCount}`}>
         {findInterventionHeader(interventionType)}
      </div>
      <div className={`hid ${styles.hid}`}>{formatHid(plHid)}</div>
    </div>
  );
};

export default InterventionHeader;
