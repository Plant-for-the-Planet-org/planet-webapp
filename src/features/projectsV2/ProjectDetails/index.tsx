import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { ProjectExtend, useProjects } from '../ProjectsContext';
import ProjectInfoSection from './components/ProjectInfoSection';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import { handleError, APIError } from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';

const ProjectDetails = ({
  currencyCode,
  isMobile,
}: {
  currencyCode: string;
  isMobile: boolean;
}) => {
  const {
    singleProject,
    setSingleProject,
    setIsLoading,
    setIsError,
    setSelectedMode,
    setSelectedClassification,
    setDebouncedSearchValue,
  } = useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (setSelectedMode) setSelectedMode('list');
    setSelectedClassification([]);
    setDebouncedSearchValue('');
  }, []);

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      setIsError(false);
      try {
        const { p } = router.query;
        const fetchedProject = await getRequest<ProjectExtend>(
          tenantConfig.id,
          `/app/projects/${p}`,
          {
            _scope: 'extended',
            currency: currencyCode,
            locale: locale,
          }
        );
        setSingleProject(fetchedProject);
      } catch (err) {
        setErrors(handleError(err as APIError));
        setIsError(true);
        redirect('/');
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [router.query.p, locale, currencyCode]);

  return singleProject ? (
    <div className={styles.projectDetailsContainer}>
      <ProjectSnippet
        project={singleProject}
        showPopup={false}
        showBackButton={true}
      />
      <ProjectInfoSection
        project={singleProject}
        isMobile={isMobile}
        setSelectedMode={setSelectedMode}
      />
    </div>
  ) : null;
};

export default ProjectDetails;
