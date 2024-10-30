import { useContext, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import type { CountryCode } from '@planet-sdk/common';
import type { ProjectInfoProps } from '..';
import { useUserProps } from '../../../common/Layout/UserPropsContext';
import { useTenant } from '../../../common/Layout/TenantContext';
import { ParamsContext } from '../../../common/Layout/QueryParamsContext';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import getFormatedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import WebappButton from '../../../common/WebappButton';
import styles from '../styles/ProjectSnippet.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';

const ProjectInfoSection = (props: ProjectInfoProps) => {
  const {
    slug,
    isApproved,
    isTopProject,
    unitCount,
    purpose,
    unitType,
    unitCost,
    allowDonations,
    country,
    currency,
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
    if (unitCount === undefined) {
      return;
    }
    const formattedUnitCount = localizedAbbreviatedNumber(locale, unitCount, 1);
    if (unitType === 'tree' && purpose === 'trees') {
      return tAllProjects('treeDonated', {
        count: unitCount,
        formattedCount: formattedUnitCount,
      });
    } else if (unitType === 'm2' && purpose === 'trees') {
      return tAllProjects('areaRestored', {
        area: unitCount,
        formattedCount: formattedUnitCount,
      });
    } else {
      return tAllProjects('areaConserved', {
        area: unitCount,
        formattedCount: formattedUnitCount,
      });
    }
  }, [unitCount, unitType, purpose]);

  const donateButtonClass =
    isTopProject && isApproved ? `${styles.topProject}` : undefined;

  return (
    <div className={styles.projectInfo}>
      <div className={styles.projectInfoSubContainer}>
        <div className={styles.targetLocation}>
          <div className={styles.target}>
            {unitCount !== undefined && unitCount > 0 && (
              <>{donationLabel} • </>
            )}
            <span className={styles.country}>
              {tCountry(country.toLowerCase() as Lowercase<CountryCode>)}
            </span>
          </div>
        </div>
        {allowDonations && (
          <div className={styles.perUnitCost}>
            {tAllProjects('ratePerUnit', {
              amount: getFormatedCurrency(locale, currency, unitCost),
              unit: unitType,
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
