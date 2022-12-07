import React from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../../../utils/getImageURL';
import i18next from '../../../../../i18n';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Trans } from 'react-i18next';

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
                  <Trans i18nKey="common:reviewInfo">
                    The project was inspected in a multiday field review in{' '}
                    {format(
                      parse(review?.issueMonth, 'MM-yyyy', new Date()),
                      'LLLL yyyy'
                    )}{' '}
                    and fullfills our
                    <a
                      target="_blank"
                      href={t('standardsPdfLink')}
                      rel="noreferrer"
                      style={{ fontWeight: 400 }}
                    >
                      standards.
                    </a>
                  </Trans>
                </p>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getPDFFile('projectReview', review.pdf)}
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
