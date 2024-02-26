import { styled } from '@mui/material';

const ProfileMainContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  position: 'relative',
  height: 'max-content',
  backgroundColor: 'rgba(255, 255, 255, 1)',
  borderRadius: 9,
  boxShadow: '4px 6px 12px 0 rgba(102, 102, 102, 0.03)',
  marginLeft: 50,
  marginRight: 50,
  marginTop: 80,
  marginBottom: 20,
  padding: 30,
  '.MuiButton-root': {
    marginTop: 15,
    '@media (max-width: 481px)': {
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 29,
      paddingRight: 24,
      fontSize: 12,
    },
  },
  '@media (max-width: 481px)': {
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    border: 1,
    padding: 19,
    gap: 0,
  },
  '@media (max-width: 768px)': {
    marginLeft: 10,
    marginRight: 10,
  },
}));

export default ProfileMainContainer;
