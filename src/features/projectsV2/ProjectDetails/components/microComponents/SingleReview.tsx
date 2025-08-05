import type { Review } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../../styles/ProjectReviews.module.scss';
import DownloadReportIcon from '../../../../../../public/assets/images/icons/projectV2/DownloadReportIcon';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../../../../utils/getImageURL';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import themeProperties from '../../../../../theme/themeProperties';

interface Props {
  singleReview: Review;
}

const SingleReview = ({ singleReview }: Props) => {
  const tCommon = useTranslations('Common');
  const tProjectDetails = useTranslations('ProjectDetails');

  const { colors } = themeProperties.designSystem;

  const displayDate = (date: string) => {
    return format(parse(date, 'MM-yyyy', new Date()), 'LLLL yyyy', {
      locale: localeMapForDate[localStorage.getItem('language') || 'en'],
    });
  };

  return (
    <div className={styles.singleReviewContainer}>
      <div className={styles.reviewInfoContainer}>
        <VerifiedIcon
          sx={{
            color: colors.warmBlue,
            width: 16,
            height: 16,
          }}
        />
        <p>
          {tCommon.rich('reviewInfo', {
            reviewMonth: displayDate(singleReview.issueMonth),
            standardsLink: (chunks) => (
              <a
                target="_blank"
                href={tCommon('standardsLink')}
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </div>
      <div className={styles.downloadReportContainer}>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={getPDFFile('projectReview', singleReview.pdf)}
        >
          <p>{tProjectDetails('report')}</p>
          <DownloadReportIcon width={12} color={colors.warmBlue} />
        </a>
      </div>
    </div>
  );
};

export default SingleReview;
