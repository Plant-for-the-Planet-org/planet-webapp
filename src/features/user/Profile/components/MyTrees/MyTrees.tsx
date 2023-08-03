import React from 'react';
import styles from '../../styles/MyTrees.module.scss';
import dynamic from 'next/dynamic';
import {
  getAuthenticatedRequest,
  getRequest,
} from '../../../../../utils/apiRequests/api';
import { useTranslation } from 'next-i18next';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import { ErrorHandlingContext } from '../../../../common/Layout/ErrorHandlingContext';
import { handleError, APIError } from '@planet-sdk/common';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { t, ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();
  const { setErrors, redirect } = React.useContext(ErrorHandlingContext);
  const { logoutUser } = useUserProps();

  React.useEffect(() => {
    async function loadFunction() {
      if (authenticatedType === 'private' && token) {
        try {
          const result = await getAuthenticatedRequest(
            `/app/profile/contributions`,
            token,
            logoutUser
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/profile');
        }
      } else {
        try {
          const result = await getRequest(
            `/app/profiles/${profile.id}/contributions`
          );
          setContributions(result);
        } catch (err) {
          setErrors(handleError(err as APIError));
        }
      }
    }
    loadFunction();
  }, [profile]);

  const MapProps = {
    contributions,
    authenticatedType,
  };

  return contributions?.length > 0 && ready ? (
    <div
      className={authenticatedType === 'private' ? 'profilePage' : ''}
      style={{ marginTop: '0px' }}
    >
      {contributions &&
      Array.isArray(contributions) &&
      contributions.length !== 0 ? (
        <>
          <div
            className={styles.myTreesSection}
            style={{ paddingBottom: '80px' }}
          >
            <div
              className={
                authenticatedType === 'private'
                  ? 'profilePageTitle'
                  : styles.myTreesTitle
              }
            >
              {authenticatedType === 'private'
                ? t('me:myForest')
                : t('me:nameForest', { name: profile.displayName })}
            </div>
            <div className={styles.MyTreesLegend}>
              <div className={styles.donatedTrees}>
                <TreesIcon color="currentColor" />
                <p>{t('me:donatedTrees')}</p>
              </div>
              <div className={styles.registeredTrees}>
                <TreesIcon color="currentColor" />
                <p>{t('me:registeredTrees')}</p>
              </div>
            </div>
            <div className={styles.myTreesContainer}>
              <div className={styles.treesList}>
                {contributions.map((contribution: any, index: any) => {
                  return <TreeList key={index} contribution={contribution} />;
                })}
              </div>
              <MyTreesMap {...MapProps} />
            </div>
          </div>
        </>
      ) : null}
    </div>
  ) : null;
}

function TreeList({ contribution }: any) {
  const date = formatDate(contribution.properties.plantDate);
  const { t, i18n } = useTranslation(['country', 'me']);

  return (
    <div key={contribution.properties.id} className={styles.tree}>
      <div className={styles.dateRow}>{date}</div>
      <div className={styles.treeRow}>
        <div className={styles.textCol}>
          <div className={styles.title}>
            {contribution.properties.type === 'registration'
              ? t('me:registered')
              : contribution.properties.project?.name}
          </div>
          <div className={styles.country}>
            {contribution.properties.country
              ? t('country:' + contribution.properties.country.toLowerCase())
              : null}
          </div>
          {contribution.properties.type === 'gift' ? (
            <div className={styles.source}>
              {contribution.properties.giver.name
                ? t('me:receivedFrom', {
                    name: contribution.properties.giver.name,
                  })
                : t('me:receivedTrees')}
            </div>
          ) : null}
          {contribution.properties.type === 'redeem' ? (
            <div className={styles.source}>{t('me:redeemedTrees')}</div>
          ) : null}
          {contribution.properties.type === 'donation' ? (
            <div className={styles.source}>
              {contribution.properties.recipient
                ? t('me:giftToGiftee', {
                    gifteeName: contribution.properties.recipient.name,
                  })
                : null}
            </div>
          ) : null}
        </div>
        <div className={styles.numberCol}>
          <div className={styles.treeIcon}>
            <div
              style={
                contribution.properties.type === 'registration'
                  ? { color: '#3D67B1' }
                  : {}
              }
              className={styles.number}
            >
              {getFormattedNumber(
                i18n.language,
                Number(contribution.properties.treeCount)
              )}
            </div>
            {contribution.properties.treeCount > 1 ? (
              <TreesIcon
                color={
                  contribution.properties.type === 'registration'
                    ? '#3D67B1'
                    : null
                }
              />
            ) : (
              <TreeIcon
                color={
                  contribution.properties.type === 'registration'
                    ? '#3D67B1'
                    : null
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
