import type { ReactElement } from 'react';
import type { PaymentOptions } from '../BulkCodesTypes';
import type { APIError, CountryProject } from '@planet-sdk/common';

import ProjectSelectAutocomplete from '../../../common/ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../../hooks/useApi';
import {
  useAuthStore,
  useUserStore,
  useErrorHandlingStore,
} from '../../../../stores';
import { useBulkCodeStore } from '../../../../stores/bulkCodeStore';
import { useTranslations } from 'next-intl';

interface ProjectSelectorProps {
  project: CountryProject | null;
  setProject?: (project: CountryProject | null) => void;
  active?: boolean;
  disabled?: boolean;
}
const ProjectSelector = ({
  project,
  setProject,
  disabled = false,
}: ProjectSelectorProps): ReactElement | null => {
  const tBulkCodes = useTranslations('BulkCodes');
  const { getApiAuthenticated } = useApi();
  //store: state
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );
  const userProfile = useUserStore((state) => state.userProfile);
  const projectList = useBulkCodeStore((state) => state.projectList);
  const planetCashAccount = useBulkCodeStore(
    (state) => state.planetCashAccount
  );
  //store: action
  const setErrors = useErrorHandlingStore((state) => state.setErrors);

  const fetchPaymentOptions = async (guid: string) => {
    const paymentOptions = await getApiAuthenticated<PaymentOptions>(
      `/app/paymentOptions/${guid}`,
      {
        queryParams: {
          country: planetCashAccount?.country || '',
          ...(userProfile !== null && { legacyPriceFor: userProfile.id }),
        },
      }
    );
    return paymentOptions;
  };

  const handleProjectChange = async (project: CountryProject | null) => {
    // fetch project details
    if (project && userProfile && isAuthReady) {
      try {
        const paymentOptions = await fetchPaymentOptions(project.guid);
        // Add/update project object
        if (paymentOptions) {
          project.currency = paymentOptions.currency;
          project.unitCost = paymentOptions.unitCost;
          project.unitType = paymentOptions.unitType;
          project.purpose = paymentOptions.purpose;
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
    // set context
    if (setProject) {
      setProject(project);
    }
  };

  return (
    <>
      <ProjectSelectAutocomplete
        handleProjectChange={handleProjectChange}
        project={project}
        projectList={projectList || []}
        disabled={disabled}
        showSearchIcon={true}
        label={tBulkCodes('labelProject')}
      />
      <UnitCostDisplay
        unitCost={project ? project.unitCost : '-'}
        currency={planetCashAccount ? planetCashAccount.currency : ''}
        unitType={project?.unitType}
      />
    </>
  );
};

export default ProjectSelector;
