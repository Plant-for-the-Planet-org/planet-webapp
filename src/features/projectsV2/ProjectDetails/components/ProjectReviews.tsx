import React from 'react';
import styles from '../styles/ProjectReviews.module.scss';
import SingleReview from './microComponents/SingleReview';
import { useTranslations } from 'next-intl';
import { Review } from '@planet-sdk/common';

interface Props {
  reviews: Review[] | undefined;
}

const ProjectReviews = ({ reviews }: Props) => {
  const t = useTranslations('ManageProjects');
  return (
    <div className={styles.reviewReportsContainer}>
      <h6>{t('review')}</h6>
      {reviews?.map((review) => (
        <SingleReview singleReview={review} key={review.id} />
      ))}
    </div>
  );
};

export default ProjectReviews;
