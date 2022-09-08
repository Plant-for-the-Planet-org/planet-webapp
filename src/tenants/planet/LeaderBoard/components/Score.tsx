import React from 'react';
import styles from './LeaderBoard.module.scss';
import { useTranslation } from 'next-i18next';
import { getFormattedNumber } from '../../../../utils/getFormattedNumber';
import LeaderboardLoader from '../../../../features/common/ContentLoaders/LeaderboardLoader';
import MaterialTextField from '../../../../features/common/InputTypes/MaterialTextField';
import { getRequest, postRequest } from '../../../../utils/apiRequests/api';
import Link from 'next/link';
import getImageUrl from '../../../../utils/getImageURL';
import { Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import tenantConfig from '../../../../../tenant.config';
import SearchIcon from '../../../../../public/assets/images/icons/SearchIcon';
import getRandomImage from '../../../../utils/getRandomImage';
import Image from 'next/image';
import { ThemeContext } from '../../../../theme/themeContext';
import themeProperties from '../../../../theme/themeProperties';
import { ErrorHandlingContext } from '../../../../features/common/Layout/ErrorHandlingContext';

interface Props {
  leaderboard: any;
}
const config = tenantConfig();

export default function LeaderBoardSection(leaderboard: Props) {
  const [selectedTab, setSelectedTab] = React.useState('recent');
  const leaderboardData = leaderboard.leaderboard;
  const { t, i18n, ready } = useTranslation(['leaderboard', 'common']);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const [users, setUsers] = React.useState([]);

  const { theme } = React.useContext(ThemeContext);
  const useStylesAutoComplete = makeStyles({
    paper: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      fontFamily: config!.font.primaryFontFamily,
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
      '&:active': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
      fontSize: '14px',
      '& > span': {
        marginRight: 10,
        fontSize: 18,
      },
    },
  });
  const classes = useStylesAutoComplete();

  async function fetchUsers(query: any) {
    postRequest('/suggest.php', { q: query }, handleError).then((res) => {
      const result = res.filter((item) => item.type !== 'competition');
      setUsers(result);
    });
  }
  const imageErrorSrc =
    'https://cdn.planetapp.workers.dev/development/logo/svg/planet.svg';
  return ready ? (
    <section className={styles.leaderBoardSection}>
      <div className={styles.leaderBoard}>
        <h2>{t('leaderboard:forestFrontrunners')}</h2>

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
              {t('leaderboard:mostRecent')}
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
              {t('leaderboard:mostTrees')}
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
            ) : selectedTab === 'highest' ? (
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
            ) : (
              <div
                style={{
                  width: '300px',
                  marginTop: '24px',
                  marginBottom: '420px',
                }}
              >
                <Autocomplete
                  freeSolo
                  disableClearable
                  getOptionLabel={(option) => option.name}
                  options={users}
                  classes={{
                    option: classes.option,
                    paper: classes.paper,
                  }}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{ cursor: 'pointer', padding: '5px 5px' }}
                    >
                      <Link
                        prefetch={false}
                        href="/t/[id]"
                        as={`/t/${option.slug}`}
                      >
                        <div
                          className={styles.searchedUserCard}
                          // style={{ cursor: 'pointer', padding: '5px 0px' }}
                        >
                          {/* <Image
                      loader={myLoader}
                      src={getImageUrl('profile', 'avatar', option.image)}
                      alt={option.name}
                      width={26}
                      height={26}
                    /> */}
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
                      label={t('leaderboard:searchUser')}
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
  ) : null;
}
