import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import dynamic from 'next/dynamic';
import { getRequestWithoutRedirecting } from '../../../../../utils/apiRequests/api';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import i18next from '../../../../../../i18n';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

const { useTranslation } = i18next;

interface Props {
  profile: any;
}

export default function MyTrees({ profile }: Props): ReactElement {
  const { t } = useTranslation(['common', 'country']);
  const [contributions, setContributions] = React.useState();
  React.useEffect(() => {
    async function loadFunction() {
      getRequestWithoutRedirecting(`/app/profiles/${profile.id}/contributions`)
        .then((result: any) => {
          setContributions(result);
        })
        .catch((e: any) => {
          console.log('error occured :', e);
        });
    }
    loadFunction();
  }, []);

  const MapProps = {
    contributions,
  };
  return (
    <>
      {contributions ? (
        <div className={styles.myTreesSection}>
          <div className={styles.myTreesTitle}>{t('me:myForest')}</div>

          <div className={styles.myTreesContainer}>
            <div className={styles.treesList}>
              {Array.isArray(contributions) && contributions.length !== 0
                ? contributions.map((item: any) => {
                    return (
                      <div className={styles.tree}>
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
                                {t('me:receivedTrees')}
                              </div>
                            ) : null}
                            {item.properties.type === 'redeem' ? (
                              <div className={styles.source}>
                                {t('me:redeemedTrees')}
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
                                {item.properties.treeCount}
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
                  })
                : 'No Contributions Yet'}
            </div>
            <MyTreesMap {...MapProps} />
          </div>
        </div>
      ) : null}
    </>
  );
}
