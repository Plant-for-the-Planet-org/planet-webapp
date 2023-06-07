import { styled } from '@mui/material';

const ProfileContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: 250,
  backgroundColor: theme.palette.background.default,
  width: 'auto',
  borderRadius: 9,
  boxShadow: theme.shadows[3],
  marginLeft: 50,
  marginRight: 50,
  marginTop: 170,
  marginBottom: 40,
  padding: 30,
  '.MuiButton-root': {
    marginTop: 15,
  },
}));

export default ProfileContainer;
