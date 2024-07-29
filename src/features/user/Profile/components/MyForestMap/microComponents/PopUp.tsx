import { useLocale, useTranslations } from 'next-intl';
import MyForestMapStyle from '../../../styles/MyForestMap.module.scss';
import formatDate from '../../../../../../utils/countryCurrency/getFormattedDate';
import { Cluster, ClusterMarker } from '../../../../../common/types/map';
import { useMyForest } from '../../../../../common/Layout/MyForestContext';
import { _getClusterGeojson } from '../../../../../../utils/superclusterConfigV1';
import { useContext, useEffect } from 'react';
import { PopUpDonationIcon } from '../../../../../../../public/assets/images/ProfilePageIcons';
import { MutableRefObject } from 'react';
import getImageUrl from '../../../../../../utils/getImageURL';
import { Button } from '@mui/material';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../../utils/language/getLanguageName';
import { getDonationUrl } from '../../../../../../utils/getDonationUrl';
import { ParamsContext } from '../../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../../common/Layout/UserPropsContext';
import { User, UserPublicProfile } from '@planet-sdk/common';
import { useTenant } from '../../../../../common/Layout/TenantContext';
import { useRouter } from 'next/router';

interface ClusterPopUpLabelProps {
  geoJson: ClusterMarker | Cluster;
  mapRef: MutableRefObject<null>;
}

