import { useTranslation } from 'next-i18next';
import MyForestMapStyle from '../../styles/MyForestMap.module.scss';
import formatDate from '../../../../../utils/countryCurrency/getFormattedDate';
import { Cluster, ClusterMarker } from '../../../../common/types/map';

interface PopUpLabelProps {
  isConservation: boolean;
  isNormalTreeDonation: boolean;
  isRegisteredTree: boolean;
}

export const PopUpLabel = ({
  isConservation,
  isNormalTreeDonation,
  isRegisteredTree,
}: PopUpLabelProps) => {
  const { t } = useTranslation(['me']);
  return (
    <div className={MyForestMapStyle.popUpLabel}>
      {isConservation
        ? t('me:conserved')
        : isNormalTreeDonation
        ? isRegisteredTree
          ? t('me:registered')
          : t('me:donated')
        : null}
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

interface DateInThePopUpProps {
  isDate: number;
  dateOfGift: Date | number;
  dateOfDonation: string | number | Date;
  endDate: string;
  isSingleContribution: boolean;
}
export const DateInThePopUp = ({
  isDate,
  dateOfGift,
  dateOfDonation,
  endDate,
  isSingleContribution,
}: DateInThePopUpProps) => {
  return (
    <>
      {isDate &&
        (isSingleContribution ? (
          <time>{formatDate(dateOfDonation || dateOfGift)}</time>
        ) : (
          <time className={MyForestMapStyle.popUpDate}>
            {formatDate(dateOfDonation)} - {formatDate(endDate as string)}
          </time>
        ))}
    </>
  );
};

interface InfoInthePopUpProps {
  geoJson: ClusterMarker | Cluster;
}

export const InfoInthePopUp = ({ geoJson }: InfoInthePopUpProps) => {
  return (
    <div
      className={
        geoJson.properties.totalContribution > 1
          ? MyForestMapStyle.popUpContainerLarge
          : MyForestMapStyle.popUpContainer
      }
    >
      <div className={MyForestMapStyle.popUp}>
        <PopUpLabel
          isConservation={geoJson.properties?.purpose === 'conservation'}
          isNormalTreeDonation={
            geoJson.properties?.purpose === 'trees' ||
            geoJson.properties?.purpose === null
          }
          isRegisteredTree={geoJson.properties.contributionType === 'planting'}
        />
        <NumberOfContributions
          isMoreThanOneContribution={
            geoJson.properties.totalContribution &&
            geoJson.properties.totalContribution > 1
          }
          numberOfContributions={geoJson.properties.totalContribution}
        />
        <DateInThePopUp
          isDate={
            geoJson.properties.totalContribution < 2 ||
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
            geoJson?.properties?.totalContribution == 1 ||
            geoJson?.properties?.totalContribution == 0 ||
            geoJson?.properties?._type
          }
        />
      </div>
    </div>
  );
};
