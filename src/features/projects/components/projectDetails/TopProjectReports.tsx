import React from 'react';
import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../../../utils/getImageURL';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { Trans } from 'react-i18next';
import { useTranslation } from 'next-i18next';

//will be shifted to a common type definition file
interface reviewType {
  id: string;
  issueMonth: string;
  pdf: string;
}
interface Props {
  projectReviews: reviewType[];
}
export default function TopProjectReports({ projectReviews }: Props) {
  const { t, ready } = useTranslation(['common']);
  const displayDate = (date: string) => {
    return format(parse(date, 'MM-yyyy', new Date()), 'LLLL yyyy');
  };
  return ready ? (
    <>
      <div className={styles.reports_container}>
        <VerifiedIcon sx={{ color: '#42A5F5' }} />
        <div className={styles.reports_description}>
          {projectReviews?.map((review) => (
            <div key={review.id}>
              <p id="child-modal-description">
                <Trans i18nKey="common:reviewInfo">
                  The project was inspected in a multiday field review in{' '}
                  {displayDate(review?.issueMonth)} and fullfills our{' '}
                  <a
                    target="_blank"
                    href={t('standardsLink')}
                    rel="noreferrer"
                    style={{ fontWeight: 400 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    standards.
                  </a>
                </Trans>
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getPDFFile('projectReview', review.pdf)}
                onClick={(e) => e.stopPropagation()}
              >
                {t('common:viewReport')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : null;
}
