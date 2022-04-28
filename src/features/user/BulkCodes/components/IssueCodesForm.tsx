import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { Button, TextField } from 'mui-latest';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';
import GenericCodesPartial from './GenericCodesPartial';
import BulkGiftTotal from './BulkGiftTotal';

const { useTranslation } = i18next;

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { project } = useBulkCode();
  const [comment, setComment] = useState<string>('');
  const [codeQuantity, setCodeQuantity] = useState<string>('');
  const [unit, setUnit] = useState<string>('');
  const [occasion, setOccasion] = useState<string>('');

  if (ready) {
    return (
      <BulkCodesForm className="IssueCodesForm">
        <div className="inputContainer">
          <ProjectSelector
            project={project?.slug.label as string}
            active={false}
          />
          <TextField
            onChange={(e) => setComment(e.target.value)}
            value={comment}
            label={t('bulkCodes:labelComment')}
          ></TextField>
          <GenericCodesPartial
            {...{
              codeQuantity,
              unit,
              occasion,
              setCodeQuantity,
              setUnit,
              setOccasion,
            }}
          />
          <BulkGiftTotal amount={0} currency={'USD'} units={0} unit={'tree'} />
          {/* TODOO translation and pluralization */}
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
