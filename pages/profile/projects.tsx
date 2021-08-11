import React, { ReactElement } from 'react';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';
import UserProfileLoader from '../../src/features/common/ContentLoaders/UserProfile/UserProfile';
import ProjectsContainer from '../../src/features/user/Account/components/ManageProjects/ProjectsContainer';
import UserLayout from '../../src/features/common/Layout/UserLayout/UserLayout';

interface Props {}
export default function Register({}: Props): ReactElement {
  const { user, contextLoaded, token } = React.useContext(UserPropsContext);
  return (
    <>
      {contextLoaded && user && token ? (
        <UserLayout>
          <ProjectsContainer />
          {/* <ProjectsContainer
            userprofile={userprofile}
            authenticatedType={authenticatedType}
          /> */}
        </UserLayout>
      ) : (
        <UserProfileLoader />
      )}
    </>
  );
}
