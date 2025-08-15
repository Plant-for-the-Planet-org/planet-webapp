import TreeMapperIcon from '../../../../../../public/assets/images/icons/projectV2/TreeMapperIcon';
import styles from '../../styles/InterventionInfo.module.scss';
import { useTranslations } from 'next-intl';

const TreeMapperBrand = () => {
  const tProjectDetails = useTranslations('ProjectDetails');
  return (
    <div className={styles.treeMapperLabelContainer}>
      <div className={styles.treeMapperLabelSubContainer}>
        {tProjectDetails.rich('treeMapperBrand', {
          iconText: (chunks) => (
            <div className={styles.treeMapperLabel}>
              <TreeMapperIcon />
              {chunks}
            </div>
          ),
        })}
      </div>
    </div>
  );
};

export default TreeMapperBrand;
