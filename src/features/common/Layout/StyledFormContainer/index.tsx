import { styled, Box } from '@mui/material';

/**
 * Returns an empty flex column display form container
 * styles defined for formButton, formTitle and inputContainer
 *
 *
 * Note: if you need a <form> tag, use `StyledFormContainer`
 */
const StyledFormContainer = styled(Box)(() => ({
  width: '100%',
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
}));
// Duplicates StyledForm which should be phased out slowly

export default StyledFormContainer;
