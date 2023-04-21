import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { getRequest } from '../../../../utils/apiRequests/api';

import DashboardView from '../../../common/Layout/DashboardView';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import DonationLinkForm from './DonationLinkForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import { Project, MapSingleProject } from '../../../common/types/project';
import { TENANT_ID } from '../../../../utils/constants/environment';
import { handleError, APIError } from '@planet-sdk/common';
import CenteredContainer from '../../../common/Layout/CenteredContainer';

export default function DonationLink(): ReactElement | null {
  const { setErrors } = useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const { t, ready, i18n } = useTranslation(['donationLink']);

  async function fetchProjectList() {
    try {
      const projectsList = await getRequest<MapSingleProject[]>(
        `/app/projects`,
        {
          _scope: 'map',
          'filter[purpose]': 'trees,restoration',
          tenant: TENANT_ID,
          locale: i18n.language,
        }
      );
      if (
        projectsList &&
        Array.isArray(projectsList) &&
        projectsList.length > 0
      ) {
        setProjects(
          projectsList
            .filter((project) => project.properties.allowDonations)
            .map((project) => {
              return {
                guid: project.properties.id,
                slug: project.properties.slug,
                name: project.properties.name,
                unitCost: project.properties.unitCost,
                currency: project.properties.currency,
                purpose: project.properties.purpose,
                allowDonations: project.properties.allowDonations,
              };
            })
        );
      }
    } catch (err) {
      setErrors(handleError(err as APIError));
    }
  }

  useEffect(() => {
    fetchProjectList();
  }, []);

  return ready ? (
    <DashboardView
      title={t('donationLink:donationLinkTitle')}
      subtitle={
        <div>
          <p>{t('donationLink:donationLinkDescription')}</p>
          <p>{t('donationLink:qrCodeDiscription')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <CenteredContainer>
          <DonationLinkForm projectsList={projects} />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  ) : null;
}
