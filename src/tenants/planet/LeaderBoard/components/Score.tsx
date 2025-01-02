import React from 'react';
import styles from './LeaderBoard.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import LeaderboardLoader from '../../../../features/common/ContentLoaders/LeaderboardLoader';
import MaterialTextField from '../../../../features/common/InputTypes/MaterialTextField';
import { postRequest } from '../../../../utils/apiRequests/api';
import Link from 'next/link';
import getImageUrl from '../../../../utils/getImageURL';

import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import getRandomImage from '../../../../utils/getRandomImage';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { MuiAutoComplete } from '../../../../features/common/InputTypes/MuiAutoComplete';
import { useTenant } from '../../../../features/common/Layout/TenantContext';

interface Props {
  leaderboard: any;
}

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const tLeaderboard = useTranslations('Leaderboard');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const { setErrors } = React.useContext(ErrorHandlingContext);
  const [users, setUsers] = React.useState([]);
  const { tenantConfig } = useTenant();
  const fetchUsers = async (query: any) => {
    try {
      const res = await postRequest({
        tenant: tenantConfig?.id,
        url: '/suggest.php',
        data: {
          q: query,
        },
      });
      const result = res.filter((item) => item.type !== 'competition');
      setUsers(result);
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  };

  return (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>{tLeaderboard('forestFrontrunners')}</h2>

        <div className={styles.leaderBoardTable}>
          <div className={styles.leaderBoardTableHeader}>
            <button
              id={'scoreTabRecent'}
              onClick={() => setSelectedTab('recent')}
              className={
                selectedTab === 'recent'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {tLeaderboard('mostRecent')}
            </button>
            <button
              id={'scoreHighest'}
              onClick={() => setSelectedTab('highest')}
              className={
                selectedTab === 'highest'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              {tLeaderboard('mostTrees')}
            </button>
            <button
              id={'searchIconScore'}
              onClick={() => setSelectedTab('search')}
              className={
                selectedTab === 'search'
                  ? styles.leaderBoardTableHeaderTitleSelected
                  : styles.leaderBoardTableHeaderTitle
              }
            >
              <SearchIcon />
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
                      {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                      {tCommon('tree', { count: Number(leader.treeCount) })}
                    </p>
                    {/* <p className={styles.leaderBoardDonorTime}>
                          {leader.created}
                        </p> */}
                  </div>
                ))}
              </div>
            ) : selectedTab === 'highest' ? (
              <div className={styles.leaderBoardBody}>
                {leaderboardData.mostDonated.map((leader: any, index: any) => (
                  <div key={index} className={styles.leaderBoardBodyRow}>
                    <p className={styles.leaderBoardDonorName}>
                      {leader.donorName}
                    </p>
                    <p className={styles.leaderBoardDonorTrees}>
                      {getFormattedNumber(locale, Number(leader.treeCount))}{' '}
                      {tCommon('tree', { count: Number(leader.treeCount) })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  width: '300px',
                  marginTop: '24px',
                  marginBottom: '420px',
                }}
              >
                <MuiAutoComplete
                  freeSolo
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  options={users}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{ cursor: 'pointer', padding: '5px 5px' }}
                    >
                      <Link
                        prefetch={false}
                        href="/t/[id]"
                        as={`/t/${option.slug}`}
                        className={styles['autocomplete-option']}
                      >
                        <div
                          className={styles.searchedUserCard}
                          // style={{ cursor: 'pointer', padding: '5px 0px' }}
                        >
                          <img
                            src={getImageUrl('profile', 'avatar', option.image)}
                            onError={(e) => (
                              (e.target.onerror = null),
                              (e.target.src = getRandomImage(option.name))
                            )}
                            height="26px"
                            width="26px"
                            style={{ borderRadius: '40px' }}
                          />
                          <span>{option.name}</span>
                        </div>
                      </Link>
                    </li>
                  )}
                  renderInput={(params) => (
                    <MaterialTextField
                      {...params}
                      label={tLeaderboard('searchUser')}
                      variant="outlined"
                      name="searchUser"
                      onChange={(e) => {
                        if (e.target.value.length > 2) {
                          fetchUsers(e.target.value);
                        }
                      }}
                      InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                  )}
                />
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
    </section>
  );
}
