import { Button, styled } from '@mui/material';
import themeProperties from '../../../theme/themeProperties';

// replace styles here with theme when consolidating the Mui Themes. Use theme palette etc.
const MuiButton = styled(Button)({
  '&.MuiButton-root': {
    textTransform: 'capitalize',
    borderRadius: 28,
    fontWeight: 600,
  },
  '&.MuiButton-outlinedPrimary': {
    backgroundColor: themeProperties.light.light,
    color: themeProperties.primaryColor,
    borderColor: themeProperties.primaryColor,
  },
  '&.MuiButton-containedPrimary': {
    color: themeProperties.light.light,
    background: themeProperties.primaryColor,
  },
});

export default MuiButton;
