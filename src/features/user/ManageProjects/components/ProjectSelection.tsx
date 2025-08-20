import type { ReactElement } from 'react';
import type { SetState } from '../../../common/types/common';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../StepForm.module.scss';
import useLocalizedRouter from '../../../../hooks/useLocalizedRouter';

interface ProjectSelectionProps {
  setTabSelected: SetState<number>;
}

export default function ProjectSelection({
  setTabSelected,
}: ProjectSelectionProps): ReactElement {
  const locale = useLocale();
  const { push } = useLocalizedRouter();
  const t = useTranslations('ManageProjects');

  return (
    <div className={styles.projectTypes}>
      <div>
        <button
          id={'addProjectBut'}
          className={styles.addProjectsButton}
          onClick={() => {
            setTabSelected(1);
            push('/profile/projects/new-project/?purpose=trees', locale);
          }}
        >
          {t('restorationProject')}
        </button>
      </div>
      <div>
        <button
          id={'conservationProj'}
          className={styles.addProjectsButton}
          onClick={() => {
            setTabSelected(1);
            push('/profile/projects/new-project/?purpose=conservation');
          }}
        >
          {t('conservationProject')}
        </button>
      </div>
    </div>
  );
}
