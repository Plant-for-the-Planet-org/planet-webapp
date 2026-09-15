import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import { useTranslations } from 'next-intl';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import TabbedView from '../../common/Layout/TabbedView';
import { SkeletonBlock } from '../../common/ContentLoaders/Skeleton';
import { ProjectCreationTabs } from './index';
import styles from './ManageProjectsSkeleton.module.scss';

interface ManageProjectsSkeletonProps {
  /**
   * `list` mirrors the project list route (a CTA row and a card grid).
   * `tabbed` mirrors the create/edit-project routes, which share a
   * DashboardView + TabbedView shell across all of their steps.
   */
  variant?: 'list' | 'tabbed';
  /** Real, already-translated title, when known ahead of any fetch (e.g. "add new project"). Left blank for the edit route, whose title is the fetched project's name. */
  title?: string;
  /**
   * `tabbed` variant only. Must match the step of the page rendering this
   * skeleton: the "project type" step only ever shows on its own (a project
   * hasn't been created yet, so there's nothing else to navigate to), while
   * every later step shows the full basic-details-through-review menu, never
   * "project type" (an existing project can't change its type). Defaults to
   * `PROJECT_TYPE` for the create-project route, which starts there.
   */
  step?: ProjectCreationTabs;
}

/** Loading shape for the manage-projects routes: the project list, and the multi-step project create/edit flow. */
export default function ManageProjectsSkeleton({
  variant = 'list',
  title,
  step = ProjectCreationTabs.PROJECT_TYPE,
}: ManageProjectsSkeletonProps): ReactElement {
  const t = useTranslations('ManageProjects');

  if (variant === 'tabbed') {
    const isProjectTypeStep = step === ProjectCreationTabs.PROJECT_TYPE;

    const tabItems: TabItem[] = isProjectTypeStep
      ? [
          {
            label: t('projectType'),
            link: '',
            step: ProjectCreationTabs.PROJECT_TYPE,
          },
        ]
      : [
          {
            label: t('basicDetails'),
            link: '',
            step: ProjectCreationTabs.BASIC_DETAILS,
          },
          {
            label: t('projectMedia'),
            link: '',
            step: ProjectCreationTabs.PROJECT_MEDIA,
          },
          {
            label: t('detailedAnalysis'),
            link: '',
            step: ProjectCreationTabs.DETAILED_ANALYSIS,
          },
          {
            label: t('projectSites'),
            link: '',
            step: ProjectCreationTabs.PROJECT_SITES,
          },
          {
            label: t('projectSpending'),
            link: '',
            step: ProjectCreationTabs.PROJECT_SPENDING,
          },
          {
            label: t('review'),
            link: '',
            step: ProjectCreationTabs.REVIEW,
          },
        ];

    return (
      <DashboardView
        title={title ?? ''}
        subtitle={
          <span aria-hidden="true">
            <SkeletonBlock width={280} height={16} />
          </span>
        }
      >
        <TabbedView step={step} tabItems={tabItems}>
          <div className={styles.tabContent} aria-hidden="true">
            {isProjectTypeStep ? (
              <>
                <SkeletonBlock height={130} borderRadius={9} />
                <SkeletonBlock height={130} borderRadius={9} />
              </>
            ) : (
              <SkeletonBlock height={400} borderRadius={9} />
            )}
          </div>
        </TabbedView>
      </DashboardView>
    );
  }

  return (
    <DashboardView
      title={t('manageProject')}
      subtitle={
        <span aria-hidden="true">
          <SkeletonBlock width={'80%'} height={16} count={2} />
        </span>
      }
    >
      <SingleColumnView>
        <div className={styles.ctaRow} aria-hidden="true">
          <SkeletonBlock width={140} height={40} borderRadius={8} />
          <SkeletonBlock width={160} height={40} borderRadius={8} />
        </div>
        <div className={styles.cardGrid} aria-hidden="true">
          <SkeletonBlock height={100} borderRadius={9} />
          <SkeletonBlock height={100} borderRadius={9} />
          <SkeletonBlock height={100} borderRadius={9} />
        </div>
      </SingleColumnView>
    </DashboardView>
  );
}
