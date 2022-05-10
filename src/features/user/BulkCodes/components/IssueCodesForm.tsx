import React, { ReactElement, useContext } from 'react';
import i18next from '../../../../../i18n';
import { Button, TextField, styled } from 'mui-latest';
import { useForm, Controller, ControllerRenderProps } from 'react-hook-form';
import { useBulkCode } from '../../../common/Layout/BulkCodeContext';
import styles from '../BulkCodes.module.scss';

import BulkCodesForm from './BulkCodesForm';
import ProjectSelector from './ProjectSelector';
import BulkGiftTotal from './BulkGiftTotal';
import UploadWidget from './UploadWidget';

import BulkCodesError from './BulkCodesError';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const { useTranslation } = i18next;

const InlineFormGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: '10px',
});

interface IssueCodesFormProps {}

const IssueCodesForm = ({}: IssueCodesFormProps): ReactElement | null => {
  const { t, ready } = useTranslation(['common', 'bulkCodes']);
  const { project, planetCashAccount, projectList } = useBulkCode();
  const { user } = useContext(UserPropsContext);
  const { control, handleSubmit, errors, watch } = useForm();

  const codeQuantity = watch('codeQuantity', 0);
  const unitsPerCode = watch('unitsPerCode', 0);

  const getMockDonation = () => {
    return new Promise((resolve, reject) => {
      const shouldResolve = true;

      if (shouldResolve) {
        setTimeout(() => {
          resolve({
            id: 'don_0HJcA2pIFHai7lb2BHQejdzs',
            treeCount: 100.0,
            token: 'G79STO511ASU',
            metadata: null,
            isRecurrent: false,
            tenant: 'ten_I9TW3ncG',
            project: {
              id: 'proj_WZkyugryh35sMmZMmXCwq7YY',
              name: 'Yucatán Restoration',
              country: 'MX',
              purpose: 'trees',
            },
            gift: {
              id: 'bgft_nki37Kzi6dWbHdqOkkJoA1v4',
              type: 'code-bulk',
              value: 100,
              status: 'registered',
            },
            paymentDate: '2022-05-03 04:58:22',
            signupPending: false,
            hasPublicProfile: true,
            comment: 'Trees',
            uid: '000815737',
            donorAlias: null,
            amount: 100.0,
            currency: 'EUR',
            frequency: null,
            gateway: 'planet-cash',
            paymentStatus: 'paid',
            taxDeductionCountry: null,
            quantity: 100.0,
          });
        }, 2000);
      } else {
        reject(new Error('Error occurred while making donation'));
      }
    });
  };

  const onSubmit = async (data) => {
    // bulkGiftData.value = unitsPerCode * unitCost
    console.log(data);

    // Mocking the API call
    try {
      const res = await getMockDonation();
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  if (ready) {
    return (
      <BulkCodesForm className="IssueCodesForm">
        <div className="inputContainer">
          <ProjectSelector
            projectList={projectList || []}
            project={project}
            active={false}
            planetCashAccount={planetCashAccount}
          />
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
                name="unitsPerCode"
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
                    error={errors.units}
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
                    error={errors.codeQuantity}
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
                defaultValue=""
                value={value}
                label={t('bulkCodes:occasion')}
              />
            )}
          />
          <BulkGiftTotal
            amount={
              project
                ? `${(project.unitCost * codeQuantity * unitsPerCode).toFixed(
                    2
                  )}`
                : undefined
            }
            currency={planetCashAccount?.currency}
            units={project ? codeQuantity * unitsPerCode : undefined}
            unit={project?.unit}
          />
          {/* TODOO translation and pluralization */}
          <UploadWidget />
        </div>

        <BulkCodesError />

        <Button
          variant="contained"
          color="primary"
          className="formButton"
          disabled={
            !(
              user.planetCash &&
              !(user.planetCash.balance + user.planetCash.creditLimit <= 0)
            )
          }
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
