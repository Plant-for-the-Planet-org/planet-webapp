import type { Control } from 'react-hook-form';
import type { SignupFormData } from '..';
import type { SetState } from '../../../common/types/common';

import { Controller } from 'react-hook-form';
import { useLocale, useTranslations } from 'next-intl';
import styles from '../CompleteSignup.module.scss';
import NewToggleSwitch from '../../../common/InputTypes/NewToggleSwitch';

interface SignupTogglesProps {
  control: Control<SignupFormData, any, SignupFormData>;
  isPublic: boolean;
  agreedToTerms: boolean;
  setAgreedToTerms: SetState<boolean>;
  formSubmitted: boolean;
}

const SignupToggles = ({
  control,
  isPublic,
  agreedToTerms,
  setAgreedToTerms,
  formSubmitted,
}: SignupTogglesProps) => {
  const tSignup = useTranslations('EditProfile');
  const locale = useLocale();
  return (
    <>
      <div className={styles.inlineToggleGroup}>
        <div>
          <label
            htmlFor="is-public"
            className={styles.mainText}
            style={{ cursor: 'pointer' }}
          >
            {tSignup('fieldLabels.isPublic')}
          </label>{' '}
          <br />
          {isPublic && (
            <label className={styles.isPrivateAccountText}>
              {tSignup('publicProfileExplanation')}
            </label>
          )}
        </div>
        <Controller
          name="isPublic"
          control={control}
          defaultValue={false}
          render={({ field: { onChange, value } }) => (
            <NewToggleSwitch
              checked={value}
              onChange={onChange}
              inputProps={{ 'aria-label': 'secondary checkbox' }}
              id="is-public"
            />
          )}
        />
      </div>

      <div className={styles.inlineToggleGroup}>
        <div className={styles.mainText}>
          <label htmlFor="get-news" style={{ cursor: 'pointer' }}>
            {tSignup('fieldLabels.subscribe')}
          </label>
        </div>
        <Controller
          name="getNews"
          control={control}
          defaultValue={true}
          render={({ field: { onChange, value } }) => {
            return (
              <NewToggleSwitch
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={{ 'aria-label': 'secondary checkbox' }}
                id="get-news"
              />
            );
          }}
        />
      </div>

      <div>
        <div className={styles.inlineToggleGroup}>
          <div className={styles.mainText}>
            <label htmlFor={'terms'} style={{ cursor: 'pointer' }}>
              {tSignup.rich('termAndCondition', {
                termsLink: (chunks) => (
                  <a
                    className="planet-links"
                    rel="noopener noreferrer"
                    href={`https://pp.eco/legal/${locale}/terms`}
                    target={'_blank'}
                  >
                    {chunks}
                  </a>
                ),
              })}
            </label>
          </div>
          <NewToggleSwitch
            checked={agreedToTerms || false}
            onChange={(e) => {
              setAgreedToTerms(e.target.checked);
            }}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
            id="terms"
          />
        </div>
        {!agreedToTerms && formSubmitted && (
          <div className={styles.termsError}>
            {tSignup('termAndConditionError')}
          </div>
        )}
      </div>
    </>
  );
};

export default SignupToggles;
