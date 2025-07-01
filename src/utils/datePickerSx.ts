import type { SxProps } from '@mui/material';

import themeProperties from '../theme/themeProperties';

export const datePickerSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.designSystem.colors.leafGreen,
    color: themeProperties.designSystem.colors.white,
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.designSystem.colors.leafGreen,
      color: themeProperties.designSystem.colors.white,
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};
