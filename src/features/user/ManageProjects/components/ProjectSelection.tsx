import router, { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import i18next from './../../../../../i18n';

const { useTranslation } = i18next;

export default function ProjectSelection(): ReactElement {
  const router = useRouter();
  const { t, ready } = useTranslation('manageProjects');

  return ready ? (
    <div className={'add-project-container'}>
      <div className={'add-project'}>
        <button
          id={'addProjectBut'}
          className={'add-projects-button'}
          onClick={() =>
            router.push('/profile/projects/new-project/?purpose=trees')
          }
        >
          {t('manageProjects:restorationProject')}
        </button>

        <button
          id={'conservationProj'}
          className={'add-projects-button'}
          onClick={() =>
            router.push('/profile/projects/new-project/?purpose=conservation')
          }
        >
          {t('manageProjects:conservationProject')}
        </button>
      </div>
    </div>
  ) : (
    <></>
  );
}
