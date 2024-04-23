import { Tab, styled } from '@mui/material';

const CustomTab = styled(Tab)(() => ({
  flexDirection: 'row',
  textTransform: 'none',
  padding: '14px 0px',
  marginLeft: '19px',
  color: '#333',
  '&.MuiButtonBase-root.MuiTab-root.Mui-selected': {
    color: '#219653',
  },
}));

export default CustomTab;
