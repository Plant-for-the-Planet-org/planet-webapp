import { styled } from '@mui/material';

const CenteredContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  height: 160,
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default CenteredContainer;
