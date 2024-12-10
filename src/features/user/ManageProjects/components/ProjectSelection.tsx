import type { ReactElement } from 'react';
import type { SetState } from '../../../common/types/common';

import { useRouter } from 'next/router';
import React from 'react';
import { useTranslations } from 'next-intl';
import Styles from '../../../../../src/features/user/ManageProjects/StepForm.module.scss';

interface ProjectSelectionProps {
  setTabSelected: SetState<number>;
}

export default function ProjectSelection({
  setTabSelected,
}: ProjectSelectionProps): ReactElement {
  const router = useRouter();
  const t = useTranslations('ManageProjects');

  return (
    <div className={Styles.projectTypes}>
      <div>
        <button
          id={'addProjectBut'}
          className={'add-projects-button'}
          onClick={() => {
            setTabSelected(1);
            router.push('/profile/projects/new-project/?purpose=trees');
          }}
        >
          {t('restorationProject')}
        </button>
      </div>
      <div>
        <button
          id={'conservationProj'}
          className={'add-projects-button'}
          onClick={() => {
            setTabSelected(1);
            router.push('/profile/projects/new-project/?purpose=conservation');
          }}
        >
          {t('conservationProject')}
        </button>
      </div>
    </div>
  );
}
