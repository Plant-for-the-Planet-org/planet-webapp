import React, { ReactElement, useContext, useEffect, useState } from 'react';
import i18next from '../../../../../i18n';
import { getRequest } from '../../../../utils/apiRequests/api';

import DashboardView from '../../../common/Layout/DashboardView';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import DonationLinkForm from './DonationLinkForm';
import SingleColumnView from './SingleColumnView';

const { useTranslation } = i18next;

export default function DonationLink(): ReactElement | null {
  const { handleError } = useContext(ErrorHandlingContext);
  const [projects, setProjects] = useState([]);

  async function fetchProjectList() {
    const projectsList = await getRequest<
      [
        {
          properties: {
            id: string;
            name: string;
            slug: string;
            allowDonations: boolean;
            purpose: string;
            currency: string;
            unitCost: number;
          };
        }
      ]
    >(`/app/projects`, handleError, undefined, {
      _scope: 'default',
    });

    setProjects(projectsList);
    console.log(projects);
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
