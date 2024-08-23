import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProjectSnippet from '../ProjectSnippet';
import { useProjects } from '../ProjectsContext';
import ProjectInfoSection from './components/ProjectInfoSection';
import { getRequest } from '../../../utils/apiRequests/api';
import { useTenant } from '../../common/Layout/TenantContext';
import { useLocale } from 'next-intl';
import {
  TreeProjectExtended,
  ConservationProjectExtended,
  handleError,
  APIError,
} from '@planet-sdk/common';
import { ErrorHandlingContext } from '../../common/Layout/ErrorHandlingContext';
import styles from './ProjectDetails.module.scss';

const ProjectDetails = ({ currencyCode }: { currencyCode: string }) => {
  const { singleProject, setSingleProject, setIsLoading, setIsError } =
    useProjects();
  const { setErrors, redirect } = useContext(ErrorHandlingContext);
  const { tenantConfig } = useTenant();
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    async function loadProject() {
      setIsLoading(true);
      setIsError(false);
      try {
        const { p } = router.query;
        const fetchedProject = await getRequest<
          TreeProjectExtended | ConservationProjectExtended
        >(tenantConfig.id, `/app/projects/${p}`, {
          _scope: 'extended',
          currency: currencyCode,
          locale: locale,
        });
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
      <ProjectInfoSection project={singleProject} />
    </div>
  ) : null;
};

export default ProjectDetails;
