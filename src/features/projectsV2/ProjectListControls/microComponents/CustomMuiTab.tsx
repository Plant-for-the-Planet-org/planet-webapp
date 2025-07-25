import { Tab, styled } from '@mui/material';
import themeProperties from '../../../../theme/themeProperties';

const CustomMuiTab = styled(Tab)(() => ({
  flexDirection: 'row',
  textTransform: 'none',
  padding: '14px 0px',
  marginLeft: '19px',
  color: themeProperties.designSystem.colors.coreText,
}));

export default CustomMuiTab;
