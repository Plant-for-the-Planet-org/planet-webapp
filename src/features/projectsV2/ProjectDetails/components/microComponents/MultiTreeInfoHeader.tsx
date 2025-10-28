import { localizedAbbreviatedNumber } from '../../../../../utils/getFormattedNumber';
import styles from '../../styles/InterventionInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { formatHid } from '../../../../../utils/projectV2';
import { clsx } from 'clsx';

interface Props {
  hid: string | undefined;
  totalTreesCount: number;
  hectaresCovered: number;
}

const MultiTreeInfoHeader = ({
  hid,
  totalTreesCount,
  hectaresCovered,
}: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();
  return (
    <div
      className={clsx(
        'intervention-header-container',
        styles.interventionHeaderContainer
      )}
    >
      <div className={clsx('tree-count', styles.treeCount)}>
        {tProjectDetails.rich('totalPlantedTrees', {
          count: totalTreesCount,
          formattedCount: localizedAbbreviatedNumber(
            locale,
            Number(totalTreesCount),
            1
          ),
          area: hectaresCovered > 0 ? hectaresCovered.toFixed(3) : undefined,
          areaContainer: (chunks) => <span>{chunks}</span>,
        })}
      </div>
      <div className={clsx('hid', styles.hid)}>{formatHid(hid)}</div>
    </div>
  );
};

export default MultiTreeInfoHeader;
