import LandingPageMap from '../../../../src/features/projects/components/mapsV2/LandingPageMap';
import ProjectList from '../../../../src/features/projects/components/projectListV2/ProjectList';

const ProjectInfo = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '20px',
        width: '100%',
        paddingRight: '20px',
        paddingBottom: '20px',
        paddingLeft: '20px',
      }}
    >
      <ProjectList />
      <LandingPageMap />
    </div>
  );
};

export default ProjectInfo;
