import React from 'react';
import styles from './ReviewReports.module.scss';
import DownloadReportIcon from '../icons/DownloadReportIcon';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../utils/getImageURL';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { localeMapForDate } from '../../utils/language/getLanguageName';
import { Trans } from 'next-i18next';
import { useTranslation } from 'next-i18next';

interface Props {
  pdf: string;
  issueMonth: string;
}

const ProjectReview = ({ issueMonth, pdf }: Props) => {
  const { t } = useTranslation(['common']);
  const displayDate = (date: string) => {
    return format(parse(date, 'MM-yyyy', new Date()), 'LLLL yyyy', {
      locale: localeMapForDate[localStorage.getItem('language') || 'en'],
    });
  };
  return (
    <div className={styles.reviewReportsContainer}>
      <div className={styles.titleContainer}>
        <h6>Review</h6>
        <div className={styles.downloadReportContainer}>
          {' '}
          <p>Report</p>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={getPDFFile('projectReview', pdf)}
          >
            <DownloadReportIcon />
          </a>
        </div>
      </div>
      <div className={styles.reviewInfoContainer}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon sx={{ color: '#42A5F5', width: 16, height: 16 }} />
        </div>
        <p>
          <Trans i18nKey="common:reviewInfo">
            The project was inspected in a multiday field review in{' '}
            {displayDate(issueMonth)} and fullfills our{' '}
            <a
              target="_blank"
              href="https://www.plant-for-the-planet.org/standards/"
              rel="noreferrer"
            >
              standards.
            </a>
          </Trans>
        </p>
      </div>
    </div>
  );
};

export default ProjectReview;
