import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { Cluster, ClusterMarker } from '../../../../common/types/map';
import { useMyForest } from '../../../../common/Layout/MyForestContext';
import { _getClusterGeojson } from '../../../../../utils/superclusterConfig';
import { useContext, useEffect } from 'react';
import { PopUpDonationIcon } from '../../../../../../public/assets/images/ProfilePageIcons';
import { MutableRefObject } from 'react';
import getImageUrl from '../../../../../utils/getImageURL';
import { Button } from '@mui/material';
import format from 'date-fns/format';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { getDonationUrl } from '../../../../../utils/getDonationUrl';
import { ParamsContext } from '../../../../common/Layout/QueryParamsContext';
import { useUserProps } from '../../../../common/Layout/UserPropsContext';
import { User, UserPublicProfile } from '@planet-sdk/common';
interface PopUpLabelProps {
  isRegistered: boolean;
}

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
  profile: User | UserPublicProfile;
}

export const ClusterPopUpLabel = ({
  geoJson,
  mapRef,
}: ClusterPopUpLabelProps) => {
  const { t, ready } = useTranslation(['me']);
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
      processLeaves(_getLeaves);
    } else {
      const totalContributions = geoJson?.properties.totalContributions || 1;

      setTotalDonations(totalContributions);
      setTotalProjects(1);
    }
  }, [geoJson, viewState, mapRef]);

  return ready ? (
    <div className={MyForestMapStyle.clusterPopUpContainer}>
      <div>
        <PopUpDonationIcon width={'21px'} height={'21px'} />
      </div>
      <div className={MyForestMapStyle.clusterPopUpInfo}>
        {t('me:totalDonation', {
          count: Number(totalDonations),
        })}
        {t('me:totalProject', {
          count: totalProjects,
        })}
      </div>
      <div className={MyForestMapStyle.zoomIn}>{t('me:zoomIn')}</div>
    </div>
  ) : (
    <></>
  );
};

export const PopUpLabel = ({ isRegistered }: PopUpLabelProps) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={MyForestMapStyle.popUpLabel}>
      {isRegistered ? t('me:registered') : t('me:donated')}
    </div>
  );
};

interface NumberOfContributionsProps {
  isMoreThanOneContribution: boolean | number | undefined;
  numberOfContributions: number | undefined;
}

export const NumberOfContributions = ({
  isMoreThanOneContribution,
  numberOfContributions,
}: NumberOfContributionsProps) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={MyForestMapStyle.popUpDate}>
      {isMoreThanOneContribution ? (
        t('me:numberOfContributions', {
          total: `${numberOfContributions}`,
        })
      ) : (
        <></>
      )}
    </div>
  );
};

interface DateOnThePopUpProps {
  isDate: number;
  dateOfGift: Date | number;
  dateOfDonation: string | number | Date;
  endDate: string;
  isSingleContribution: boolean;
}
export const DateOnThePopUp = ({
  isDate,
  dateOfGift,
  dateOfDonation,
  endDate,
  isSingleContribution,
}: DateOnThePopUpProps) => {
  return (
    <>
      {isDate &&
        (isSingleContribution ? (
          <time>{formatDate(dateOfDonation || dateOfGift)}</time>
        ) : (
          <time>
            {formatDate(dateOfDonation)} - {formatDate(endDate as string)}
          </time>
        ))}
    </>
  );
};

interface InfoOnthePopUpProps {
  geoJson: ClusterMarker | Cluster;
}

export const InfoOnthePopUp = ({ geoJson }: InfoOnthePopUpProps) => {
  return (
    <div
      className={
        geoJson?.properties.totalContributions > 1 ||
        geoJson.properties._type === 'merged_contribution_and_gift'
          ? MyForestMapStyle.popUpContainerLarge
          : MyForestMapStyle.popUpContainer
      }
    >
      <div className={MyForestMapStyle.popUp}>
        <PopUpLabel
          isRegistered={geoJson.properties.contributionType === 'planting'}
        />
        <NumberOfContributions
          isMoreThanOneContribution={
            geoJson.properties.totalContributions &&
            geoJson.properties.totalContributions > 1
          }
          numberOfContributions={geoJson.properties.totalContributions}
        />
        <DateOnThePopUp
          isDate={
            geoJson.properties.totalContributions < 2 ||
            geoJson?.properties?.startDate ||
            geoJson?.properties?.created
          }
          dateOfGift={geoJson?.properties?.created}
          dateOfDonation={geoJson?.properties?.startDate}
          endDate={
            geoJson?.properties?.endDate
              ? geoJson?.properties?.endDate
              : undefined
          }
          isSingleContribution={
            geoJson?.properties?.totalContributions == 1 ||
            geoJson?.properties?.totalContributions == 0 ||
            geoJson?.properties?._type === 'gift'
          }
        />
      </div>
    </div>
  );
};

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
}: DonationPopUpProps) => {
  const { t, ready } = useTranslation(['me', 'country']);
  const { embed } = useContext(ParamsContext);
  const { token } = useUserProps();
  const handleDonation = (id: string, tenant: string) => {
    const url = getDonationUrl(
      tenant,
      id,
      token,
      undefined,
      undefined,
      profile.slug
    );
    embed === 'true'
      ? window.open(url, '_blank')
      : (window.location.href = url);
  };

  return ready ? (
    <div className={MyForestMapStyle.donationPopUpMainContainer}>
      <div className={MyForestMapStyle.donationPopUpImageContainer}>
        <img
          className={MyForestMapStyle.image}
          src={getImageUrl('project', 'medium', projectImage)}
        />
      </div>
      <div className={MyForestMapStyle.projectName}>{projectName}</div>
      <div className={MyForestMapStyle.donationPopUpInfoMainContainer}>
        <div className={MyForestMapStyle.donationPopUpInfoContainer}>
          <div className={MyForestMapStyle.countryAndTreeInfo}>
            <div>
              {t('me:plantedTrees', {
                count: numberOfTrees,
              })}
            </div>
            <div className={MyForestMapStyle.separatorContainer}>
              <div className={MyForestMapStyle.seprator}>.</div>
            </div>
            <div className={MyForestMapStyle.country}>
              {t(`country:${country}`)}
            </div>
          </div>
          <Button
            variant="contained"
            className={MyForestMapStyle.donateButton}
            onClick={() => handleDonation(projectId, '')}
          >
            {t('me:donate')}
          </Button>
        </div>
        <div className={MyForestMapStyle.tpoName}>
          {t('me:tpoName', {
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
              <div style={{ marginLeft: '1px', marginRight: '1px' }}>-</div>
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
  ) : (
    <></>
  );
};
