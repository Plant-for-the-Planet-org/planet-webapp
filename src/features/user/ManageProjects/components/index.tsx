import { styled } from '@mui/material';

export const ProjectCreationFormContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.default,
  boxShadow: theme.shadows[1],
  borderRadius: 9,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'row',
  justifyContent: 'center',
  alignContent: 'center',
}));
