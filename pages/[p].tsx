import { useRouter } from 'next/router';
import React from 'react';
import SingleProjectDetails from '../src/features/projects/screens/SingleProjectDetails';
import { getRequest } from '../src/utils/apiRequests/api';
import getStoredCurrency from "../src/utils/countryCurrency/getStoredCurrency";
import GetProjectMeta from '../src/utils/getMetaTags/GetProjectMeta';

interface Props {
  initialized: Boolean;
  project: any;
  setProject: Function;
  setShowSingleProject: Function;
  currencyCode: any;
  setCurrencyCode: Function;
}

export default function Donate({
  initialized,
  project,
  setProject,
  setShowSingleProject,
  currencyCode,
  setCurrencyCode
}: Props) {
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');

  React.useEffect(() => {
    setShowSingleProject(true);
  }, []);

  React.useEffect(() => {
    async function loadProject() {
      if (!internalCurrencyCode || currencyCode !== internalCurrencyCode) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        const project = await getRequest(`/app/projects/${router.query.p}?_scope=extended&currency=${currency}`);
        setProject(project);
        setShowSingleProject(true);
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode]);

  const ProjectProps = {
    project,
  };

  return (
    <>
      {project ? <GetProjectMeta {...ProjectProps} /> : null}
      {initialized ? (
        project && initialized ? (
          <SingleProjectDetails {...ProjectProps} />
        ) : (
          <></>
        )
      ) : null}
    </>
  );
}
