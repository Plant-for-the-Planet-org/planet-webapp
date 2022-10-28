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
  gap: 24,
  '&.CenteredContainer--small': {
    height: 160,
  },
  '& .centered-text': {
    textAlign: 'center',
  },
}));

export default CenteredContainer;
