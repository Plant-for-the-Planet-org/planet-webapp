import Radio from '@mui/material/Radio';
import { styled } from '@mui/material';

const StyledRadio = styled(Radio)({
  padding: 0,
  '&.MuiRadio-root': {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  '& .MuiSvgIcon-root': {
    width: 21,
    height: 21,
  },
});

export default StyledRadio;
