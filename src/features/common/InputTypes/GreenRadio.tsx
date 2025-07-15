import type { RadioProps } from '@mui/material/Radio';
import type { ReactElement } from 'react';

import Radio from '@mui/material/Radio';
import { styled } from '@mui/material';
import themeProperties from '../../../theme/themeProperties';

const StyledRadio = styled(Radio)({
  '&.Mui-checked .MuiSvgIcon-root path': {
    fill: themeProperties.designSystem.colors.leafGreen,
  },
});

const GreenRadio = (props: RadioProps): ReactElement => (
  <StyledRadio color="default" {...props} />
);

export default GreenRadio;
