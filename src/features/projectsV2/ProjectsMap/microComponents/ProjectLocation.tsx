import { Marker } from 'react-map-gl-v7/maplibre';
import { ProjectLocationIcon } from '../../../../../public/assets/images/icons/projectV2/ProjectLocationIcon';
import themeProperties from '../../../../theme/themeProperties';

interface Props {
  latitude: number;
  longitude: number;
  purpose: 'trees' | 'conservation';
}
const { colors } = themeProperties.designSystem;
const ProjectLocation = ({ latitude, longitude, purpose }: Props) => {
  return (
    <Marker latitude={latitude} longitude={longitude} anchor="center">
      <ProjectLocationIcon
        color={
          purpose === 'conservation' ? colors.skyBlue : colors.primaryColor
        }
      />
    </Marker>
  );
};

export default ProjectLocation;
