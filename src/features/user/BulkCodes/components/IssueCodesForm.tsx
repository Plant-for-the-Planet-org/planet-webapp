import React, { ReactElement, useState } from 'react';
import i18next from '../../../../../i18n';
import { Button, TextField, styled } from 'mui-latest';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import styles from '../BulkCodes.module.scss';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';
import BulkGiftTotal from './BulkGiftTotal';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: '10px',
});

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { project } = useBulkCode();
  const { control, handleSubmit, errors, register } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  if (ready) {
    return (
      <BulkCodesForm className="IssueCodesForm">
        <div className="inputContainer">
          <ProjectSelector project={project} active={false} />
          <Controller
            name="comment"
            control={control}
            defaultValue=""
            render={({ onChange, value }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t('bulkCodes:labelComment')}
              />
            )}
          />

          <InlineFormGroup>
            <div style={{ width: '100%' }}>
              <Controller
                name="units"
                control={control}
                rules={{ required: true }}
                render={(props: ControllerRenderProps) => (
                  <TextField
                    {...props}
                    onChange={props.onChange}
                    value={props.value}
                    label={t('bulkCodes:unitsPerCode')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />
                )}
              />
              {errors.units && (
                <span className={styles.formErrors}>
                  {t('bulkCodes:unitsRequired')}
                </span>
              )}
            </div>
            <div style={{ width: '100%' }}>
              <Controller
                name="codeQuantity"
                control={control}
                rules={{ required: true }}
                render={(props: ControllerRenderProps) => (
                  <TextField
                    {...props}
                    onChange={props.onChange}
                    value={props.value}
                    label={t('bulkCodes:totalNumberOfCodes')}
                    onInput={(e) => {
                      e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    }}
                  />
                )}
              />
              {errors.codeQuantity && (
                <span className={styles.formErrors}>
                  {t('bulkCodes:quantityCodesRequired')}
                </span>
              )}
            </div>
          </InlineFormGroup>
          <Controller
            name="occasion"
            control={control}
            render={({ onChange, value }) => (
              <TextField
                onChange={onChange}
                value={value}
                label={t('bulkCodes:occasion')}
              />
            )}
          />
          <BulkGiftTotal amount={0} currency={'USD'} units={0} unit={'tree'} />
          {/* TODOO translation and pluralization */}
        </div>
        <Button
          variant="contained"
          color="primary"
          className="formButton"
          //  disabled={project === null}
          onClick={handleSubmit(onSubmit)}
        >
          {t('bulkCodes:issueCodes')}
        </Button>
      </BulkCodesForm>
    );
  }

  return null;
};

export default IssueCodesForm;
