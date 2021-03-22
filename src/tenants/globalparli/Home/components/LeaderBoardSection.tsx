import React from 'react';
import styles from './../styles/LeaderBoardSection.module.scss';
import i18next from '../../../../../i18n';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';

interface Props {
  leaderboard: any;
}

const { useTranslation } = i18next;
export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const { t, i18n, ready } = useTranslation(['leaderboard', 'common']);

  return ready ? (
    <div className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h3>Global Parli</h3>
        <h2>{t('leaderboard:forestFrontrunners')}</h2>
        <div className={styles.leaderBoardTable}>
          <div className={styles.leaderBoardTableHeader}>
            <button id={'leaderBoardSecRecent'}
              onClick={() => setSelectedTab('recent')}
              className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {t('leaderboard:mostRecent')}
            </button>
            <button id={'leaderBoardSecHighest'}
              onClick={() => setSelectedTab('highest')}
              className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {t('leaderboard:mostTrees')}
            </button>
          </div>
          {leaderboardData &&
            leaderboardData.mostRecent &&
            leaderboardData.mostDonated ? (
              selectedTab === 'recent' ? (
                <div className={styles.leaderBoardBody}>
                  {leaderboardData.mostRecent.map((leader: any, index: any) => {
                    return (
                      <div key={index} className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {getFormattedNumber(i18n.language, Number(leader.treeCount))} {t('common:tree', { count: Number(leader.treeCount) })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                  <div className={styles.leaderBoardBody}>
                    {leaderboardData.mostDonated.map((leader: any, index: any) => {
                      return (
                        <div key={index} className={styles.leaderBoardBodyRow}>
                          <p className={styles.leaderBoardDonorName}>
                            {leader.donorName}
                          </p>
                          <p className={styles.leaderBoardDonorTrees}>
                            {getFormattedNumber(i18n.language, Number(leader.treeCount))} {t('common:tree', { count: Number(leader.treeCount) })}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )
            ) : (
              <p>loading</p>
            )}
        </div>
      </div>
      <img
        className={styles.leaderBoardBushImage}
        src={'/tenants/salesforce/images/Bush.png'}
        alt=""
      />
      <img
        className={styles.leaderBoardBushImageMobile}
        src={'/tenants/salesforce/images/mobile/Bush.png'}
        alt=""
      />
    </div>
  ) : <></>;
}
