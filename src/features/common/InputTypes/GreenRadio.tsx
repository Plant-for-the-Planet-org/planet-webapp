import Radio, { RadioProps } from '@mui/material/Radio';
import { styled } from '@mui/material';
import { ReactElement } from 'react';

const StyledRadio = styled(Radio)({
  color: '#000000',
  '&.Mui-checked .MuiSvgIcon-root path': {
    fill: '#68B030',
  },
});

const GreenRadio = (props: RadioProps): ReactElement => (
  <StyledRadio color="default" {...props} />
);

export default GreenRadio;
