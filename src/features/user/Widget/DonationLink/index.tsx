import React, { ReactElement, useContext, useEffect, useState } from 'react';
import i18next from '../../../../../i18n';
import { getRequest } from '../../../../utils/apiRequests/api';

import DashboardView from '../../../common/Layout/DashboardView';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import DonationLinkForm from './DonationLinkForm';
import SingleColumnView from '../../../common/Layout/DashboardView/SingleColumnView';
import { Project, SingleProject } from '../../../common/types/project';

const { useTranslation } = i18next;

export default function DonationLink(): ReactElement | null {
  const { handleError } = useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<Project[] | null>(null);

  async function fetchProjectList() {
    const projectsList = await getRequest<SingleProject>(
      `/app/projects`,
      handleError,
      undefined,
      {
        _scope: 'default',
        'filter[purpose]': 'trees,conservation',
      }
    );
    if (
      projectsList &&
      Array.isArray(projectsList) &&
      projectsList.length > 0
    ) {
      setProjects(
        projectsList.map((project) => {
          return {
            guid: project.id,
            slug: project.slug,
            name: project.name,
            unitCost: project.unitCost,
            currency: project.currency,
            purpose: project.purpose,
            allowDonations: project.allowDonations,
          };
        })
      );
    }
  }

  useEffect(() => {
    fetchProjectList();
  }, []);

  const { t, ready } = useTranslation(['donationLink']);
  return ready ? (
    <DashboardView
      title={t('donationLink:donationLinkTitle')}
      subtitle={<p>{t('donationLink:donationLinkDescription')}</p>}
    >
      <SingleColumnView>
        <DonationLinkForm projectsList={projects} />
      </SingleColumnView>
    </DashboardView>
  ) : null;
}
