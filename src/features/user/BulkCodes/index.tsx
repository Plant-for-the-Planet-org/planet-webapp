import React, { ReactElement, useEffect, useCallback, useContext } from 'react';
import i18next from '../../../../i18n';

import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from './TabbedView';
import CreationMethodForm from './forms/CreationMethodForm';
import SelectProjectForm from './forms/SelectProjectForm';
import IssueCodesForm from './forms/IssueCodesForm';

import {
  useBulkCode,
  APISingleProject,
} from '../../common/Layout/BulkCodeContext';
import { TENANT_ID } from '../../../utils/constants/environment';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import { getRequest } from '../../../utils/apiRequests/api';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';

export enum BulkCodeSteps {
  SELECT_METHOD = 0,
  SELECT_PROJECT = 1,
  ISSUE_CODES = 2,
}

interface BulkCodesProps {
  step: BulkCodeSteps;
}

const { useTranslation } = i18next;

export default function BulkCodes({
  step,
}: BulkCodesProps): ReactElement | null {
  const { t, ready, i18n } = useTranslation(['bulkCodes']);
  const {
    planetCashAccount,
    setPlanetCashAccount,
    projectList,
    setProjectList,
  } = useBulkCode();
  const { handleError } = useContext(ErrorHandlingContext);
  const { contextLoaded, user } = useContext(UserPropsContext);

  const fetchProjectList = useCallback(async () => {
    if (planetCashAccount && !projectList) {
      try {
        const fetchedProjects = await getRequest<APISingleProject[]>(
          `/app/projects`,
          handleError,
          undefined,
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
          setProjectList(
            // Filter projects which allow donations, and store only required values in context
            fetchedProjects
              .filter((project) => {
                return (
                  project.properties.allowDonations &&
                  (planetCashAccount.currency !== 'CHF' ||
                    (planetCashAccount.currency === 'CHF' &&
                      project.properties.slug === 'yucatan'))
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
        console.log(err);
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
        <p>
          {t('bulkCodes:bulkCodesDescription1')}
          <br />
          {t('bulkCodes:bulkCodesDescription2')}
        </p>
      }
    >
      <TabbedView step={step}>{renderStep()}</TabbedView>
    </DashboardView>
  ) : null;
}
