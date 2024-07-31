import { useContext, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { CountryCode } from '@planet-sdk/common';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { ProjectInfoProps } from '../ProjectSnippet';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import WebappButton from '../../../common/WebappButton';
import style from '../../styles/ProjectSnippet.module.scss';

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
    unitsContributed,
  } = props;

  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const tAllProjects = useTranslations('AllProjects');
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
  const donationLabel = useMemo(() => {
    if (unitType === 'tree' && purpose === 'trees') {
      return tAllProjects('treeDonated', {
        count: countPlanted,
      });
    } else if (unitType === 'm2' && purpose === 'trees') {
      return tAllProjects('areaRestored', {
        area: unitsContributed,
      });
    } else {
      return tAllProjects('areaConserved', {
        area: unitsContributed,
      });
    }
  }, [countPlanted, unitType, purpose, unitsContributed]);

  const donateButtonClass =
    isTopProject && isApproved ? `${style.topProject}` : undefined;

  return (
    <div className={style.projectInfo}>
      <div>
        <div className={style.targetLocation}>
          <div className={style.target}>
            {(countPlanted > 0 ||
              (unitsContributed && unitsContributed > 0)) && (
              <>{donationLabel} • </>
            )}
            <span className={style.country}>
              {tCountry(country.toLowerCase() as Lowercase<CountryCode>)}
            </span>
          </div>
        </div>
        {allowDonations && (
          <div className={style.perUnitCost}>
            {purpose === 'trees'
              ? tAllProjects('perTree', {
                  amount: getFormatedCurrency(locale, currency, unitCost),
                })
              : tAllProjects('perM2', {
                  amount: getFormatedCurrency(locale, currency, unitCost),
                })}
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
