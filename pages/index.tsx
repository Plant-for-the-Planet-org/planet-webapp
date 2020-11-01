import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/public/Donations/screens/Projects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../src/utils/apiRequests/api';
import storeConfig from '../src/utils/storeConfig';
import DirectGift from '../src/features/public/Donations/components/DirectGift';

interface Props {
  initialized: Boolean;
  projects: any;
  setProject: Function;
  setProjects: Function;
  setShowSingleProject: Function;
  setsearchedProjects: any
}

export default function Donate({
  initialized,
  projects,
  setProject,
  setProjects,
  setShowSingleProject,
  setsearchedProjects,
}: Props) {
  const router = useRouter();
  const [directGift, setDirectGift] = React.useState(null);
  const [showdirectGift, setShowDirectGift] = React.useState(true);
  React.useEffect(() => {
    storeConfig();
  }, []);

  React.useEffect(() => {
    const getdirectGift = localStorage.getItem('directGift');
    if (getdirectGift) {
      setDirectGift(JSON.parse(getdirectGift));
    }
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
      const currencyCode = getStoredCurrency();
      const projects = await getRequest(
        `/app/projects?_scope=map&currency=${currencyCode}`,
      );
      setProjects(projects);
      setProject(null);
      setShowSingleProject(false);
    }
    loadProjects();
  }, []);
  const ProjectsProps = {
    projects,
    directGift,
    setDirectGift,
    setsearchedProjects,
  };

  const GiftProps = {
    setShowDirectGift,
    directGift,
  };

  return (
    <>
      {projects ? <GetAllProjectsMeta /> : null}
      {initialized ? (
        projects && initialized ? (
          <>
            <ProjectsList {...ProjectsProps} />
            {directGift ? (
              showdirectGift ? (
                <DirectGift {...GiftProps} />
              ) : null
            ) : null}
          </>
        ) : (
          <></>
        )
      ) : null}
    </>
  );
}
