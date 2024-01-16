import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { Cluster, ClusterMarker } from '../../../../common/types/map';

interface PopUpLabelProps {
  isRegistered: boolean;
}

export const ClusterPopUpLabel = ({
  totalRegisteredDonation,
  totalNumberOfDonation,
  numberOfProject,
  singleContribution,
  totalContribution,
}) => {
  const { t, ready } = useTranslation(['me']);
  return ready ? (
    <div
      style={{
        width: '225px',
        height: '90px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {totalRegisteredDonation ? (
        <div>
          {t('me:registeredContribution', {
            totalContribution: totalRegisteredDonation,
          })}
        </div>
      ) : (
        <div>
          {singleContribution
            ? t('me:clusterLabelx', {
                numberOfDonation: totalContribution,
                clusterChildren: numberOfProject ? numberOfProject : 1,
              })
            : t('me:clusterLabely', {
                numberOfDonation: totalNumberOfDonation,
                clusterChildren: numberOfProject,
              })}
        </div>
      )}

      <div>{t('me:zoomIn')}</div>
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
