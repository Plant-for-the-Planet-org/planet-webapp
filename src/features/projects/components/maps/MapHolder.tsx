import { useTenant } from '../../../common/Layout/TenantContext';
import PlayButton from '../../../common/LandingVideo/PlayButton';
import { useProjectProps } from '../../../common/Layout/ProjectPropsContext';
import { SetState } from '../../../common/types/common';
import MapLayout from '../ProjectsMap';

interface Props {
  setshowVideo: SetState<boolean>;
}

const MapHolder = ({ setshowVideo }: Props) => {
  const { project, projects } = useProjectProps();
  const { tenantConfig } = useTenant();

  // console.log('tenantConfig', tenantConfig);

  return (
    <>
      {project !== null || projects !== null ? <MapLayout /> : null}
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
