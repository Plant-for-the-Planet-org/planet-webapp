import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../../public/assets/images/NotFound';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';
import styles from './../styles/Projects.module.scss';
import i18next from '../../../../../i18n';

const { useTranslation } = i18next;
const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
  directGift: any;
  setDirectGift: Function;
}

function AllProjects({
  projects,
  directGift,
  setDirectGift,
}: Props): ReactElement {
  const { t } = useTranslation(['donate', 'common']);

  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.3,
        when: 'beforeChildren',
        staggerChildren: 1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (projects.length < 1) {
    return (
      <div className={styles.projectNotFound}>
        <LazyLoad>
          <NotFound className={styles.projectNotFoundImage} />
          <h5>{t('donate:noProjectsFound')}</h5>
        </LazyLoad>
      </div>
    );
  } else {
    return (
      <div className={styles.allProjectsContainer}>
        {/* <LazyLoad> */}
        <div>
          <div>
            {projects.map((project: any) => {
              return (
                <ProjectSnippet
                  key={project.properties.id}
                  project={project}
                  directGift={directGift}
                  setDirectGift={setDirectGift}
                />
              );
            })}
          </div>
        </div>
        {/* </LazyLoad> */}
      </div>
    );
  }
}

export default AllProjects;
