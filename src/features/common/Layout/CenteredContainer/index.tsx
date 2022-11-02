import { styled } from '@mui/material';

/**
 * Returns a container with background and boxShadow, with centered content. Content is vertically arranged
 */
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
  // To create a small fixed height container
  '&.CenteredContainer--small': {
    height: 160,
  },
  // To center text within a child element of the CenteredContainer
  '& .centered-text': {
    textAlign: 'center',
  },
}));

export default CenteredContainer;
