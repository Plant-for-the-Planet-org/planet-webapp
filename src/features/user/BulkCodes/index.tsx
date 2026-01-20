import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';
import type { APIError, CountryProject } from '@planet-sdk/common';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useCallback, useContext, useState } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import CreationMethodForm from './forms/CreationMethodForm';
import SelectProjectForm from './forms/SelectProjectForm';
import IssueCodesForm from './forms/IssueCodesForm';
import { useBulkCode } from '../../common/Layout/BulkCodeContext';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { handleError } from '@planet-sdk/common';
import { useApi } from '../../../hooks/useApi';
import { useAuthStore, useUserStore } from '../../../stores';

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
  const t = useTranslations('BulkCodes');
  const locale = useLocale();
  const {
    planetCashAccount,
    setPlanetCashAccount,
    projectList,
    setProjectList,
    bulkMethod,
    project,
  } = useBulkCode();
  const { setErrors } = useContext(ErrorHandlingContext);
  const { getApi } = useApi();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  // store: action
  const userPlanetCash = useUserStore((state) => state.userProfile?.planetCash);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);

  useEffect(() => {
    setTabConfig([
      {
        label: t('tabCreationMethod'),
        link: '/profile/bulk-codes',
        step: BulkCodeSteps.SELECT_METHOD,
      },
      {
        label: t('tabSelectProject'),
        link: `/profile/bulk-codes/${bulkMethod}`,
        step: BulkCodeSteps.SELECT_PROJECT,
        disabled: bulkMethod === null,
      },
      {
        label: t('tabIssueCodes'),
        link:
          project !== null
            ? `/profile/bulk-codes/${bulkMethod}/${project.guid}`
            : '',
        step: BulkCodeSteps.ISSUE_CODES,
        disabled: bulkMethod === null || project === null,
      },
    ]);
  }, [bulkMethod, project, locale]);

  const fetchProjectList = useCallback(async () => {
    if (planetCashAccount && !projectList) {
      try {
        const fetchedProjects = await getApi<CountryProject[]>(
          `/app/countryProjects/${planetCashAccount.country}`
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
            fetchedProjects.filter((project) => {
              return (
                project.unitCost > 0 &&
                project.classification !== 'membership' &&
                project.classification !== 'endowment' &&
                (planetCashAccount.currency !== 'CHF' ||
                  (planetCashAccount.currency === 'CHF' &&
                    allowedCHFProjects.includes(project.slug)))
              );
            })
          );
        }
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    }
  }, [planetCashAccount?.currency, locale]);

  useEffect(() => {
    fetchProjectList();
  }, [fetchProjectList]);

  useEffect(() => {
    if (isAuthResolved && !planetCashAccount) return;

    if (userPlanetCash) {
      setPlanetCashAccount({
        guid: userPlanetCash.account,
        country: userPlanetCash.country,
        currency: userPlanetCash.currency,
      });
    }
  }, [isAuthResolved, userPlanetCash]);

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

  return (
    <DashboardView
      title={t('bulkCodesTitle')}
      subtitle={
        <div>
          <p>
            {t.rich('partnerSignupInfo', {
              partnerEmailLink: (chunks) => (
                <a
                  className="planet-links"
                  href="mailto:partner@plant-for-the-planet.org"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
          <p>
            {t('bulkCodesDescription1')}
            <br />
            {t('bulkCodesDescription2')}
          </p>
        </div>
      }
    >
      <TabbedView step={step} tabItems={tabConfig}>
        {renderStep()}
      </TabbedView>
    </DashboardView>
  );
}
