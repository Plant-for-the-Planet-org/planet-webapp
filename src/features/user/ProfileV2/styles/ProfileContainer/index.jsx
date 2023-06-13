import { styled } from '@mui/material';

const ProfileContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  position: 'relative',
  height: 'max-content',
  backgroundColor: theme.palette.background.default,
  width: 'auto',
  borderRadius: 9,
  boxShadow: theme.shadows[3],
  marginLeft: 50,
  marginRight: 50,
  marginTop: 170,
  marginBottom: 40,
  padding: 30,
  maxWidth: 1070,
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
    marginLeft: 25,
    marginRight: 25,
  },
}));

export default ProfileContainer;
