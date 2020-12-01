import React from 'react';
import styles from './LeaderBoard.module.scss';
import i18next from '../../../../../i18n';
import getFormattedNumber from '../../../../utils/getFormattedNumber';

interface Props {
  leaderboard: any;
}

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const { useTranslation } = i18next;
  const { t, i18n } = useTranslation(['leaderboard', 'common']);

  return (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>{t('leaderboard:forestFrontrunners')}</h2>
        <div className={styles.leaderBoardTable}>
          <div className={styles.leaderBoardTableHeader}>
            <div
              onClick={() => setSelectedTab('recent')}
              className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {t('leaderboard:mostRecent')}
            </div>
            <div
              onClick={() => setSelectedTab('highest')}
              className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {t('leaderboard:mostTrees')}
            </div>
          </div>
          {leaderboardData !== null
            && leaderboardData.mostRecent
            && leaderboardData.mostDonated ? (
              selectedTab === 'recent' ? (
                <div className={styles.leaderBoardBody}>
                  {leaderboardData.mostRecent.map((leader: any) => (
                    <div className={styles.leaderBoardBodyRow}>
                      <p className={styles.leaderBoardDonorName}>
                        {leader.donorName}
                      </p>
                      <p className={styles.leaderBoardDonorTrees}>
                        {getFormattedNumber(i18n.language, Number(leader.treeCount))}
                        {' '}
                        {t('common:trees')}
                      </p>
                      {/* <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p> */}
                    </div>
                  ))}
                </div>
              ) : (
                  <div className={styles.leaderBoardBody}>
                    {leaderboardData.mostDonated.map((leader: any) => (
                      <div className={styles.leaderBoardBodyRow}>
                        <p className={styles.leaderBoardDonorName}>
                          {leader.donorName}
                        </p>
                        <p className={styles.leaderBoardDonorTrees}>
                          {getFormattedNumber(i18n.language, Number(leader.treeCount))}
                          {' '}
                          {t('common:trees')}
                        </p>
                      </div>
                    ))}
                  </div>
                )
            ) : (
              <p>loading</p>
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
    </section>
  );
}
