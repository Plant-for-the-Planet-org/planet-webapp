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
  const { projects, setFilteredProjects, filtersOpen, setFilterOpen } =
    React.useContext(ProjectPropsContext);

  const [purpose, setPurpose] = React.useState({
    restoration: true,
    conservation: true,
  });

  const [type, setType] = React.useState({
    'natural-regeneration': true,
    'managed-regeneration': true,
    'large-scale-planting': true,
    agroforestry: true,
    'urban-planting': true,
    'other-planting': true,
    mangroves: true,
  });

  const [filters, setFilters] = React.useState(null);

  React.useEffect(() => {
    function filterProjects() {
      const filteredProjects = projects.filter((project: any) => {
        const { classification } = project?.properties;
        if (type[classification]) {
          return true;
        } else {
          return false;
        }
      });
      setFilteredProjects(filteredProjects);
    }
    if (projects) {
      if (process.env.TENANT === 'salesforce') {
        filterProjects();
      } else {
        setFilteredProjects(projects);
      }
    }
  }, [projects, purpose, type]);

  React.useEffect(() => {
    function getFilters() {
      const filters = projects.map((project) => {
        const { classification } = project?.properties;
        if (classification) {
          return classification;
        }
      });
      const uniqueFilters = [...new Set(filters)];
      return uniqueFilters;
    }
    if (projects && process.env.TENANT === 'salesforce') {
      const filters = getFilters().filter((filter) => filter);
      setFilters(filters);
    }
  }, [projects]);

  const handlePurposeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPurpose({ ...purpose, [event.target.name]: event.target.checked });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType({ ...type, [event.target.name]: event.target.checked });
  };

  return process.env.TENANT === 'salesforce' && ready ? (
    <div className={styles.filtersContainer}>
      <div className={styles.filterButtonContainer}>
        <div
          onClick={() => setFilterOpen(!filtersOpen)}
          className={`${styles.filterButton} ${
            filtersOpen ? styles.selected : ''
          }`}
        >
          <div className={styles.filterButtonText}>{t('donate:filters')}</div>
          <div
            className={`${styles.dropdownIcon} ${
              filtersOpen ? styles.selected : ''
            }`}
          ></div>
        </div>
        {filtersOpen && (
          <div className={styles.dropdownContainer}>
            {/* <div className={styles.filterTitle}>{t('donate:projectPurpose')}</div>
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
          </FormGroup> */}
            <div className={styles.filterTitle}>{t('donate:projectType')}</div>
            <FormGroup style={{ width: '100%' }}>
              {filters &&
                filters.map((filter: any, index: number) => {
                  return (
                    <div key={index} className={styles.filterToggleRow}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={type[filter]}
                            onChange={handleTypeChange}
                            name={filter}
                          />
                        }
                        label={t(`donate:${filter}`)}
                      />
                      {/* <div className={styles.filterInfo}>
                <InfoIcon />
              </div> */}
                    </div>
                  );
                })}
            </FormGroup>
          </div>
        )}
      </div>
    </div>
  ) : <></>;
}
