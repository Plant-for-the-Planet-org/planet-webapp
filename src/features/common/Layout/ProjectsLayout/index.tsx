import { FC, useState } from 'react';
import WebappButton from '../../WebappButton';

const ProjectsLayout: FC = ({ children }) => {
  const [buttonState, setButtonState] = useState(false);

  return (
    <div style={{ marginTop: '80px' }}>
      <WebappButton
        onClick={() => setButtonState(!buttonState)}
        elementType="button"
        text={buttonState ? 'Active' : 'Inactive'}
      />
      {children}
    </div>
  );
};

export default ProjectsLayout;
