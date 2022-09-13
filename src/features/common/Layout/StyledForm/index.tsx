import { styled } from '@mui/material';

/**
 * Returns an empty flex column display `<form>` with
 * styles defined for formButton and inputContainer
 */
const StyledForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
    minWidth: 150,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    width: '100%',
  },
  '& .formTitle': {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.h2.fontSize,
  },
}));

export default StyledForm;
