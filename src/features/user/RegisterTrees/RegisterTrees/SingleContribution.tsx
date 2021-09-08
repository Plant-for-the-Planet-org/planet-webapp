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
  token: any;
  contributionGUID: any;
  contribution: any;
  slug: any;
}

const { useTranslation } = i18next;
const StaticMap = dynamic(() => import('./StaticMap'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function SingleContribution({
  token,
  contribution,
  contributionGUID,
  slug,
}: Props): ReactElement {
  const router = useRouter();
  const UploadProps = {
    contribution,
    contributionGUID,
    token,
  };
  const { t, ready } = useTranslation(['me', 'common']);

  return ready ? (
    <>
      <div className={styles.checkMark}>
        <CheckCircle width="36px" color={`${styles.primaryColor}`} />
      </div>
      <h2 className={styles.contribTitle}>
        <b>
          {t('me:contribSuccess', {
            treeCount: contribution.treeCount,
            treeSpecies: contribution.treeSpecies,
            plantDate: formatDate(contribution.plantDate),
          })}
        </b>
      </h2>
      <div className={styles.contributionInfo}>
        <div className={styles.infoRow}>
          <div className={styles.infoItem}>
            <div className={styles.previewMap}>
              <StaticMap geoJson={contribution.geometry} />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.uploadImages}>
        <UploadImages {...UploadProps} />
      </div>
      <div className={styles.nextButton}>
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
      </div>
    </>
  ) : (
    <></>
  );
}
