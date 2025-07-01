import { CalendarPicker } from '@mui/x-date-pickers';
import { styled } from '@mui/material/styles';
import themeProperties from '../../../theme/themeProperties';

const MuiCalendarPicker = styled(CalendarPicker<Date>)({
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
});

export default MuiCalendarPicker;
