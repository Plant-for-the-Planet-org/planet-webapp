import { Button, styled } from '@mui/material';

const MuiButton = styled(Button)(({ theme }) => {
  return {
    '&.MuiButton-root': {
      textTransform: 'none',
      borderRadius: 28,
      fontWeight: 600,
      padding: '5px 15px',
      fontSize: 'inherit',
    },
    '&.MuiButton-outlinedPrimary': {
      backgroundColor: theme.palette.background.default,
    },
  };
});

export default MuiButton;
