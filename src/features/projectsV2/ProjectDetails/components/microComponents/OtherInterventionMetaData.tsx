import styles from '../../styles/PlantLocationInfo.module.scss';
import { useLocale, useTranslations } from 'next-intl';
import { Metadata } from '../../../../common/types/plantLocation';

interface Props {
  metaData: Metadata | undefined;
  type: string | undefined,
  plantDate: string | null | undefined;
}

const OtherInterventionMetaData = ({ metaData }: Props) => {
  const tProjectDetails = useTranslations('ProjectDetails');
  const locale = useLocale();

  function isJsonString(str: string) {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch (e) {
      return false;
    }
  }



  interface MetaDataValue {
    value: string;
    label: string;
  }
  
  interface PublicMetaData {
    [key: string]: string | MetaDataValue;
  }
  
  const renderMetaData = () => {
    const checkForPublic: { value: string; key: string }[] = [];
    const parsedData = metaData;
  
    if (parsedData?.public && typeof parsedData.public === 'object' && !Array.isArray(parsedData.public)) {
      Object.entries(parsedData.public as PublicMetaData).forEach(([key, value]) => {
        if (key !== 'isEntireSite') {
          if (typeof value === 'string') {
            checkForPublic.push({ value, key });
          } else if (typeof value === 'object' && value !== null && 'value' in value && 'label' in value) {
            if (isJsonString(value.value)) {
              try {
                const parsedValue = JSON.parse(value.value);
                if (parsedValue && typeof parsedValue === 'object' && 'value' in parsedValue) {
                  checkForPublic.push({ value: parsedValue.value, key: value.label });
                }
              } catch (error) {
                console.error('Error parsing JSON:', error);
              }
            } else {
              checkForPublic.push({ value: value.value, key: value.label });
            }
          }
        }
      });
    }
  
    return checkForPublic;
  };


  const cardData=renderMetaData()
  if(cardData.length===0){
    return null
  }
  return (
    <div className={`planting-details-group ${styles.interventionMetaDataGroup}`}>
      {cardData.map((item, key) => {
        return (
          <div
            key={key}
            className={`planting-details-item ${styles.interventionMetaItem}`}
          >
            <h2 className={styles.label}>{item.key}</h2>
            <p className={styles.data}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default OtherInterventionMetaData;
