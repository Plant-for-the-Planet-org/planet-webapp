import type { ReactElement } from 'react';

import { Alert, Button } from '@mui/material';
import { useTranslations } from 'next-intl';
import CenteredContainer from '../../../../common/Layout/CenteredContainer';
import StyledForm from '../../../../common/Layout/StyledForm';
import styles from '../../StepForm.module.scss';

interface SectionUnavailableProps {
  /** Why this section is not needed. Translated by the caller, because each case has its own reason. */
  message: string;
  onGoToReview: () => void;
}

/** Shown when the URL opens a tab this project does not have, so the owner is told why rather than moved without explanation. */
export default function SectionUnavailable({
  message,
  onGoToReview,
}: SectionUnavailableProps): ReactElement {
  const t = useTranslations('ManageProjects');

  return (
    <CenteredContainer>
      <StyledForm>
        <div className="inputContainer">
          <Alert severity="info">{message}</Alert>
        </div>
        <div className={styles.buttonsForProjectCreationForm}>
          <Button
            variant="contained"
            onClick={onGoToReview}
            className="formButton"
          >
            {t('goToReview')}
          </Button>
        </div>
      </StyledForm>
    </CenteredContainer>
  );
}
