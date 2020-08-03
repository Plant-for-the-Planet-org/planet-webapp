import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';

const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
}

function AllProjects({ projects }: Props): ReactElement {
  return (
    <div>
      <LazyLoad>
        {projects.map((project: any) => {
          return (
            <ProjectSnippet key={project.properties.id} project={project} />
          );
        })}
      </LazyLoad>
    </div>
  );
}

export default AllProjects;
