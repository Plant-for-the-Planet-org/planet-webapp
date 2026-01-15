import type { CountryCode } from '@planet-sdk/common';
import type { ProjectInfoProps } from '..';

import { useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useTenant } from '../../../common/Layout/TenantContext';
import { getDonationUrl } from '../../../../utils/getDonationUrl';
import getFormattedCurrency from '../../../../utils/countryCurrency/getFormattedCurrency';
import WebappButton from '../../../common/WebappButton';
import styles from '../styles/ProjectSnippet.module.scss';
import { localizedAbbreviatedNumber } from '../../../../utils/getFormattedNumber';
import { useQueryParamStore } from '../../../../stores/queryParamStore';
import { useAuthStore } from '../../../../stores/authStore';

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
    utmCampaign,
    disableDonations,
  } = props;

  const tCommon = useTranslations('Common');
  const tCountry = useTranslations('Country');
  const tAllProjects = useTranslations('AllProjects');
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  // store: state
  const embed = useQueryParamStore((state) => state.embed);
  const callbackUrl = useQueryParamStore((state) => state.callbackUrl);
  const token = useAuthStore((state) => state.token);

  const donateLink = getDonationUrl(
    tenantConfig.id,
    slug,
    token,
    embed || undefined,
    callbackUrl || undefined,
    undefined,
    utmCampaign || undefined
  );
  const donationLabel = useMemo(() => {
    if (unitCount === undefined) {
      return;
    }
    const formattedUnitCount =
      unitCount < 1000000
        ? localizedAbbreviatedNumber(locale, Math.floor(unitCount), 0)
        : localizedAbbreviatedNumber(locale, unitCount, 1);

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
  }, [unitCount, unitType, purpose, locale]);

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
              amount: getFormattedCurrency(locale, currency, unitCost),
              unit: unitType,
            })}
          </div>
        )}
      </div>

      {allowDonations && !disableDonations && (
        <WebappButton
          variant="primary"
          text={tCommon('donate')}
          elementType="link"
          href={donateLink}
          target={embed ? '_top' : '_blank'}
          buttonClasses={donateButtonClass}
          prefetch={true}
        />
      )}
    </div>
  );
};

export default ProjectInfoSection;
