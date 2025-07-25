import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { formatHid } from '../../../../../utils/projectV2';

interface Props {
  plHid: string | undefined;
  totalTreesCount: number;
  plantLocationAreaHectares: number;
}

const InterventionHeader = ({
  plHid,
  totalTreesCount,
  plantLocationAreaHectares,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  return (
    <div
      className={`plant-location-header-container ${styles.plantLocationHeaderContainer}`}
    >
      <div className={`tree-count ${styles.treeCount}`}>
        {tProjectDetails.rich('totalPlantedTrees', {
          count: totalTreesCount,
          formattedCount: localizedAbbreviatedNumber(
            locale,
            Number(totalTreesCount),
            1
          ),
          area:
            plantLocationAreaHectares > 0
              ? plantLocationAreaHectares.toFixed(3)
              : undefined,
          areaContainer: (chunks) => <span>{chunks}</span>,
        })}
      </div>
      <div className={`hid ${styles.hid}`}>{formatHid(plHid)}</div>
    </div>
  );
};

export default InterventionHeader;
