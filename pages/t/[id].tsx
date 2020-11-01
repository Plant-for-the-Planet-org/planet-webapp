import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import PublicUserPage from '../../src/features/public/PublicUserProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const [publicUserprofile, setPublicUserprofile] = React.useState();
  const [slug, setSlug] = React.useState(null);
  const [ready, setReady] = React.useState(false);

  const router = useRouter();
  const PublicUserProps = {
    publicUserprofile,
  };

  useEffect(() => {
    if (router && router.query.id !== undefined) {
      setSlug(router.query.id);
      setReady(true);
    }
  }, [router]);

  useEffect(() => {
    async function loadPublicUserData() {

      const newPublicUserprofile = await getRequest(`/public/v1.0/en/treecounter/${slug}`);
      setPublicUserprofile(newPublicUserprofile)
    }
    if (ready) {
      loadPublicUserData();
    }
  }, [ready]);

  return (
    <>
      <GetPublicUserProfileMeta publicUserprofile={publicUserprofile} />
        {initialized && publicUserprofile ? (
            <PublicUserPage {...PublicUserProps} />
          ) : (
            <UserProfleLoader />
        )}
        <Footer />
    </>
  );
}
