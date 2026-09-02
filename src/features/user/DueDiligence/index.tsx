import type { ReactElement } from 'react';
import type { APIError } from '@planet-sdk/common';
import type { DocumentReference } from '../../common/types/project';
import type {
  DueDiligenceChecklist,
  DueDiligenceFieldsResponse,
} from '../../common/types/dueDiligence';

import { useEffect, useState } from 'react';
import { handleError } from '@planet-sdk/common';
import { useTranslations } from 'next-intl';
import styles from './DueDiligence.module.scss';
import CenteredContainer from '../../common/Layout/CenteredContainer';
import DashboardView from '../../common/Layout/DashboardView';
import SingleColumnView from '../../common/Layout/SingleColumnView';
import CharitabilityStatus from './components/CharitabilityStatus';
import DocumentRow from './components/DocumentRow';
import OrganizationDataForm from './components/OrganizationDataForm';
import SubmitForReview from './components/SubmitForReview';
import { dedupeInFlight } from '../ManageProjects/utils/dedupeInFlight';
import { useApi } from '../../../hooks/useApi';
import { useAuthStore, useErrorHandlingStore } from '../../../stores';

export default function DueDiligence(): ReactElement {
  const t = useTranslations('Me.dueDiligence');
  const { getApiAuthenticated } = useApi();
  const setErrors = useErrorHandlingStore((state) => state.setErrors);
  const isAuthReady = useAuthStore(
    (state) => state.token !== null && state.isAuthResolved
  );

  const [checklist, setChecklist] = useState<DueDiligenceChecklist | null>(null);

  useEffect(() => {
    if (!isAuthReady) return;

    const load = async () => {
      try {
        // Strict mode mounts this twice, and without this both mounts ask.
        setChecklist(
          await dedupeInFlight('ro-due-diligence', () =>
            getApiAuthenticated<DueDiligenceChecklist>(
              '/app/profile/dueDiligence/documents'
            )
          )
        );
      } catch (err) {
        setErrors(handleError(err as APIError));
      }
    };
    void load();
  }, [isAuthReady]);

  const handleUploaded = (kind: string, current: DocumentReference) => {
    setChecklist((previous) =>
      previous === null
        ? null
        : {
            ...previous,
            documents: previous.documents.map((item) =>
              item.kind === kind ? { ...item, current, fulfilled: true } : item
            ),
          }
    );
  };

  const handleFieldsSaved = (response: DueDiligenceFieldsResponse) => {
    setChecklist((previous) =>
      previous === null ? null : { ...previous, ...response }
    );
  };

  const handleSubmitted = (submittedAt: string | null) => {
    setChecklist((previous) =>
      previous === null
        ? null
        : {
            ...previous,
            charitability: { ...previous.charitability, submittedAt },
          }
    );
  };

  return (
    <DashboardView title={t('title')} subtitle={t('subtitle')}>
      <SingleColumnView>
        <CenteredContainer>
          {checklist === null ? (
            <div className="spinner" />
          ) : (
            <>
              <CharitabilityStatus charitability={checklist.charitability} />

              <OrganizationDataForm
                fields={checklist.fields}
                onSaved={handleFieldsSaved}
              />

              <div className={styles.section}>
                <span className={styles.sectionTitle}>{t('documents')}</span>
                <span className={styles.sectionHint}>
                  {t('documentsHint')}
                </span>
                {checklist.documents.map((item) => (
                  <DocumentRow
                    key={item.kind}
                    item={item}
                    onUploaded={handleUploaded}
                  />
                ))}
              </div>

              <SubmitForReview
                checklist={checklist}
                onSubmitted={handleSubmitted}
              />
            </>
          )}
        </CenteredContainer>
      </SingleColumnView>
    </DashboardView>
  );
}

