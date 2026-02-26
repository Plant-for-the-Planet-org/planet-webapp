import type { ReactElement } from 'react';
import type { TabItem } from '../../common/Layout/TabbedView/TabbedViewTypes';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import DashboardView from '../../common/Layout/DashboardView';
import TabbedView from '../../common/Layout/TabbedView';
import CreationMethodForm from './forms/CreationMethodForm';
import SelectProjectForm from './forms/SelectProjectForm';
import IssueCodesForm from './forms/IssueCodesForm';
import { useApi } from '../../../hooks/useApi';
import { useAuthStore, useUserStore } from '../../../stores';
import { useBulkCodeStore } from '../../../stores/bulkCodeStore';

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
  const { getApi } = useApi();
  const [tabConfig, setTabConfig] = useState<TabItem[]>([]);
  // store: state
  const userPlanetCash = useUserStore((state) => state.userProfile?.planetCash);
  const isAuthResolved = useAuthStore((state) => state.isAuthResolved);
  const bulkMethod = useBulkCodeStore((state) => state.bulkMethod);
  const planetCashAccount = useBulkCodeStore(
    (state) => state.planetCashAccount
  );
  const project = useBulkCodeStore((state) => state.project);
  // store: action
  const fetchProjectList = useBulkCodeStore((state) => state.fetchProjectList);
  const setPlanetCashAccount = useBulkCodeStore(
    (state) => state.setPlanetCashAccount
  );

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

  useEffect(() => {
    fetchProjectList(getApi);
  }, [fetchProjectList, getApi]);

  useEffect(() => {
    if (!isAuthResolved) return;
    if (planetCashAccount) return;

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
