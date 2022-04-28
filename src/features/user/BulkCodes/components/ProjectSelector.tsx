import React, { ReactElement, useEffect } from 'react';
// import i18next from '../../../../../i18n';

import ProjectSelectAutocomplete from './ProjectSelectAutocomplete';
import UnitCostDisplay from './UnitCostDisplay';

// const { useTranslation } = i18next;

interface ProjectSelectorProps {
  project: Object | null;
  setProject?: (project: Object | null) => void;
  active?: boolean;
}

const ProjectSelector = ({
  project,
  setProject,
  active = true,
}: ProjectSelectorProps): ReactElement | null => {
  // const { t, ready } = useTranslation(['common', 'bulkCodes']);

  const handleProjectChange = (project: Object | null) => {
    if (setProject) {
      setProject(project);
    }
  };

  useEffect(() => {
    async function loadProject() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== i18n.language
      ) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setInternalLanguage(i18n.language);
        setCurrencyCode(currency);
        const project = await getRequest(
          `/app/projects/${router.query.p}`,
          handleError,
          '/',
          {
            _scope: 'extended',
            currency: currency,
            locale: i18n.language,
          }
        );
        setProject(project);
        setShowSingleProject(true);
        setZoomLevel(2);
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode, i18n.language]);

  return (
    <>
      <ProjectSelectAutocomplete
        handleProjectChange={handleProjectChange}
        project={project}
        active={active}
      />
      <UnitCostDisplay unitCost={1.12} currency="USD" unit="tree" />
    </>
  );
};

export default ProjectSelector;
