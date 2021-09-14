import React, { ReactElement } from 'react';
import styles from '../../styles/Filters.module.scss';
import i18next from '../../../../../i18n/';
import { FormControlLabel, FormGroup } from '@material-ui/core';
import Switch from '../../../common/InputTypes/ToggleSwitch';
import InfoIcon from '../../../../../public/assets/images/icons/InfoIcon';
import { ProjectPropsContext } from '../../../common/Layout/ProjectPropsContext';

const { useTranslation } = i18next;

interface Props {}

export default function Filters({}: Props): ReactElement {
  const { t, ready } = useTranslation(['donate']);

  const { projects, setProjects } = React.useContext(ProjectPropsContext);

  const [purpose, setPurpose] = React.useState({
    restoration: true,
    conservation: true,
  });

  const [type, setType] = React.useState({
    "natural-regeneration": true,
    "managed-regeneration": true,
    "large-scale-planting": true,
    "agroforestry": true,
    "urban-planting":true,
    "other-planting":true,
    "mangroves":true
  });

  React.useEffect(() => {
      async function filterProjects() {
      const filteredProjects = await projects.filter((project:any) => {
          const {classification} = project?.properties;
              if (type[classification]) {
                  return true;
              } else {
                  return false;
              }
      });
    //   setProjects(filteredProjects);
    console.log(`filteredProjects`, filteredProjects)
    }
    filterProjects();
  }), [purpose,type];

  const handlePurposeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose({ ...purpose, [event.target.name]: event.target.checked });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType({ ...type, [event.target.name]: event.target.checked });
  };

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterButtonContainer}>
        <div className={styles.filterButton}>
          <div className={styles.filterButtonText}>{t('donate:purpose')}</div>
          <div className={styles.dropdownIcon}></div>
        </div>
        <div className={styles.dropdownContainer}>
          <div className={styles.filterTitle}>{t('donate:projectPurpose')}</div>
          <FormGroup style={{ width: '100%' }}>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={purpose.restoration}
                    onChange={handlePurposeChange}
                    name="restoration"
                  />
                }
                label={t('donate:restoration')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={purpose.conservation}
                    onChange={handlePurposeChange}
                    name="conservation"
                  />
                }
                label={t('donate:conservation')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
          </FormGroup>
        </div>
      </div>
      <div className={styles.filterButtonContainer}>
        <div className={styles.filterButton}>
          <div className={styles.filterButtonText}>{t('donate:type')}</div>
          <div className={styles.dropdownIcon}></div>
        </div>
        <div className={styles.dropdownContainer}>
          <div className={styles.filterTitle}>{t('donate:projectType')}</div>
          <FormGroup style={{ width: '100%' }}>
          <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['natural-regeneration']}
                    onChange={handleTypeChange}
                    name="natural-regeneration"
                  />
                }
                label={t('donate:natural-regeneration')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['managed-regeneration']}
                    onChange={handleTypeChange}
                    name="managed-regeneration"
                  />
                }
                label={t('donate:managed-regeneration')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['large-scale-planting']}
                    onChange={handleTypeChange}
                    name="large-scale-planting"
                  />
                }
                label={t('donate:large-scale-planting')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['urban-planting']}
                    onChange={handleTypeChange}
                    name="urban-planting"
                  />
                }
                label={t('donate:urban-planting')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['other-planting']}
                    onChange={handleTypeChange}
                    name="other-planting"
                  />
                }
                label={t('donate:other-planting')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['agroforestry']}
                    onChange={handleTypeChange}
                    name="agroforestry"
                  />
                }
                label={t('donate:agroforestry')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
            <div className={styles.filterToggleRow}>
              <FormControlLabel
                control={
                  <Switch
                    checked={type['mangroves']}
                    onChange={handleTypeChange}
                    name="mangroves"
                  />
                }
                label={t('donate:mangroves')}
              />
              <div className={styles.filterInfo}>
                <InfoIcon />
              </div>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
  );
}
