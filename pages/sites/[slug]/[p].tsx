import { useRouter } from 'next/router';
import React from 'react';
import { ErrorHandlingContext } from '../../../src/features/common/Layout/ErrorHandlingContext';
import { useProjectProps } from '../../../src/features/common/Layout/ProjectPropsContext';
import Credits from '../../../src/features/projects/components/maps/Credits';
import SingleProjectDetails from '../../../src/features/projects/screens/SingleProjectDetails';
import { getRequest } from '../../../src/utils/apiRequests/api';
import getStoredCurrency from '../../../src/utils/countryCurrency/getStoredCurrency';
import GetProjectMeta from '../../../src/utils/getMetaTags/GetProjectMeta';
import { getAllPlantLocations } from '../../../src/utils/maps/plantLocations';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {
  handleError,
  APIError,
  TreeProjectExtended,
  ConservationProjectExtended,
  ProjectExtended,
  ClientError,
} from '@planet-sdk/common';
import { SetState } from '../../../src/features/common/types/common';
import { PlantLocation } from '../../../src/features/common/types/plantLocation';
import { useTenant } from '../../../src/features/common/Layout/TenantContext';
import {
  constructPathsForTenantSlug,
  getTenantConfig,
} from '../../../src/utils/multiTenancy/helpers';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { v4 } from 'uuid';
import {
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next';
import { defaultTenant } from '../../../tenant.config';

interface Props {
  initialized: boolean;
  currencyCode: string | null | undefined;
  setCurrencyCode: SetState<string | null | undefined>;
  pageProps: {
    tenantConfig: Tenant;
  };
}

export default function Donate({
  initialized,
  currencyCode,
  setCurrencyCode,
  pageProps,
}: Props) {
  const router = useRouter();
  const [internalCurrencyCode, setInternalCurrencyCode] = React.useState<
    string | undefined | null
  >(undefined);
  const [internalLanguage, setInternalLanguage] = React.useState('');
  const { i18n } = useTranslation();
  const {
    geoJson,
    project,
    setSelectedSite,
    setProject,
    setSelectedPl,
    plantLocations,
    setShowSingleProject,
    setZoomLevel,
    setPlantLocations,
    setPlantLocationsLoaded,
  } = useProjectProps();

  const { setTenantConfig } = useTenant();

  React.useEffect(() => {
    if (router.isReady) {
      setTenantConfig(pageProps.tenantConfig);
    }
  }, [router.isReady]);

  React.useEffect(() => {
    setZoomLevel(2);
  }, []);

  const { redirect, setErrors } = React.useContext(ErrorHandlingContext);

  React.useEffect(() => {
    async function loadProject() {
      if (
        !internalCurrencyCode ||
        currencyCode !== internalCurrencyCode ||
        internalLanguage !== i18n.language
      ) {
        const currency = getStoredCurrency(
          pageProps.tenantConfig.config.fallbackCurrency!
        );
        setInternalCurrencyCode(currency);
        setInternalLanguage(i18n.language);
        setCurrencyCode(currency);
        try {
          const { p } = router.query;
          const project = await getRequest<ProjectExtended>(
            pageProps.tenantConfig.id,
            encodeURI(`/app/projects/${p}`),
            {
              _scope: 'extended',
              currency: currency || '',
              locale: i18n.language,
            }
          );
          if (
            project.purpose === 'conservation' ||
            project.purpose === 'trees'
          ) {
            setProject(project);
            setShowSingleProject(true);
            setZoomLevel(2);
          } else {
            throw new ClientError(404, {
              error_type: 'project_not_available',
              error_code: 'project_not_available',
            });
          }
        } catch (err) {
          setErrors(handleError(err as APIError | ClientError));
          redirect('/');
        }
      }
    }
    if (router.query.p) {
      loadProject();
    }
  }, [router.query.p, currencyCode, i18n.language]);

  React.useEffect(() => {
    async function loadPl(
      project: ConservationProjectExtended | TreeProjectExtended
    ) {
      setPlantLocationsLoaded(false);
      const newPlantLocations = await getAllPlantLocations(
        pageProps.tenantConfig.id,
        project.id,
        setErrors,
        redirect
      );

      if (newPlantLocations !== undefined) {
        setPlantLocations(newPlantLocations);
        setPlantLocationsLoaded(true);
      }
    }
    if (project && project.purpose === 'trees') {
      loadPl(project);
    }
  }, [project]);

  React.useEffect(() => {
    if (geoJson && !router.query.site && !router.query.ploc && project) {
      router.push(
        `/${project.slug}?site=${geoJson.features[0].properties.id}`,
        undefined,
        { shallow: true }
      );
    }
  }, [project, router]);

  React.useEffect(() => {
    //for selecting one of the site of project if user use link  to directly visit to site from home page
    if (project && geoJson && router.query.site) {
      const siteIndex: number = geoJson?.features.findIndex((singleSite) => {
        return router.query.site === singleSite?.properties.id;
      });
      if (siteIndex === -1) {
        router.push(`/${project.slug}`);
      } else {
        setSelectedSite(siteIndex);
      }
    }
  }, [setSelectedSite, geoJson, project]);

  React.useEffect(() => {
    //for selecting one of the plant location. if user use link  to directly visit to plantLocation from home page
    if (geoJson && router.query.ploc && plantLocations && project) {
      const singlePlantLocation: PlantLocation | undefined =
        plantLocations?.find((singlePlantLocation) => {
          return router.query.ploc === singlePlantLocation?.hid;
        });

      if (singlePlantLocation === undefined) {
        router.push(`/${project.slug}`);
      } else {
        setSelectedPl(singlePlantLocation);
      }
    }
  }, [router, router.query.ploc, plantLocations, setSelectedPl, project]);

  return pageProps.tenantConfig ? (
    <>
      {project ? <GetProjectMeta project={project} /> : null}
      {initialized ? (
        project ? (
          <>
            <SingleProjectDetails />
          </>
        ) : (
          <></>
        )
      ) : null}
      <Credits setCurrencyCode={setCurrencyCode} />
    </>
  ) : (
    <></>
  );
}

export async function getStaticPaths() {
  const subDomainPaths = await constructPathsForTenantSlug();

  const paths = subDomainPaths.map((path) => {
    return {
      params: {
        slug: path.params.slug,
        p: v4(),
      },
    };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
}

interface StaticProps {
  tenantConfig: Tenant;
}

export const getStaticProps: GetStaticProps<StaticProps> = async (
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<StaticProps>> => {
  const tenantConfig =
    (await getTenantConfig(context.params?.slug as string)) ?? defaultTenant;

  return {
    props: {
      ...(await serverSideTranslations(
        context.locale || 'en',
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
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
      tenantConfig,
    },
  };
};
