import TreeMapperIcon from '../../../../../../public/assets/images/icons/projectV2/TreeMapperIcon';
import styles from '../../styles/PlantLocationInfo.module.scss';
import { useTranslations } from 'next-intl';

const TreeMapperBrand = () => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={styles.treeMapperLabelContainer}>
      <div className={styles.treeMapperLabelSubContainer}>
        <p>{tProjectDetails('poweredBy')}</p>
        <div>
          <TreeMapperIcon />
        </div>
        <p className={styles.treeMapperLabel}>
          {tProjectDetails('treeMapper')}
        </p>
      </div>
    </div>
  );
};

export default TreeMapperBrand;
