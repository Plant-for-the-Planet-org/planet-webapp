import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/projects/screens/Projects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import { getRequest, getRequestWithLocale } from '../src/utils/apiRequests/api';
import DirectGift from '../src/features/donations/components/treeDonation/DirectGift';
import { ProjectPropsContext } from '../src/features/common/Layout/ProjectPropsContext';
import { GetStaticProps } from 'next';
import MapLayout from '../src/features/projects/components/ProjectsMap';
import Credits from '../src/features/projects/components/maps/Credits';

interface Props {
  initialized: Boolean;
  currencyCode: any;
  setCurrencyCode: Function;
  pageProps: Object;
}

export default function ProjectsPage({
  pageProps,
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const {
    projects,
    setProject,
    setProjects,
    setShowSingleProject,
    showProjects,
    setShowProjects,
    setsearchedProjects,
  } = React.useContext(ProjectPropsContext);

  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');
  const [directGift, setDirectGift] = React.useState(null);
  const [showdirectGift, setShowDirectGift] = React.useState(true);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
    setProjects(pageProps.projectsData);
    setProject(null);
    setShowSingleProject(false);
  }, []);

  React.useEffect(() => {
    if (directGift) {
      if (directGift.show === false) {
        setShowDirectGift(false);
      }
    }
  }, [directGift]);

  // Deprecation Notice: This route will be removed in next major version
  React.useEffect(() => {
    if (router.query.p) {
      router.push('/[p]', `/${router.query.p}`, {
        shallow: true,
      });
    }
  }, [router]);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        const projects = await getRequestWithLocale(
          `/app/projects?_scope=map&currency=${currency}`
        );
        setProjects(projects);
      }
    }
    loadProjects();
  }, [currencyCode]);

  const ProjectsProps = {
    projects,
    showProjects,
    setShowProjects,
    setsearchedProjects,
    currencyCode,
    setCurrencyCode,
  };

  const GiftProps = {
    setShowDirectGift,
    directGift,
  };

  return (
    <>
      {projects && initialized ? (
        <>
          <GetAllProjectsMeta />
          <MapLayout {...ProjectsProps} />
          <ProjectsList {...ProjectsProps} />
          {directGift ? (
            showdirectGift ? (
              <DirectGift {...GiftProps} />
            ) : null
          ) : null}
          <Credits setCurrencyCode={setCurrencyCode} />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const projectsData = await getRequest(`/app/projects?_scope=map`);

  return {
    props: {
      projectsData,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 seconds
    revalidate: 300, // In seconds
  };
};
