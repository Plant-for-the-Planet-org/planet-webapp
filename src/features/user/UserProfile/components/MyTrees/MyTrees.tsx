import React, { ReactElement } from 'react';
import styles from '../../styles/MyTrees.module.scss';
import dynamic from 'next/dynamic';
import { getRequestWithoutRedirecting } from '../../../../../utils/apiRequests/api';
import TreeIcon from '../../../../../../public/assets/images/icons/TreeIcon';
import TreesIcon from '../../../../../../public/assets/images/icons/TreesIcon';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { getFormattedNumber } from '../../../../../utils/getFormattedNumber';
import i18next from '../../../../../../i18n';
import BackButton from '../../../../../../public/assets/images/icons/BackButton';
import ProjectContactDetails from '../../../../projects/components/projectDetails/ProjectContactDetails';
import DownloadIcon from '../../../../../../public/assets/images/icons/DownloadIcon';
import SendIcon from '../../../../../../public/assets/images/icons/SendIcon';
import { useRouter } from 'next/router';

const MyTreesMap = dynamic(() => import('./MyTreesMap'), {
  loading: () => <p>loading</p>,
});

const { useTranslation } = i18next;

interface Props {
  profile: any;
  authenticatedType: any;
  isAuthenticated: any;
}

const project = {
  id: 'proj_6D2v791pcqVIE6qYcBkdmaXu',
  location: 'Moffat, Dumfriesshire',
  name: 'Talla & Gameshope, Tweedsmuir, Scotland',
  slug: 'talla-gameshope-tweedsmuir-scotland',
  tpo: {
    id: 'tpo_6CjTMsBqdVKNbZKq5hlGBLji',
    name: 'Natural Capital Partners',
    email: 'rfay@naturalcapitalpartners.com',
    address: {
      address: '300 West Coleman Boulevard',
      city: 'Mount Pleasant',
      zipCode: '29464',
      country: 'US',
    },
    slug: 'natural-capital-partners',
  },
  website: 'naturalcapitalpartners.com',
};

export default function MyTrees({
  profile,
  authenticatedType,
  isAuthenticated,
}: Props) {
  const router = useRouter();
  const { t, i18n, ready } = useTranslation(['country', 'me', 'donate']);
  const [contributions, setContributions] = React.useState(null);
  const [expandedContribution, setExpandedContribution] = React.useState();
  React.useEffect(() => {
    async function loadFunction() {
      getRequestWithoutRedirecting(`/app/profiles/${profile.id}/contributions`)
        .then((result: any) => {
          setContributions(result);
          console.log(contributions);
        })
        .catch((e: any) => {
          console.log('error occured :', e);
        });
    }
    loadFunction();
  }, [profile]);

  const handleViewContribution = (id: any) => {
    setExpandedContribution(id);
  };

  const handleProfileRedirect = (id: any) => {
    router.push('/t/[id]', `/t/${id}`);
  };
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
                {isAuthenticated && expandedContribution ?
                  contributions.map((item: any) => {
                    return (
                      expandedContribution === item.properties.id ? (
                        <div className={styles.tree}>

                          <div className={styles.singleContribution}>
                            <div
                              onClick={() => setExpandedContribution(null)}
                              className={styles.backButton}
                            >
                              <BackButton />
                            </div>
                            <div className={styles.singleDate}>
                              {formatDate(item.properties.plantDate)}
                            </div>
                            <div className={styles.singleTreeCount}>
                              {`${getFormattedNumber(
                                i18n.language,
                                Number(item.properties.treeCount)
                              )} ${item.properties.type === 'gift' ? 'Tree Gift' : ''
                                }${item.properties.type === 'donation'
                                  ? 'Tree Donation'
                                  : ''
                                }${item.properties.type === 'registration'
                                  ? 'Tree Registration'
                                  : ''
                                }`}
                            </div>
                            <div className={styles.plantedBy}>
                              {`Planted by ${item.properties.type === 'registration'
                                ? 'User'
                                : item.properties.project.owner.name
                                }`}
                            </div>
                            {item.properties.type === 'gift' ? (
                              item.properties.giver ? (
                                <div className={styles.singleSource}>
                                  From{' '}
                                  <a
                                    onClick={() =>
                                      handleProfileRedirect(
                                        item.properties.giver.slug
                                      )
                                    }
                                  >
                                    {item.properties.giver.name}
                                  </a>
                                </div>
                              ) : (
                                  ''
                                )
                            ) : (
                                ''
                              )}
                            {item.properties.type === 'donation' ? (
                              item.properties.recipient ? (
                                <div className={styles.singleSource}>
                                  To{' '}
                                  <a
                                    onClick={() =>
                                      handleProfileRedirect(
                                        item.properties.recipient.slug
                                      )
                                    }
                                  >
                                    {item.properties.recipient.name}
                                  </a>
                                </div>
                              ) : (
                                  ''
                                )
                            ) : (
                                ''
                              )}

                            <div className={styles.projectDetails}>
                              <div>{item.properties.project.name}</div>
                              <ProjectContactDetails project={project} />
                            </div>
                            {isAuthenticated ? (
                              <div className={styles.buttons}>
                                <div className={styles.certificate}>
                                  <DownloadIcon />
                                  <p>Certificate</p>
                                </div>
                                <div className={styles.share}>
                                  <SendIcon />
                                  <p>Share</p>
                                </div>
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
                        </div>
                      ) : null
                    )
                  }) :
                  contributions.map((item: any) => {
                    return (
                      <div className={styles.tree}>
                        <div className={styles.dateRow}>
                          {formatDate(item.properties.plantDate)}
                        </div>
                        <div
                          onClick={() =>
                            handleViewContribution(item.properties.id)
                          }
                          className={styles.treeRow}
                        >
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
                                    gifteeName:
                                      item.properties.recipient.name,
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
                    )
                  })}
              </div>
              <MyTreesMap {...MapProps} />
            </div>
          </div>
        ) : null}
    </>
  ) : null;
}
