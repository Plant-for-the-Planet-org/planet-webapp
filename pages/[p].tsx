import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { ProjectPropsContext } from '../src/features/common/Layout/ProjectPropsContext';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { getRequest, getRequestWithLocale } from '../src/utils/apiRequests/api';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';
import MapLayout from '../src/features/projects/components/ProjectsMap';
import Credits from '../src/features/projects/components/maps/Credits';

interface Props {
  pageProps: Object;
  initialized: boolean;
  currencyCode: string;
  setCurrencyCode: Function;
}

export default function ProjectPage({
  pageProps,
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');

  const { project, setProject, setShowSingleProject } = React.useContext(
    ProjectPropsContext
  );

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  React.useEffect(() => {
    setProject(pageProps.projectData);
    setShowSingleProject(true);
  }, []);

  React.useEffect(() => {
    async function loadProject() {
      if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        const result = await getRequestWithLocale(
          `/app/projects/${router.query.p}?_scope=extended&currency=${currency}`
        );
        setProject(result);
      }
    }
    loadProject();
  }, [currencyCode]);

  const ProjectProps = {
    project,
    currencyCode,
    setCurrencyCode,
  };

  return (
    <>
      {project && (
        <>
          <GetProjectMeta {...ProjectProps} />
          <MapLayout {...ProjectProps} />
          {initialized ? <SingleProjectDetails {...ProjectProps} /> : null}
          <Credits setCurrencyCode={setCurrencyCode} />
        </>
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context: any) => {
  const projectData = await getRequest(
    `/app/projects/${context.params.p}?_scope=extended`
  );

  return {
    props: {
      projectData,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 300 seconds
    revalidate: 300, // In seconds
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { p: any } }[] = [];
  const projects = await getRequest(`/app/projects`);
  projects.forEach((project: { slug: any }) => {
    paths.push({ params: { p: project.slug } });
  });
  return {
    paths: paths,
    fallback: true,
  };
};
