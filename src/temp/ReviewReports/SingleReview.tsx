import { Trans, useTranslation } from 'next-i18next';
import styles from './ReviewReports.module.scss';
import DownloadReportIcon from '../icons/DownloadReportIcon';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../utils/getImageURL';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { localeMapForDate } from '../../utils/language/getLanguageName';
import { Review } from '@planet-sdk/common';

interface Props {
  singleReview: Review;
}

const SingleReview = ({ singleReview }: Props) => {
  const { t } = useTranslation(['common', 'manageProjects', 'projectDetails']);
  const displayDate = (date: string) => {
    return format(parse(date, 'MM-yyyy', new Date()), 'LLLL yyyy', {
      locale: localeMapForDate[localStorage.getItem('language') || 'en'],
    });
  };
  return (
    <div className={styles.singleReviewContainer}>
      <div className={styles.reviewInfoContainer}>
        <div className={styles.verifiedIcon}>
          <VerifiedIcon
            sx={{
              color: `${'rgba(var(--review-font-color-new))'}`,
              width: 16,
              height: 16,
            }}
          />
        </div>
        <p>
          <Trans i18nKey="common:reviewInfo">
            The project was inspected in a multiday field review in{' '}
            {displayDate(singleReview.issueMonth)} and fullfills our{' '}
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
      <div className={styles.downloadReportContainer}>
        <p>{t('projectDetails:report')}</p>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getPDFFile('projectReview', singleReview.pdf)}
        >
          <DownloadReportIcon
            width={10}
            color={`${'rgb(var(--review-font-color-new))'}`}
          />
        </a>
      </div>
    </div>
  );
};

export default SingleReview;
