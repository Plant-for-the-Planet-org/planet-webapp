import { useTenant } from '../../../common/Layout/TenantContext';
import PlayButton from '../../../common/LandingVideo/PlayButton';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import { SetState } from '../../../common/types/common';
import MapLayout from '../ProjectsMap';
import { useRouter } from 'next/router';

interface Props {
  setshowVideo: SetState<boolean>;
}

const MapHolder = ({ setshowVideo }: Props) => {
  const { project, projects } = useProjectProps();
  const { tenantConfig } = useTenant();
  const router = useRouter();

  const showMapLayout =
    router.pathname.includes('projects-archive') &&
    (project !== null || projects !== null);

  return (
    <>
      {showMapLayout ? <MapLayout /> : null}
      <div
        style={
          tenantConfig.config.slug === 'planet' ||
          tenantConfig.config.slug === 'ttc'
            ? {}
            : { display: 'none' }
        }
      >
        <PlayButton setshowVideo={setshowVideo} />
      </div>
    </>
  );
};
export default MapHolder;
