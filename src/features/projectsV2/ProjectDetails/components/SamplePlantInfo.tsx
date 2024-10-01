import SamplePlantInfoCard from './microComponents/SamplePlantInfoCard';
import { formatHid } from '../../../../utils/projectV2';
import styles from '../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';
import { SamplePlantLocation } from '../../../common/types/plantLocation';
import getImageUrl from '../../../../utils/getImageURL';

interface Props {
  samplePlantData: SamplePlantLocation;
}

const SamplePlantInfo = ({ samplePlantData }: Props) => {
  const t = useTranslations('ProjectDetails');
  const { hid, interventionStartDate, tag, scientificName, measurements } =
    samplePlantData;
  const plantInfo = {
    interventionStartDate,
    tag,
    scientificName,
    measurements,
  };
  const image = samplePlantData.coordinates?.[0]?.image ?? '';
  return (
    <div className={styles.plantLocationInfoSection}>
      <div className={styles.sampleTreeInfoHeading}>
        <h1>{t('sampleTree')}</h1>
        <p>{formatHid(hid)}</p>
      </div>
      {image && (
        <img
          src={getImageUrl('coordinate', 'large', image)}
          className={styles.samplePlantImage}
        />
      )}
      <SamplePlantInfoCard {...plantInfo} />
    </div>
  );
};

export default SamplePlantInfo;
