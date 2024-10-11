import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { formatHid } from '../../../../../utils/projectV2';

interface Props {
  plHid: string | undefined;
  totalTreesCount: number;
  plantedLocationArea: number | null;
}

const PlantLocationHeader = ({
  plHid,
  totalTreesCount,
  plantedLocationArea,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  return (
    <div className={styles.plantLocationHeaderContainer}>
      <div className={styles.treeCount}>
        {tProjectDetails.rich('totalPlantedSpecies', {
          count: totalTreesCount,
          formattedCount: localizedAbbreviatedNumber(
            locale,
            Number(totalTreesCount),
            1
          ),
          area: plantedLocationArea?.toFixed(3),
          areaContainer: (chunks) => <span>{chunks}</span>,
        })}
      </div>
      <div className={styles.hid}>{formatHid(plHid)}</div>
    </div>
  );
};

export default PlantLocationHeader;
