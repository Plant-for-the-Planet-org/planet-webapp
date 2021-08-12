import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import dynamic from 'next/dynamic';
import {
  getRequestWithoutRedirecting,
  getAuthenticatedRequestWithoutRedirecting,
} from '../../../../../utils/apiRequests/api';
import i18next from '../../../../../../i18n';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

const { useTranslation } = i18next;

interface Props {
  profile: any;
  authenticatedType: any;
  token: any;
}

export default function MyTrees({ profile, authenticatedType, token }: Props) {
  const { t, i18n, ready } = useTranslation(['country', 'me']);
  const [contributions, setContributions] = React.useState();

  React.useEffect(() => {
    async function loadFunction() {
      if (authenticatedType === 'private' && token) {
        getAuthenticatedRequestWithoutRedirecting(
          `/app/profile/contributions`,
          token
        )
          .then((result: any) => {
            setContributions(result);
          })
          .catch((e: any) => {
            console.log('error occured :', e);
          });
      } else {
        getRequestWithoutRedirecting(
          `/app/profiles/${profile.id}/contributions`
        )
          .then((result: any) => {
            setContributions(result);
          })
          .catch((e: any) => {
            console.log('error occured :', e);
          });
      }
    }
    loadFunction();
  }, [profile]);

  const MapProps = {
    contributions,
    authenticatedType,
  };
  
  return ready ? (
    <div className="profilePage">
      {contributions &&
      Array.isArray(contributions) &&
      contributions.length !== 0 ? (
        <>
          <div className={'profilePageTitle'}>
            {authenticatedType === 'private'
              ? t('me:myForest')
              : t('me:nameForest', { name: profile.displayName })}
          </div>
          <div className={styles.myTreesContainer}>
            <div className={styles.treesList}>
              {contributions.map((contribution: any) => {
                return <TreeList contribution={contribution} />;
              })}
            </div>
            <MyTreesMap {...MapProps} />
          </div>
        </>
      ) : null}
    </div>
  ) : null;
}

function TreeList({contribution}: any) {
  const date = formatDate(contribution.properties.plantDate);
  const { t, i18n, ready } = useTranslation(['country', 'me']);

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
