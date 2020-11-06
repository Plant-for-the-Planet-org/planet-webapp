import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getRequest } from '../../src/utils/apiRequests/api';

interface Props {}

export default function DirectGift({}: Props): ReactElement {
  const router = useRouter();
  //   const [profile, setProfile] = React.useState(null);
  React.useEffect(() => {
    if (router && router.query.id) {
      async function loadPublicUserData() {
        const newProfile = await getRequest(
          `/public/v1.0/en/treecounter/${router.query.id}`
        );
        // console.log(newProfile);
        localStorage.setItem(
          'directGift',
          JSON.stringify({
            id: newProfile.id,
            displayName: newProfile.displayName,
            show: true,
          })
        );
        router.push('/', undefined, {
          shallow: true,
        });
      }
      loadPublicUserData();
    }
  }, [router]);
  return <div></div>;
}
