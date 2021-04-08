import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import Footer from '../../src/features/common/Layout/Footer';
import { getRequest } from '../../src/utils/apiRequests/api';
import Redeem from '../../src/features/public/Redeem';

interface Props {
  initialized: Boolean;
}

export default function PublicUser(initialized: Props) {
  const [ready, setReady] = React.useState(false);
  const [slug, setSlug] = React.useState('');

  const router = useRouter();

  useEffect(() => {
    if (router && router.query.code) {
      setSlug(router.query.code);
      setReady(true);
    }
  }, [router]);

  return ready ? <Redeem slug={slug} /> : <UserProfileLoader />;
}
