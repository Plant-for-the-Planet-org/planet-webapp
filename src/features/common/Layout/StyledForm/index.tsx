import { styled } from '@mui/material';

/**
 * Returns an empty flex column display `<form>` with
 * styles defined for formButton and inputContainer
 */
const StyledForm = styled('form')(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 24,
  alignItems: 'flex-start',
  '& .formButton': {
    marginTop: 24,
  },
  '& .inputContainer': {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
    width: '100%',
  },
}));

export default StyledForm;
