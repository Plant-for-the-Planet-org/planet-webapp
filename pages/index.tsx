import { useRouter } from 'next/router';
import React from 'react';
import ProjectsList from '../src/features/projects/screens/Projects';
import GetAllProjectsMeta from '../src/utils/getMetaTags/GetAllProjectsMeta';
import getStoredCurrency from '../src/utils/countryCurrency/getStoredCurrency';
import { getRequest } from '../src/utils/apiRequests/api';
import { useProjectProps } from '../src/features/common/Layout/ProjectPropsContext';
import Credits from '../src/features/projects/components/maps/Credits';
import Filters from '../src/features/projects/components/projects/Filters';
import { TENANT_ID } from '../src/utils/constants/environment';
import { ErrorHandlingContext } from '../src/features/common/Layout/ErrorHandlingContext';
import DirectGift, {
  DirectGiftI,
} from '../src/features/donations/components/DirectGift';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import nextI18NextConfig from '../next-i18next.config';
import { handleError, APIError } from '@planet-sdk/common';
import { SetState } from '../src/features/common/types/common';
import { MapProject } from '../src/features/common/types/ProjectPropsContextInterface';

interface Props {
  initialized: Boolean;
  currencyCode: string;
  setCurrencyCode: SetState<string>;
}

export default function Donate({
  initialized,
  currencyCode,
  setCurrencyCode,
}: Props) {
  const {
    setProject,
    setProjects,
    setShowSingleProject,
    showProjects,
    setShowProjects,
    setsearchedProjects,
    setZoomLevel,
    filteredProjects,
  } = useProjectProps();
  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);
  const { i18n } = useTranslation();
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState('');
  const [directGift, setDirectGift] = React.useState<DirectGiftI | null>(null);
  const [showDirectGift, setShowDirectGift] = React.useState(true);
  const [internalLanguage, setInternalLanguage] = React.useState('');
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

  React.useEffect(() => {
    setShowSingleProject(false);
    setProject(null);
    setZoomLevel(1);
  }, []);

  // Load all projects
  React.useEffect(() => {
    async function loadProjects() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== i18n.language
      ) {
        const currency = getStoredCurrency();
        setInternalCurrencyCode(currency);
        setCurrencyCode(currency);
        setInternalLanguage(i18n.language);
        try {
          const projects = await getRequest<MapProject[]>(`/app/projects`, {
            _scope: 'map',
            currency: currency,
            tenant: TENANT_ID,
            'filter[purpose]': 'trees,conservation',
            locale: i18n.language,
          });
          setProjects(projects);
          setProject(null);
          setShowSingleProject(false);
          setZoomLevel(1);
        } catch (err) {
          setErrors(handleError(err as APIError));
          redirect('/');
        }
      }
    }
    loadProjects();
  }, [currencyCode, i18n.language]);

  const OtherProjectListProps = {
    showProjects,
    setShowProjects,
    setsearchedProjects,
    currencyCode,
    setCurrencyCode,
  };

  return (
    <>
      {initialized ? (
        filteredProjects && initialized ? (
          <>
            <GetAllProjectsMeta />
            <ProjectsList
              projects={filteredProjects}
              {...OtherProjectListProps}
            />
            {directGift ? (
              showDirectGift ? (
                <DirectGift
                  directGift={directGift}
                  setShowDirectGift={setShowDirectGift}
                />
              ) : null
            ) : null}
            <Credits setCurrencyCode={setCurrencyCode} />
          </>
        ) : (
          <></>
        )
      ) : null}
      {showProjects && <Filters />}
    </>
  );
}

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        nextI18NextConfig,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
