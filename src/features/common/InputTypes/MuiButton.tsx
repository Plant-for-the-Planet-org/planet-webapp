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
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
    },
    '&.MuiButton-containedPrimary': {
      color: theme.palette.background.default,
      background: theme.palette.primary.main,
    },
  };
});

export default MuiButton;
