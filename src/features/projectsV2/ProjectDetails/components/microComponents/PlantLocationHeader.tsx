import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';

interface Props {
  plHid: string | undefined;
  totalTreesCount: number;
  plantedLocationArea: number;
}

const PlantLocationHeader = ({
  plHid,
  totalTreesCount,
  plantedLocationArea,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  const formattedHid = plHid ? plHid.slice(0, 3) + '-' + plHid.slice(3) : null;
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
          area: plantedLocationArea.toFixed(3),
          areaContainer: (chunks) => <span>{chunks}</span>,
        })}
      </div>
      <div className={styles.hid}>{formattedHid}</div>
    </div>
  );
};

export default PlantLocationHeader;
