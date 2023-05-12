import { useTranslation, Trans } from 'next-i18next';
import React, {
  ReactElement,
  useEffect,
  useCallback,
  useContext,
  useState,
} from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import CreationMethodForm from './forms/CreationMethodForm';
import SelectProjectForm from './forms/SelectProjectForm';
import IssueCodesForm from './forms/IssueCodesForm';
import { useBulkCode } from '../../common/Layout/BulkCodeContext';
import { MapSingleProject } from '../../common/types/project';
import { TENANT_ID } from '../../../utils/constants/environment';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../utils/apiRequests/api';
import { useUserProps } from '../../common/Layout/UserPropsContext';
import { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import { handleError, APIError } from '@planet-sdk/common';

export enum BulkCodeSteps {
  SELECT_METHOD = 'select_method',
  SELECT_PROJECT = 'select_project',
  ISSUE_CODES = 'issue_codes',
}

interface BulkCodesProps {
  step: BulkCodeSteps;
}

export default function BulkCodes({
  step,
}: BulkCodesProps): ReactElement | null {
  const { t, ready, i18n } = useTranslation('bulkCodes');
  const {
    planetCashAccount,
    setPlanetCashAccount,
    projectList,
    setProjectList,
    bulkMethod,
    project,
  } = useBulkCode();
  const { setErrors } = useContext(ErrorHandlingContext);
  const { contextLoaded, user } = useUserProps();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);

  useEffect(() => {
    if (ready) {
      setTabConfig([
        {
          label: t('bulkCodes:tabCreationMethod'),
          link: '/profile/bulk-codes',
          step: BulkCodeSteps.SELECT_METHOD,
        },
        {
          label: t('bulkCodes:tabSelectProject'),
          link: `/profile/bulk-codes/${bulkMethod}`,
          step: BulkCodeSteps.SELECT_PROJECT,
          disabled: bulkMethod === null,
        },
        {
          label: t('bulkCodes:tabIssueCodes'),
          link: `/profile/bulk-codes/${bulkMethod}/${project?.guid}`,
          step: BulkCodeSteps.ISSUE_CODES,
          disabled: bulkMethod === null || project === null,
        },
      ]);
    }
  }, [ready, bulkMethod, project, i18n.language]);

  const fetchProjectList = useCallback(async () => {
    if (planetCashAccount && !projectList) {
      try {
        const fetchedProjects = await getRequest<MapSingleProject[]>(
          `/app/projects`,
          {
            _scope: 'map',
            currency: planetCashAccount.currency,
            tenant: TENANT_ID,
            'filter[purpose]': 'trees',
            locale: i18n.language,
          }
        );

        // map fetchedProjects to desired form and setProject
        if (
          fetchedProjects &&
          Array.isArray(fetchedProjects) &&
          fetchedProjects.length > 0
        ) {
          const allowedCHFProjects = ['yucatan'];
          setProjectList(
            // Filter projects which allow donations, and store only required values in context
            fetchedProjects
              .filter((project) => {
                return (
                  project.properties.allowDonations &&
                  (planetCashAccount.currency !== 'CHF' ||
                    (planetCashAccount.currency === 'CHF' &&
                      allowedCHFProjects.includes(project.properties.slug)))
                );
              })
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
  }, [planetCashAccount?.currency, i18n.language]);

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  useEffect(() => {
    if (contextLoaded && !planetCashAccount) {
      const userPlanetCash = user.planetCash;
      if (userPlanetCash) {
        setPlanetCashAccount({
          guid: userPlanetCash.account,
          country: userPlanetCash.country,
          currency: userPlanetCash.currency,
        });
      }
    }
  }, [contextLoaded, user]);

  const renderStep = () => {
    switch (step) {
      case BulkCodeSteps.SELECT_METHOD:
        return <CreationMethodForm />;
      case BulkCodeSteps.SELECT_PROJECT:
        return <SelectProjectForm />;
      case BulkCodeSteps.ISSUE_CODES:
        return <IssueCodesForm />;
      default:
        return <CreationMethodForm />;
    }
  };

  return ready ? (
    <DashboardView
      title={t('bulkCodes:bulkCodesTitle')}
      subtitle={
        <div>
          <p>
            <Trans i18nKey="bulkCodes:partnerSignupInfo">
              Use of this feature by Companies is subject to partnership with
              Plant-for-the-Planet. Please contact{' '}
              <a
                className="planet-links"
                href="mailto:partner@plant-for-the-planet.org"
              >
                partner@plant-for-the-planet.org
              </a>{' '}
              for details.
            </Trans>
          </p>
          <p>
            {t('bulkCodes:bulkCodesDescription1')}
            <br />
            {t('bulkCodes:bulkCodesDescription2')}
          </p>
        </div>
      }
    >
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  ) : null;
}
