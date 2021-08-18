import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import Footer from '../../src/features/common/Layout/Footer';
import LandingSection from '../../src/features/common/Layout/LandingSection';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import SingleContribution from '../../src/features/user/RegisterTrees/RegisterTrees/SingleContribution';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';

export default function SingleContributionPage(): ReactElement {
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);
  const [contributionGUID, setContributionGUID] = React.useState(null);
  const [ready, setReady] = React.useState(false);
  const router = useRouter();
  const [accessDenied, setAccessDenied] = React.useState(false);
  const [setupAccess, setSetupAccess] = React.useState(false);
  const [contribution, setContribution] = React.useState({});

  React.useEffect(() => {
    if (router && router.query.id) {
      setContributionGUID(router.query.id);
      setReady(true);
    }
  }, [router]);

  // This effect is used to get and update contribution if the isAuthenticated changes
  React.useEffect(() => {
    async function loadFunction() {
      getAuthenticatedRequest(`/app/contribution/${contributionGUID}`, token)
        .then((result) => {
          if (result.status === 401) {
            setAccessDenied(true);
            setSetupAccess(true);
          } else {
            setContribution(result);
            setSetupAccess(true);
          }
        })
        .catch(() => {
          setAccessDenied(true);
          setSetupAccess(true);
        });
    }
    // ready is for router, loading is for session
    if (ready && contextLoaded) {
      if (token) loadFunction();
    }
  }, [ready, contextLoaded]);

  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    );
  }

  const ContributionProps = {
    token,
    contribution,
    contributionGUID,
    slug: user.slug,
  };

  // Showing error to other TPOs is left
  return setupAccess ? (
    ready && token && !accessDenied ? (
      <>
        <LandingSection
          fixedBg={true}
          imageSrc={
            process.env.CDN_URL
              ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
              : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
          }
        >
          {user.slug ? <SingleContribution {...ContributionProps} /> : null}
        </LandingSection>
      </>
    ) : (
      <h2>NO Project ID FOUND</h2>
    )
  ) : (
    <>
      <GlobeContentLoader />
      <Footer />
    </>
  );
}
