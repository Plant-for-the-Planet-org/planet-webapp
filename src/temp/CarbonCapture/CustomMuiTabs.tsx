import { styled, Tabs } from '@mui/material';

const CustomMuiTabs = styled(Tabs)(() => ({
  '.MuiTabs-flexContainer': {
    justifyContent: 'center',
    marginTop: '24px',
    gap: '30px',
  },
  '.MuiButtonBase-root': {
    textTransform: 'none',
    fontSize: '12px',
    color: `var(--primary-font-color)`,
  },
  '.MuiButtonBase-root-MuiTab-root.Mui-selected': {
    color: `var(--primary-color-new)`,
  },
  '.MuiTabs-indicator': {
    backgroundColor: `var(--primary-color-new)`,
  },
  '.MuiTab-root.Mui-selected': {
    color: `var(--primary-color-new)`,
    display: 'flex',
    flexDirection: 'row',
  },
  '.MuiTab-root': {
    minHeight: '0px',
    padding: '0px 0px',
    display: 'flex',
    flexDirection: 'row',
  },
}));

export default CustomMuiTabs;
