import type { Review } from '@planet-sdk/common/build/types/project/common';

import styles from './../../styles/ProjectDetails.module.scss';
import VerifiedIcon from '@mui/icons-material/Verified';
import { getPDFFile } from '../../../../utils/getImageURL';
import parse from 'date-fns/parse';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../utils/language/getLanguageName';
import { useTranslations } from 'next-intl';

interface Props {
  projectReviews: Review[] | undefined;
}

export default function TopProjectReports({ projectReviews }: Props) {
  const t = useTranslations('Common');
  const displayDate = (date: string) => {
    return format(parse(date, 'MM-yyyy', new Date()), 'LLLL yyyy', {
      locale: localeMapForDate[localStorage.getItem('language') || 'en'],
    });
  };
  return (
    <>
      <div className={styles.reports_container}>
        <VerifiedIcon sx={{ color: '#42A5F5' }} />
        <div className={styles.reports_description}>
          {projectReviews?.map((review) => (
            <div key={review.id}>
              <p id="child-modal-description">
                {t.rich('reviewInfo', {
                  reviewMonth: displayDate(review.issueMonth),
                  standardsLink: (chunks) => (
                    <a
                      target="_blank"
                      href={t('standardsLink')}
                      rel="noreferrer"
                      style={{ fontWeight: 400 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {chunks}
                    </a>
                  ),
                })}
              </p>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={getPDFFile('projectReview', review.pdf)}
                onClick={(e) => e.stopPropagation()}
              >
                {t('viewReport')}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
