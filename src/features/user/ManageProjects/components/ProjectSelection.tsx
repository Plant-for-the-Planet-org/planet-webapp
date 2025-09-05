import type { ReactElement } from 'react';
import type { SetState } from '../../../common/types/common';

import { useTranslations } from 'next-intl';
import styles from '../StepForm.module.scss';
import useLocalizedPath from '../../../../hooks/useLocalizedPath';
import { useRouter } from 'next/router';

interface ProjectSelectionProps {
  setTabSelected: SetState<number>;
}

export default function ProjectSelection({
  setTabSelected,
}: ProjectSelectionProps): ReactElement {
  const router = useRouter();
  const { localizedPath } = useLocalizedPath();
  const t = useTranslations('ManageProjects');

  return (
    <div className={styles.projectTypes}>
      <div>
        <button
          id={'addProjectBut'}
          className={styles.addProjectsButton}
          onClick={() => {
            setTabSelected(1);
            router.push(
              localizedPath('/profile/projects/new-project/?purpose=trees')
            );
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
            router.push(
              localizedPath(
                '/profile/projects/new-project/?purpose=conservation'
              )
            );
          }}
        >
          {t('conservationProject')}
        </button>
      </div>
    </div>
  );
}
