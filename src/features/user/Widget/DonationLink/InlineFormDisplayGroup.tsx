import { styled } from '@mui/material';

const InlineFormDisplayGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '10px',
  alignItems: 'center',
  '@media(max-width: 481px)': {
    flexDirection: 'column',
  },
});

export default InlineFormDisplayGroup;
