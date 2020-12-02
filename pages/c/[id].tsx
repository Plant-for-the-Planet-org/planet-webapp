import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react'
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import Footer from '../../src/features/common/Layout/Footer';
import LandingSection from '../../src/features/common/Layout/LandingSection';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import SingleContribution from '../../src/features/user/UserProfile/components/RegisterTrees/SingleContribution';
import { getUserInfo } from '../../src/utils/auth0/localStorageUtils';

export default function SingleContributionPage(): ReactElement {
    const [contributionGUID, setContributionGUID] = React.useState(null);
    const [ready, setReady] = React.useState(false);
    const [session, loading] = useSession();
    const router = useRouter();
    const [accessDenied, setAccessDenied] = React.useState(false);
    const [setupAccess, setSetupAccess] = React.useState(false);
    const [contribution, setContribution] = React.useState({});
    const [currentUserSlug, setCurrentUserSlug] = React.useState();

    React.useEffect(() => {
        if (router && router.query.id) {
            setContributionGUID(router.query.id);
            setReady(true);
        }
    }, [router]);

    React.useEffect(() => {
        getUserInfo() && getUserInfo().slug ? setCurrentUserSlug(getUserInfo().slug) : null;
    }, [loading]);

    React.useEffect(() => {
        async function loadContribution() {
            getAuthenticatedRequest(`/app/contribution/${contributionGUID}`, session).then((result) => {
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
            })
        }
        // ready is for router, loading is for session
        if (ready && !loading) {
            loadContribution();
        }
    }, [ready, loading]);

    if (!loading && !session) {
        signIn('auth0', { callbackUrl: `/login` });
    }

    if (accessDenied && setupAccess) {
        return (
            <>
                <AccessDeniedLoader />
                <Footer />
            </>
        )
    }

    const ContributionProps = {
        session,
        contribution,
        contributionGUID,
        currentUserSlug
    }

    // Showing error to other TPOs is left
    return setupAccess ? (ready && session && !accessDenied) ? (
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
