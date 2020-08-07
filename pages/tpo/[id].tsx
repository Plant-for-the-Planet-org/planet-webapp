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
      const res = await fetch(
        `${process.env.API_ENDPOINT}/public/v1.0/en/treecounter/${router.query.id}`
      );

      const tpoprofile = await res.json();
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
