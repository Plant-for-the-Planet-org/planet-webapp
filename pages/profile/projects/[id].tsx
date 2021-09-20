import React, { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../../src/features/user/ManageProjects';
import { getAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import  Head from 'next/head';
import i18next from '../../../i18n';

const {useTranslation} = i18next;

interface Props {}

function ManageSingleProject({}: Props): ReactElement {
  const {t} = useTranslation('me');
  const [projectGUID, setProjectGUID] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const router = useRouter();
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [setupAccess, setSetupAccess] = React.useState(false);
  const [project, setProject] = React.useState({});

  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  useEffect(() => {
    if (router && router.query.id) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadProject() {
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, token)
        .then((result) => {
          if (result.status === 401) {
            setAccessDenied(true);
            setSetupAccess(true);
          } else {
            setProject(result);
            setSetupAccess(true);
          }
        })
        .catch(() => {
          setAccessDenied(true);
          setSetupAccess(true);
        });
    }

    // ready is for router, loading is for session
    if (ready && contextLoaded && user) {
      loadProject();
    }
  }, [ready, contextLoaded, user]);

  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  // Showing error to other TPOs is left

  return setupAccess ? (
    ready && token && !accessDenied ? (
      <UserLayout>
        <Head>
          <title>{`${t('edit')} - ${project.name}`}</title>
        </Head>
        <div className="profilePage">
          <div className="profilePageHeader">
            <div>
              <div className={'profilePageTitle'}>{project.name}</div>
            </div>
          </div>
          <ManageProjects GUID={projectGUID} token={token} project={project} />
        </div>
      </UserLayout>
    ) : (
      <UserLayout>
        <GlobeContentLoader />
      </UserLayout>
    )
  ) : (
    <UserLayout>
      <GlobeContentLoader />
    </UserLayout>
  );
}

export default ManageSingleProject;
