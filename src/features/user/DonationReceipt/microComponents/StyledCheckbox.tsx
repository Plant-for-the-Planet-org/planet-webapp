import Checkbox from '@mui/material/Checkbox';
import { styled } from '@mui/material';

const StyledCheckbox = styled(Checkbox)({
  padding: 0,
  '&.MuiCheckbox-root': {
    width: 21,
    height: 21,
    marginRight: 8,
  },
  '& .MuiSvgIcon-root': {
    width: 21,
    height: 21,
  },
});

export default StyledCheckbox;
