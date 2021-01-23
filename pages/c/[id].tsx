import { useRouter } from 'next/router';
import React, { ReactElement } from 'react'
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import Footer from '../../src/features/common/Layout/Footer';
import LandingSection from '../../src/features/common/Layout/LandingSection';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import SingleContribution from '../../src/features/user/UserProfile/components/RegisterTrees/SingleContribution';
import { getLocalUserInfo } from '../../src/utils/auth0/localStorageUtils';
import { useAuth0 } from '@auth0/auth0-react';

export default function SingleContributionPage(): ReactElement {
    const [contributionGUID, setContributionGUID] = React.useState(null);
    const [ready, setReady] = React.useState(false);
    const router = useRouter();
    const [accessDenied, setAccessDenied] = React.useState(false);
    const [setupAccess, setSetupAccess] = React.useState(false);
    const [contribution, setContribution] = React.useState({});
    const [currentUserSlug, setCurrentUserSlug] = React.useState();

    const [token, setToken] = React.useState('')
    const {
      isLoading,
      isAuthenticated,
      getAccessTokenSilently
    } = useAuth0();

    React.useEffect(() => {
        if (router && router.query.id) {
            setContributionGUID(router.query.id);
            setReady(true);
        }
    }, [router]);
    
    // This effect is used to get and update UserInfo if the isAuthenticated changes
    React.useEffect(() => {
      async function loadFunction() {
        const token = await getAccessTokenSilently();
        setToken(token);
        getLocalUserInfo() && getLocalUserInfo().slug
          ? setCurrentUserSlug(getLocalUserInfo().slug)
          : null;
        };
      if (isAuthenticated && !isLoading) {
        loadFunction()
      }
    }, [isAuthenticated, isLoading])

    // This effect is used to get and update contribution if the isAuthenticated changes
    React.useEffect(() => {
      async function loadFunction() {
        const token = await getAccessTokenSilently();
        getAuthenticatedRequest(`/app/contribution/${contributionGUID}`, token).then((result) => {
            if (result.status === 401) {
                setAccessDenied(true)
                setSetupAccess(true)
            } else {
                setContribution(result)
                setSetupAccess(true)
            }
        }).catch(() => {
            setAccessDenied(true)
            setSetupAccess(true)
        })};
      // ready is for router, loading is for session
      if (ready && isAuthenticated && !isLoading) {
        loadFunction()
      }
    }, [ready, isAuthenticated, isLoading])

    if (accessDenied && setupAccess) {
        return (
            <>
                <AccessDeniedLoader />
                <Footer />
            </>
        )
    }

    const ContributionProps = {
        token,
        contribution,
        contributionGUID,
        currentUserSlug
    }

    // Showing error to other TPOs is left
    return setupAccess ? (ready && token && !accessDenied) ? (
        <>
            <LandingSection
                fixedBg={true}
                imageSrc={
                    process.env.CDN_URL
                        ? `${process.env.CDN_URL}/media/images/app/bg_layer.jpg`
                        : `https://cdn.plant-for-the-planet.org/media/images/app/bg_layer.jpg`
                }
            >
                {currentUserSlug ?
                    <SingleContribution {...ContributionProps} />
                    : null}
            </LandingSection>

        </>
    ) : (<h2>NO Project ID FOUND</h2>) :
        (
            <>
                <GlobeContentLoader />
                <Footer />
            </>
        )
}
