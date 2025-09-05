import type { ReactElement } from 'react';

import ContentLoader from 'react-content-loader';

function ProjectLoaderDetails(): ReactElement {
  return (
    <>
      <ContentLoader
        speed={2}
        width={328}
        height={400}
        viewBox="0 0 328 228"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="7" y="185" rx="3" ry="3" width="88" height="6" />
        <rect x="104" y="185" rx="3" ry="3" width="52" height="6" />
        <rect x="6" y="210" rx="3" ry="3" width="178" height="6" />
        <rect x="264" y="210" rx="3" ry="3" width="52" height="6" />
        <rect x="8" y="20" rx="3" ry="3" width="307" height="153" />
        <rect x="264" y="182" rx="3" ry="3" width="52" height="17" />
        <rect x="8" y="220" rx="3" ry="3" width="307" height="6" />
        <rect x="8" y="230" rx="3" ry="3" width="307" height="6" />
        <rect x="8" y="240" rx="3" ry="3" width="307" height="6" />
        <rect x="8" y="250" rx="3" ry="3" width="307" height="6" />
        <rect x="8" y="260" rx="3" ry="3" width="307" height="6" />
      </ContentLoader>
    </>
  );
}

export default ProjectLoaderDetails;
