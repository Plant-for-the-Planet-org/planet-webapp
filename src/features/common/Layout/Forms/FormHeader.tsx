import { styled } from '@mui/material';

/**
 * Header container to be placed above a html `<form>` element.
 */
const FormHeader = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  width: '100%',
  '& .formTitle': {
    color: theme.palette.text.secondary,
    fontSize: theme.typography.h2.fontSize,
  },
}));

export default FormHeader;