interface DonationPopUpProps {
  startDate: number | Date;
  endDate: number | Date;
  country: string;
  projectName: string;
  projectImage: string;
  numberOfTrees: number;
  totalContribution: number;
  projectId: string;
  tpoName: string;
  profile: User | UserPublicProfile | undefined;
  isDonatable: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

interface DateOnThePopUpProps {
  dateOfDonation: string | number | Date;
}
interface RegisteredTreePopUpProps {
  geoJson: ClusterMarker | Cluster;
  onMouseLeave: () => void;
}

export const PopUpLabel = () => {
  const t = useTranslations('Profile');
  return (
    <div className={MyForestMapStyle.popUpLabel}>
      {t('myForestMap.registered')}
    </div>
  );
};

export const DateOnThePopUp = ({ dateOfDonation }: DateOnThePopUpProps) => {
  return <time>{formatDate(dateOfDonation)}</time>;
};

//this popup will be appear at the last zoom level for only registered tree contribution marker
export const RegisteredTreePopUp = ({
  geoJson,
  onMouseLeave,
}: RegisteredTreePopUpProps) => {
  return (
    <div
      className={MyForestMapStyle.popUpContainer}
      onMouseLeave={onMouseLeave}
    >
      <div className={MyForestMapStyle.popUp}>
        <PopUpLabel />
        <DateOnThePopUp dateOfDonation={geoJson?.properties?.startDate} />
      </div>
    </div>
  );
};
//this popup will be appear at the first zoom level for all type of contributions
export const ClusterPopUpLabel = ({
  geoJson,
  mapRef,
}: ClusterPopUpLabelProps) => {
  const t = useTranslations('Profile');
  const {
    totalDonations,
    setTotalDonations,
    treePlantationProjectGeoJson,
    totalProjects,
    setTotalProjects,
    viewport,
  } = useMyForest();

  const { viewState } = viewport;

  useEffect(() => {
    const processLeaves = (_getLeaves: ClusterMarker[]) => {
      if (_getLeaves) {
        const _totalDonationsOfCLuster = _getLeaves.reduce(
          (sum, obj) => sum + Number(obj.properties?.totalContributions || 0),
          0
        );

        const _excludeRegisterTreeLeaves = _getLeaves.filter(
          (geoJson) => geoJson.properties.contributionType !== 'planting'
        );

        const _onlyRegisteredTreeLeaves = _getLeaves.filter(
          (geoJson) => geoJson.properties.contributionType === 'planting'
        );

        if (_onlyRegisteredTreeLeaves.length !== 0) {
          setTotalDonations(_onlyRegisteredTreeLeaves.length);
          setTotalProjects(_onlyRegisteredTreeLeaves.length);
        }

        if (_excludeRegisterTreeLeaves.length !== 0) {
          setTotalProjects(_excludeRegisterTreeLeaves.length);
        }

        if (_totalDonationsOfCLuster) {
          setTotalDonations(_totalDonationsOfCLuster);
        }
      }
    };

    if (geoJson?.properties.cluster && viewState) {
      const _getLeaves = _getClusterGeojson(
        viewState,
        mapRef,
        treePlantationProjectGeoJson,
        geoJson.id
      );
      if (_getLeaves) {
        processLeaves(_getLeaves);
      }
    } else {
      const totalContributions = geoJson?.properties.totalContributions || 1;

      setTotalDonations(totalContributions);
      setTotalProjects(1);
    }
  }, [geoJson, viewState, mapRef]);

  return (
    <div className={MyForestMapStyle.clusterPopUpContainer}>
      <div>
        <PopUpDonationIcon width="21px" height="21px" />
      </div>
      <div className={MyForestMapStyle.clusterPopUpInfo}>
        {t('myForestMap.totalDonation', {
          count: Number(totalDonations),
        })}
        {t('myForestMap.totalProject', {
          count: totalProjects,
        })}
      </div>
      <div className={MyForestMapStyle.zoomIn}>{t('myForestMap.zoomIn')}</div>
    </div>
  );
};
//this popup will be appear at last zoom level (except registered tree contribution marker)
export const DonationPopUp = ({
  startDate,
  endDate,
  country,
  projectName,
  projectImage,
  numberOfTrees,
  totalContribution,
  projectId,
  tpoName,
  profile,
  isDonatable,
  onMouseEnter,
  onMouseLeave,
}: DonationPopUpProps) => {
  const router = useRouter();
  const t = useTranslations('Profile');
  const locale = useLocale();
  const tCountry = useTranslations('Country');
  const { embed } = useContext(ParamsContext);
  const { token } = useUserProps();
  const { tenantConfig } = useTenant(); //default tenant
  const handleDonation = (id: string, tenant: string) => {
    if (profile) {
      const url = getDonationUrl(
        tenant,
        id,
        token,
        undefined,
        undefined,
        router.asPath !== `/${locale}/profile` ? profile.slug : undefined
      );
      embed === 'true'
        ? window.open(encodeURI(url), '_blank')
        : (window.location.href = encodeURI(url));
    }
  };
  return (
    <div
      className={MyForestMapStyle.donationPopUpMainContainer}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={MyForestMapStyle.donationPopUpImageContainer}>
        <img
          className={MyForestMapStyle.image}
          src={getImageUrl('project', 'medium', projectImage)}
          alt={projectName}
        />
      </div>
      <div className={MyForestMapStyle.projectName}>{projectName}</div>
      <div className={MyForestMapStyle.donationPopUpInfoMainContainer}>
        <div className={MyForestMapStyle.donationPopUpInfoContainer}>
          <div className={MyForestMapStyle.countryAndTreeInfo}>
            <div>
              {t('myForestMap.plantedTree', {
                count: numberOfTrees,
              })}
            </div>
            <div className={MyForestMapStyle.separatorContainer}>
              <div className={MyForestMapStyle.seprator}>.</div>
            </div>
            <div className={MyForestMapStyle.country}>{tCountry(country)}</div>
          </div>
          <Button
            variant="contained"
            className={MyForestMapStyle.donateButton}
            onClick={() => handleDonation(projectId, tenantConfig.id)}
            disabled={!isDonatable}
          >
            {t('myContributions.donate')}
          </Button>
        </div>
        <div className={MyForestMapStyle.tpoName}>
          {t('myForestMap.tpoName', {
            tpo: tpoName,
          })}
        </div>
        <div className={MyForestMapStyle.donationDate}>
          {startDate && (
            <time>
              {format(startDate, 'PP', {
                locale:
                  localeMapForDate[localStorage.getItem('language') || 'en'],
              })}
            </time>
          )}

          {endDate && totalContribution > 1 && (
            <>
              <div className={MyForestMapStyle.donationDateX}>-</div>
              <time>
                {format(endDate, 'PP', {
                  locale:
                    localeMapForDate[localStorage.getItem('language') || 'en'],
                })}
              </time>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
