import type { Review } from '@planet-sdk/common';

import { useTranslations } from 'next-intl';
import styles from '../styles/ProjectReviews.module.scss';
import SingleReview from './microComponents/SingleReview';

interface Props {
  reviews: Review[] | undefined;
}

const ProjectReviews = ({ reviews }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={styles.reviewReportsContainer}>
      <h6>{tProjectDetails('review')}</h6>
      {reviews?.map((review) => (
        <SingleReview singleReview={review} key={review.id} />
      ))}
    </div>
  );
};

export default ProjectReviews;
