import React, { ReactElement, useEffect } from 'react';
import { useRouter } from 'next/router';
import ManageProjects from '../../../src/features/user/ManageProjects';
import { getAuthenticatedRequest } from '../../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../../src/features/common/Layout/Footer';
import { UserPropsContext } from '../../../src/features/common/Layout/UserPropsContext';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticPaths } from 'next';

interface Props {}

function ManageSingleProject({}: Props): ReactElement {
  const { t } = useTranslation(['manageProjects', 'common']);
  const [projectGUID, setProjectGUID] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const router = useRouter();
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [setupAccess, setSetupAccess] = React.useState(false);
  const [project, setProject] = React.useState({});
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);

  const { handleError } = React.useContext(ErrorHandlingContext);

  useEffect(() => {
    if (router && router.query.id) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadProject() {
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}`,
        token,
        {},
        handleError,
        '/profile'
      )
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
          <title>{`${t('common:edit')} - ${project.name}`}</title>
        </Head>
        <div className="profilePage">
          <div className="profilePageHeader">
            <div>
              <div className={'profilePageTitle'}>{project.name}</div>
              <div style={{ marginBottom: 15 }}>
                {t('manageProjects:onlyEnglish')}
              </div>
            </div>
          </div>
          <div style={{ marginTop: '60px' }}>
            <ManageProjects
              GUID={projectGUID}
              token={token}
              project={project}
            />
          </div>
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}

export default ManageSingleProject;
