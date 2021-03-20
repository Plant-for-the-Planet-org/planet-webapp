import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import dynamic from 'next/dynamic';
import {
  getRequestWithoutRedirecting,
  getAuthenticatedRequestWithoutRedirecting
} from '../../../../../utils/apiRequests/api';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';
import i18next from '../../../../../../i18n';

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
      if (token) {
        getAuthenticatedRequestWithoutRedirecting(`/app/profile/contributions`, token)
          .then((result: any) => {
            setContributions(result);
          })
          .catch((e: any) => {
            console.log('error occured :', e);
          });
      } else {
        getRequestWithoutRedirecting(`/app/profiles/${profile.id}/contributions`)
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
  };
  return ready ? (
    <>
      {contributions &&
        Array.isArray(contributions) &&
        contributions.length !== 0 ? (
        <div className={styles.myTreesSection}>
          <div className={styles.myTreesTitle}>
            {authenticatedType === 'private'
              ? t('me:myForest')
              : t('me:nameForest', { name: profile.displayName })}
          </div>
          <div className={styles.myTreesContainer}>

            <MyTreesMap {...MapProps} />
          </div>
        </div>
      ) : null}
    </>
  ) : null;
}
