import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { getRequest } from '../../../../utils/apiRequests/api';
import DashboardView from '../../../common/Layout/DashboardView';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import DonationLinkForm from './DonationLinkForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import { ProjectOption } from '../../../common/types/project';
import { useTenant } from '../../../common/Layout/TenantContext';
import { handleError, APIError } from '@planet-sdk/common';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { MapProject } from '../../../common/types/ProjectPropsContextInterface';

export default function DonationLink(): ReactElement | null {
  const { setErrors } = useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState<ProjectOption[] | null>(null);
  const t = useTranslations('DonationLink');
  const locale = useLocale();
  const { tenantConfig } = useTenant();

  async function fetchProjectList() {
    try {
      const projectsList = await getRequest<MapProject[]>(
        tenantConfig?.id,
        `/app/projects`,
        {
          _scope: 'map',
          'filter[purpose]': 'trees,restoration',
          tenant: tenantConfig?.id,
          locale: locale,
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

  return (
    <DashboardView
      title={t('donationLinkTitle')}
      subtitle={
        <div>
          <p>{t('donationLinkDescription')}</p>
          <p>{t('qrCodeDiscription')}</p>
        </div>
      }
    >
      <SingleColumnView>
        <CenteredContainer>
          <DonationLinkForm projectsList={projects} />
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}
