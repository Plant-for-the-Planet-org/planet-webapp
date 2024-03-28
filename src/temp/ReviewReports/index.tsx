import React from 'react';
import styles from './ReviewReports.module.scss';
import SingleReview from './SingleReview';
import { useTranslation } from 'next-i18next';
import { Review } from '@planet-sdk/common';

interface Props {
  reviews: Review[];
}

const ProjectReview = ({ reviews }: Props) => {
  const { t } = useTranslation('manageProjects');
  return (
    <div className={styles.reviewReportsContainer}>
      <h6>{t('review')}</h6>
      {reviews.map((review) => (
        <SingleReview singleReview={review} key={review.id} />
      ))}
    </div>
  );
};

export default ProjectReview;
