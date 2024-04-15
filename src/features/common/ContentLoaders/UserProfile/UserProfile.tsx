import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import React from 'react';
import myProfileStyle from '../../../user/Profile/styles/MyProfile.module.scss';
import myForestMapStyle from '../../../user/Profile/styles/MyForestMap.module.scss';
import myForestStyle from '../../../user/Profile/styles/MyForest.module.scss';

export const UserProfileLoader = () => {
  return (
    <>
      <div className={myProfileStyle.skeletonContainer}>
        <Skeleton height={300} className={myProfileStyle.profileSkeleton} />
        <Skeleton
          height={700}
          className={myForestMapStyle.myForestMapSkeleton}
        />
      </div>
    </>
  );
};

export const MyForestMapLoader = () => {
  return (
    <div className={myForestMapStyle.myForestMapSkeletonContainer}>
      <Skeleton
        height={700}
        className={myForestMapStyle.myForestMapSkeletonX}
      />
    </div>
  );
};

export const MyContributionLoader = () => {
  return (
    <div className={myForestStyle.myForestStyleContainer}>
      <Skeleton height={700} className={myForestStyle.myContributionLoader} />
    </div>
  );
};
