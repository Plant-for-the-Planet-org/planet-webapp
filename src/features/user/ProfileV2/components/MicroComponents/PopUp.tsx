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
interface PopUpLabelProps {
  isRegistered: boolean;
}

interface ClusterPopUpLabelProps {
  geoJson: ClusterMarker | Cluster;
  mapRef: MutableRefObject<null>;
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

export const DonationPopUp = ({ geoJson, setShowPopUp, profile }) => {
  const { t } = useTranslation(['me']);
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

  return (
    <div className={MyForestMapStyle.donationPopUpMainContainer}>
      <div className={MyForestMapStyle.donationPopUpImageContainer}>
        <img
          className={MyForestMapStyle.image}
          src={getImageUrl(
            'project',
            'medium',
            geoJson?.properties?.plantProject?.image
          )}
        />
      </div>
      <div className={MyForestMapStyle.donationPopUpInfoContainer}>
        <div
          style={{
            height: '15px',
            display: 'flex',
            gap: '18px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '6px',
              width: 'max-content',
              position: 'relative',
            }}
          >
            <div style={{ fontWeight: '700', fontSize: '8px' }}>
              {t('me:plantedTrees', {
                count: geoJson.properties.quantity,
              })}
            </div>
            <div
              style={{
                fontWeight: '700',
                fontSize: '8px',
                position: 'absolute',
                left: '39px',
                bottom: '2px',
              }}
            >
              .
            </div>
            <div style={{ fontSize: '8px' }}>
              {geoJson?.properties?.plantProject?.location}
            </div>
          </div>
          <Button
            variant="contained"
            style={{
              width: '53px',
              height: '18px',
              fontSize: '10px',
              boxShadow: 'none',
              borderRadius: '24px',
              fontWeight: '700',
              padding: '2px 8px',
            }}
            onClick={() =>
              handleDonation(geoJson?.properties?.plantProject?.guid, '')
            }
          >
            {t('me:donate')}
          </Button>
        </div>
        <div style={{ fontWeight: '400', fontSize: '8px', marginTop: '4px' }}>
          {t('me:tpoName', {
            tpo: geoJson?.properties?.plantProject?.tpo.name,
          })}
        </div>
        <div
          style={{
            display: 'flex',
            fontWeight: '600',
            fontSize: '6px',
            color: 'rgba(130, 130, 130, 1)',
            marginTop: '2px',
          }}
        >
          {geoJson?.properties?.startDate && (
            <time>
              {format(geoJson?.properties?.startDate, 'PP', {
                locale:
                  localeMapForDate[localStorage.getItem('language') || 'en'],
              })}
            </time>
          )}

          {geoJson?.properties?.endDate && (
            <>
              <div style={{ marginLeft: '1px', marginRight: '1px' }}>-</div>
              <time>
                {format(geoJson?.properties?.endDate, 'PP', {
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
