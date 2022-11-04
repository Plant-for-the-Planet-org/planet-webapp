import React from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../../../utils/getImageURL';
import i18next from '../../../../../i18n';

interface Props {
  data: object[];
}
export default function TopProjectReports(data: Props) {
  const { useTranslation } = i18next;
  const { t, ready } = useTranslation('common');
  return (
    ready && (
      <>
        <div className={styles.reports_container}>
          <VerifiedIcon sx={{ color: '#42A5F5' }} />
          <div className={styles.reports_description}>
            {data?.data?.map((review) => (
              <div key={review.id}>
                <p id="child-modal-description">
                  {t('common:reviewInfo', {
                    month: review.issueMonth,
                  })}
                </p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getPDFFile('reviews', review.pdf)}
                >
                  {t('common:viewReport')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </>
    )
  );
}
