import React, { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { getRequestWithLocale } from '../../src/utils/apiRequests/api';

interface Props {}

export default function DirectGift({}: Props): ReactElement {
  const router = useRouter();
  //   const [profile, setProfile] = React.useState(null);
  React.useEffect(() => {
    if (router && router.query.id) {
      loadPublicUserData(router);
    }
  }, [router]);
  return <div></div>;
}

async function loadPublicUserData(router: any) {
  const newProfile = await getRequestWithLocale(
    `/app/profiles/${router.query.id}`
  );
  if (newProfile.type !== 'tpo') {
    localStorage.setItem(
      'directGift',
      JSON.stringify({
        id: newProfile.slug,
        displayName: newProfile.displayName,
        type: newProfile.type,
        show: true,
      })
    );
  }
  router.push('/', undefined, {
    shallow: true,
  });
}
