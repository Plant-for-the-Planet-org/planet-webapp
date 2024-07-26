import { useContext } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CountryCode, CurrencyCode } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { CommonProps } from '../ProjectSnippet';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import WebappButton from '../../../common/WebappButton';
import style from '../../styles/ProjectSnippet.module.scss';

interface ProjectInfoProps extends CommonProps {
  unitType: 'm2' | 'tree';
  countPlanted: number;
  unitCost: number;
  country: CountryCode;
  currency: CurrencyCode;
  slug: string;
}

const ProjectInfoSection = (props: ProjectInfoProps) => {
  const {
    slug,
    isApproved,
    isTopProject,
    countPlanted,
    purpose,
    unitType,
    unitCost,
    allowDonations,
    country,
    currency,
  } = props;
  const tDonate = useTranslations('Donate');
  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const { tenantConfig } = useTenant();
  const { token } = useUserProps();
  const locale = useLocale();
  const { embed, callbackUrl } = useContext(ParamsContext);

  const donateLink = getDonationUrl(
    tenantConfig.id,
    slug,
    token,
    embed || undefined,
    callbackUrl || undefined
  );

  const donateButtonClass =
    isTopProject && isApproved
      ? `${style.topApproved}`
      : `${style.topUnapproved}`;

  return (
    <div className={style.projectInfo}>
      <div>
        <div className={style.targetLocation}>
          <div className={style.target}>
            {purpose === 'trees' && countPlanted > 0 && (
              <>
                {localizedAbbreviatedNumber(locale, Number(countPlanted), 1)}{' '}
                {unitType === 'tree'
                  ? tDonate('treeDonated', {
                      count: Number(countPlanted),
                    })
                  : tCommon('m2')}{' '}
                •{' '}
              </>
            )}
            <span className={style.country}>
              {tCountry(country.toLowerCase() as Lowercase<CountryCode>)}
            </span>
          </div>
        </div>
        {allowDonations && (
          <div className={style.perUnitCost}>
            {getFormatedCurrency(locale, currency, unitCost)}{' '}
            <span>
              {unitType === 'tree' ? tDonate('perTree') : tDonate('perM2')}
            </span>
          </div>
        )}
      </div>

      {allowDonations && (
        <WebappButton
          variant="primary"
          text={tCommon('donate')}
          elementType="link"
          href={donateLink}
          target={embed ? '_top' : '_blank'}
          buttonClasses={donateButtonClass}
        />
      )}
    </div>
  );
};

export default ProjectInfoSection;
