import React from 'react';
import styles from './LeaderBoard.module.scss';
import i18next from '../../../../i18n';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';
import LeaderboardLoader from '../../../features/common/ContentLoaders/LeaderboardLoader';

interface Props {
  leaderboard: any;
}

const { useTranslation } = i18next;
export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const { t, i18n, ready } = useTranslation(['leaderboard', 'common']);

  return ready ? (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>{t('leaderboard:forestFrontrunners')}</h2>
        <div className={styles.leaderBoardTable}>
          <div className={styles.leaderBoardTableHeader}>
            <button
              id={'LeaderBoardRecent'}
              onClick={() => setSelectedTab('recent')}
              className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {t('leaderboard:mostRecent')}
            </button>
            <button
              id="leaderBoardHighest"
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
                {leaderboardData.mostRecent.map((leader: any, index: any) => (
                  <div key={index} className={styles.leaderBoardBodyRow}>
                    <p className={styles.leaderBoardDonorName}>
                      {leader.donorName}
                    </p>
                    <p className={styles.leaderBoardDonorTrees}>
                      {getFormattedNumber(
                        i18n.language,
                        Number(leader.treeCount)
                      )}{' '}
                      {t('common:tree', { count: Number(leader.treeCount) })}
                    </p>
                    {/* <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p> */}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.leaderBoardBody}>
                {leaderboardData.mostDonated.map((leader: any, index: any) => (
                  <div key={index} className={styles.leaderBoardBodyRow}>
                    <p className={styles.leaderBoardDonorName}>
                      {leader.donorName}
                    </p>
                    <p className={styles.leaderBoardDonorTrees}>
                      {getFormattedNumber(
                        i18n.language,
                        Number(leader.treeCount)
                      )}{' '}
                      {t('common:tree', { count: Number(leader.treeCount) })}
                    </p>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
              <LeaderboardLoader />
            </>
          )}
        </div>
      </div>
      <img
        className={styles.leaderBoardBushImage}
        src="/tenants/planet/images/leaderboard/Person.svg"
        alt=""
      />
      <img
        className={styles.leaderBoardGroupTreeImage}
        src="/tenants/planet/images/leaderboard/Trees.svg"
        alt=""
      />
      {/* <img
        className={styles.leaderBoardBushImageMobile}
        src={'/tenants/salesforce/images/mobile/Bush.png'}
        alt=""
      /> */}
    </section>
  ) : null;
}
