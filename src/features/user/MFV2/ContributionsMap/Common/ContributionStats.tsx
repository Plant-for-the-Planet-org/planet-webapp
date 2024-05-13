import CountryStatIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/statsIcon/CountryStatIcon';
import DonationStatIcon from '../../../../../../public/assets/images/icons/myForestV2Icons/statsIcon/DonationStat';
import { contributionStats } from '../../../../../utils/myForestV2Utils';
import style from '../Common/common.module.scss';

const SelectIconForContributionStats = ({
  stat,
}: {
  stat: string;
}): JSX.Element => {
  switch (stat) {
    case 'Countries':
      return <CountryStatIcon />;
    case 'Projects':
    case 'Donation':
      return <DonationStatIcon />;
    default:
      return <></>;
  }
};

const ContributionStats = () => {
  return (
    <div className={style.contributionStatsContainer}>
      {contributionStats.map((singleStat, key) => {
        return (
          <div className={style.statContainer} key={key}>
            <div className={style.statsIconContainer}>
              <SelectIconForContributionStats stat={singleStat.stat} />
            </div>
            <div
              className={style.stats}
            >{`${singleStat.value} ${singleStat.stat}`}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ContributionStats;
