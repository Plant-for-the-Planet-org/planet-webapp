import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { Button, TextField } from 'mui-latest';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';
import GenericCodesPartial from './GenericCodesPartial';
import BulkGiftTotal from './BulkGiftTotal';

const { useTranslation } = i18next;

interface IssueCodesFormProps {
  project: string | null;
}

const IssueCodesForm = ({
  project,
}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);

  if (ready) {
    return (
      <BulkCodesForm className="IssueCodesForm">
        <div className="inputContainer">
          <ProjectSelector project={project} active={false} />
          <TextField label="Comment [Private]"></TextField>
          <GenericCodesPartial />
          <BulkGiftTotal amount={0} currency={'USD'} units={0} unit={'Trees'} />
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          /* disabled={project === null}
          onClick={undefined} */
        >
          {t('bulkCodes:issueCodes')}
        </Button>
      </BulkCodesForm>
    );
  }

  return null;
};

export default IssueCodesForm;
