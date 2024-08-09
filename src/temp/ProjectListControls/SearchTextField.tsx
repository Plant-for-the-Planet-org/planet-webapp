import { TextField, styled } from '@mui/material';

export const SearchTextField = styled(TextField)(() => ({
  '& .MuiInput-input': { width: '240px', marginLeft: '16px' },
  '& .MuiInput-underline:after': {
    visibility: 'hidden',
  },
  '& .MuiInputBase-root.MuiInput-root::before': {
    visibility: 'hidden',
  },
}));
