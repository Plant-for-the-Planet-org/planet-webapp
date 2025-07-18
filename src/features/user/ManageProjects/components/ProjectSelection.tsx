import type { ReactElement } from 'react';
import type { SetState } from '../../../common/types/common';

import { useRouter } from 'next/router';
import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../StepForm.module.scss';
import getLocalizedPath from '../../../../utils/localizedPath';

interface ProjectSelectionProps {
  setTabSelected: SetState<number>;
}

export default function ProjectSelection({
  setTabSelected,
}: ProjectSelectionProps): ReactElement {
  const router = useRouter();
  const locale = useLocale();
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
              getLocalizedPath(
                '/profile/projects/new-project/?purpose=trees',
                locale
              )
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
              getLocalizedPath(
                '/profile/projects/new-project/?purpose=conservation',
                locale
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
