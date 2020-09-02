import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Footer from '../../src/features/common/Footer';
import Layout from '../../src/features/common/Layout';
import TpoPage from '../../src/features/public/TpoProfile';

export default function Tpo() {
  const [tpoprofile, setTpoprofile] = React.useState();

  const router = useRouter();
  const TpoProps = {
    tpoprofile: tpoprofile,
  };
  useEffect(() => {
    async function loadTpoData() {
      let tpoId;
      if (router.query.id === undefined){
        tpoId = 'ayudh-europe'
      } else {
        tpoId = router.query.id
      }
      const res = await fetch(
        `${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${tpoId}`, {
        headers: { 'tenant-key': `${process.env.TENANTID}` }
      }
      );
      console.log('url',`${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${tpoId}` )
      const tpoprofile = await res.json();
      console.log('response', tpoprofile)
      setTpoprofile(tpoprofile);
    }
    loadTpoData();
  }, []);

  return tpoprofile ? (
    <Layout>
      <TpoPage {...TpoProps} />
      <Footer />
    </Layout>
  ) : null;
}
