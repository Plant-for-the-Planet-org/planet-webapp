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
        getAuthenticatedRequestWithoutRedirecting(`/app/profiles/${profile.id}/contributions`, token)
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
            <div className={styles.treesList}>
              {contributions.map((item: any) => {
                return (
                  <div key={item.properties.id} className={styles.tree}>
                    <div className={styles.dateRow}>
                      {formatDate(item.properties.plantDate)}
                    </div>
                    <div className={styles.treeRow}>
                      <div className={styles.textCol}>
                        <div className={styles.title}>
                          {item.properties.type === 'registration'
                            ? t('me:registered')
                            : item.properties.project?.name}
                        </div>
                        <div className={styles.country}>
                          {item.properties.country
                            ? t(
                                'country:' +
                                  item.properties.country.toLowerCase()
                              )
                            : null}
                        </div>
                        {item.properties.type === 'gift' ? (
                          <div className={styles.source}>
                            {item.properties.giver.name
                              ? t('me:receivedFrom', {
                                  name: item.properties.giver.name,
                                })
                              : t('me:receivedTrees')}
                          </div>
                        ) : null}
                        {item.properties.type === 'redeem' ? (
                          <div className={styles.source}>
                            {t('me:redeemedTrees')}
                          </div>
                        ) : null}
                        {item.properties.type === 'donation' ? (
                          <div className={styles.source}>
                            {item.properties.recipient
                              ? t('me:giftToGiftee', {
                                  gifteeName: item.properties.recipient.name,
                                })
                              : null}
                          </div>
                        ) : null}
                      </div>
                      <div className={styles.numberCol}>
                        <div className={styles.treeIcon}>
                          <div
                            style={
                              item.properties.type === 'registration'
                                ? { color: '#3D67B1' }
                                : {}
                            }
                            className={styles.number}
                          >
                            {getFormattedNumber(
                              i18n.language,
                              Number(item.properties.treeCount)
                            )}
                          </div>
                          <div className={styles.icon}>
                            {item.properties.treeCount > 1 ? (
                              <TreesIcon
                                color={
                                  item.properties.type === 'registration'
                                    ? '#3D67B1'
                                    : null
                                }
                              />
                            ) : (
                              <TreeIcon
                                color={
                                  item.properties.type === 'registration'
                                    ? '#3D67B1'
                                    : null
                                }
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <MyTreesMap {...MapProps} />
          </div>
        </div>
      ) : null}
    </>
  ) : null;
}
