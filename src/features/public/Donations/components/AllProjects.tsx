import dynamic from 'next/dynamic';
import React, { ReactElement } from 'react';
import LazyLoad from 'react-lazyload';
import ProjectLoader from '../../../common/ContentLoaders/Projects/ProjectLoader';

const ProjectSnippet = dynamic(() => import('./ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});
interface Props {
  projects: any;
  setShowSingleProject: Function;
  fetchSingleProject: Function;
}

function AllProjects({
  projects,
  setShowSingleProject,
  fetchSingleProject,
}: Props): ReactElement {
  if (projects.length < 1) {
    return (
      <div>
        <LazyLoad>
          <h3> No projects found </h3>
        </LazyLoad>
      </div>
    );
  } else {
    return (
      <div>
        <LazyLoad>
          {projects.map((project: any) => {
            return (
              <ProjectSnippet
                key={project.properties.id}
                project={project}
                setShowSingleProject={setShowSingleProject}
                fetchProject={async () => {
                  await fetchSingleProject(project.properties.id);
                  console.log(
                    'Project ID Changed in All Projects',
                    project.properties.id
                  );
                }}
              />
            );
          })}
        </LazyLoad>
      </div>
    );
  }
}

export default AllProjects;
