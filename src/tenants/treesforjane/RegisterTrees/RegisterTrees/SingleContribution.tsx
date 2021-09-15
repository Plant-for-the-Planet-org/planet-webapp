import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import CancelIcon from '../../../../../public/assets/images/icons/CancelIcon';
import CheckCircle from '../../../../../public/assets/images/icons/CheckCircle';
import styles from '../RegisterModal.module.scss';
import UploadImages from './UploadImages';
import i18next from '../../../../../i18n';
import formatDate from '../../../../utils/countryCurrency/getFormattedDate';

interface Props {
  // token: any;
  // contributionGUID: any;
  contributionDetails: any;
  geometry: any;
  // slug: any;
}

const { useTranslation } = i18next;
const StaticMap = dynamic(() => import('./StaticMap'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function SingleContribution({
  // token,
  // contribution,
  // contributionGUID,
  // slug,
  contributionDetails,
  geometry,
}: Props): ReactElement {
  const router = useRouter();
  // const UploadProps = {
  //   contribution,
  //   contributionGUID,
  //   token,
  // };
  const { t, ready } = useTranslation(['me', 'common']);

  return ready ? (
    <div className={styles.donationsContainer}>
      <div className={styles.registerTreesPage}>
        {/* <button
        id={'singleControcloseButton'}
        className={styles.closeButton}
        onClick={() => {
          router.push(`/t/${slug}`, undefined, { shallow: true });
        }}
      >
        <CancelIcon />
      </button> */}
        {/* <div className={styles.checkMark}>
        <CheckCircle width="36px" color={`${styles.primaryColor}`} />
      </div> */}
        {/* <div className={styles.contributionInfo}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
        <div className={styles.previewMap}>
          <StaticMap geoJson={geometry} />
        </div>
        </div>
        </div>
      </div> */}
        <div>
          <h2 className={styles.contribTitle}>
            <b>
              {t('me:thankYouForPlanting', {
                treeCount: contributionDetails.treeCount,
                treeSpecies: contributionDetails.treeSpecies,
                plantDate: formatDate(contributionDetails.plantDate),
              })}
            </b>
          </h2>
          <p className={styles.contribDescription}>
            <b>
              {contributionDetails.treeCount > 0 &&
              contributionDetails.treeCount < 200
                ? t('me:contribSuccessLessThan200', {
                    treeCount: contributionDetails.treeCount,
                    treeSpecies: contributionDetails.treeSpecies,
                    plantDate: formatDate(contributionDetails.plantDate),
                  })
                : contributionDetails.treeCount >= 200 &&
                  contributionDetails.treeCount < 1000
                ? t('me:contribSuccess200to1000', {
                    treeCount: contributionDetails.treeCount,
                    treeSpecies: contributionDetails.treeSpecies,
                    plantDate: formatDate(contributionDetails.plantDate),
                    refId: contributionDetails.id,
                  })
                : contributionDetails.treeCount >= 1000
                ? t('me:contribSuccessMoreThan1000', {
                    treeCount: contributionDetails.treeCount,
                    treeSpecies: contributionDetails.treeSpecies,
                    plantDate: formatDate(contributionDetails.plantDate),
                  })
                : []}
            </b>
          </p>
          <div className={styles.contributionInfo}>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <div className={styles.previewMap}>
                  <StaticMap geoJson={geometry} />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{
              position: 'relative',
              paddingTop: '100%',
              marginTop: '20px',
              marginBottom: '30px',
            }}
          >
            <iframe
              src="https://iframe.videodelivery.net/bfac441938614b90e85251d11fbdf9b6?preload=true&autoplay=true"
              style={{
                border: 'none',
                position: 'absolute',
                top: 0,
                height: '100%',
                width: '100%',
                borderRadius: '10px',
              }}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen
            />
          </div>
          {/* <div className={styles.nextButton}>
        <button
          id={'singleControCont'}
          onClick={() =>
            router.push(`/t/${slug}`, undefined, { shallow: true })
          }
          className="primaryButton"
          style={{ maxWidth: '100px', marginTop: '24px' }}
        >
          {t('me:save')}
        </button>
      </div> */}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}
