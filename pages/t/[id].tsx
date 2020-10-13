import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfleLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import TPOProfile from '../../src/features/public/UserProfile/screens/TpoProfile';
import GetPublicUserProfileMeta from '../../src/utils/getMetaTags/GetPublicUserProfileMeta';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';
import IndividualProfile from '../../src/features/public/UserProfile/screens/IndividualProfile';

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
      // If the user is logged in and there is a session, check if the slug fetched matches with the slug in the session
      // If it matches load Private user page -> Session.userprofile
      // If it doesn't match load Public user page
      const newPublicUserprofile = await getRequest(`/public/v1.0/en/treecounter/${slug}`);
      setPublicUserprofile(newPublicUserprofile)
    }
    if (ready) {
      loadPublicUserData();
    }
  }, [ready]);

  function getUserProfile(){
    switch(publicUserprofile?.userProfile.type){
      case 'tpo': return (<TPOProfile {...PublicUserProps} />);
      case 'individual': return (<IndividualProfile {...PublicUserProps} />)
    }
  }
  
  return (
    <>
      <GetPublicUserProfileMeta publicUserprofile={publicUserprofile} />

        {/* If the user is logged in and the slug matches, load private user PrivateUserPage
        Else load Public user page */}
        {initialized && publicUserprofile ?
          getUserProfile()
          : (
            <UserProfleLoader />
        )}
        <Footer />
    </>
  );
}
