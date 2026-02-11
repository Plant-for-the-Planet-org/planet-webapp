import type { ReactElement } from 'react';
import type { ProjectOption } from '../../../common/types/project';
import type { MapProject } from '../../../common/types/projectv2';
import type { APIError } from '@planet-sdk/common';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DashboardView from '../../../common/Layout/DashboardView';
import DonationLinkForm from './DonationLinkForm';
import SingleColumnView from '../../../common/Layout/SingleColumnView';
import { handleError } from '@planet-sdk/common';
import CenteredContainer from '../../../common/Layout/CenteredContainer';
import { useApi } from '../../../../hooks/useApi';
import { useTenantStore } from '../../../../stores/tenantStore';
import { useErrorHandlingStore } from '../../../../stores/errorHandlingStore';

export default function DonationLink(): ReactElement | null {
  const t = useTranslations('DonationLink');
  const locale = useLocale();
  const { getApi } = useApi();
  // local state
  const [projects, setProjects] = useState<ProjectOption[] | null>(null);
  // store: state
  const tenantConfig = useTenantStore((state) => state.tenantConfig);
  // store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  async function fetchProjectList() {
    try {
      const projectsList = await getApi<MapProject[]>(`/app/projects`, {
        queryParams: {
          _scope: 'map',
          'filter[purpose]': 'trees,restoration',
          //passing locale/tenant as a query param to break cache when locale changes, as the browser uses the cached response even though the x-locale header is different
          tenant: tenantConfig.id,
          locale: locale,
        },
      });
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
          <p>{t('qrCodeDescription')}</p>
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
