import { styled } from '@mui/material';

const InlineFormDisplayGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: 16,
  rowGap: 24,
  alignItems: 'flex-start',
  flexWrap: 'wrap',

  '& .MuiTextField-root': {
    flex: 1,
    minWidth: 160,
  },
});

export default InlineFormDisplayGroup;
