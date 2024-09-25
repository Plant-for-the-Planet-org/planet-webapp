import { Tab, styled } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

const { light, primaryColorNew } = themeProperties;
const CustomMuiTab = styled(Tab)(() => ({
  flexDirection: 'row',
  textTransform: 'none',
  padding: '14px 0px',
  marginLeft: '19px',
  color: `${light.selectedMenuItemColorNew}`,
  '&.MuiButtonBase-root.MuiTab-root.Mui-selected': {
    color: `${primaryColorNew}`,
  },
}));

export default CustomMuiTab;
