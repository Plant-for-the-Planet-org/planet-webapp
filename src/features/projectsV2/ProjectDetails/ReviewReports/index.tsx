import React from 'react';
import styles from './ReviewReports.module.scss';
import SingleReview from './microComponents/SingleReview';
import { useTranslations } from 'next-intl';
import { Review } from '@planet-sdk/common';

interface Props {
  reviews: Review[];
}

const ProjectReview = ({ reviews }: Props) => {
  const t = useTranslations('ManageProjects');
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
