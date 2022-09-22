import { styled } from '@mui/material';

const CenteredContainer = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: 24,
  borderRadius: 9,
  boxShadow: theme.shadows[1],
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  '&.CenteredContainer--small': {
    height: 160,
  },
}));

export default CenteredContainer;
