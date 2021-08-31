import { createMuiTheme } from '@material-ui/core';
import theme from './themeProperties';

const materialTheme = createMuiTheme({
  overrides: {
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: theme.primaryColor,
      },
    },
    MuiPickersBasePicker: {
      pickerView: {
        backgroundColor: 'white',
      }
    },
    MuiDialogActions: {
      root: {
        backgroundColor: 'white',
      }
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        // backgroundColor: lightBlue.A200,
        // color: "white",
      }
    },
    MuiPickersDay: {
      daySelected: {
        backgroundColor: theme.primaryColor,
      },
      current: {
        color: theme.primaryColor,
      },
    },
    MuiPickersYear: {
      yearSelected: {
        color: theme.primaryColor,
      },
    },
    MuiPickersModal: {
      dialogAction: {
        color: theme.primaryColor,
      },
    },
    MuiButton: {
      label: {
        color: theme.primaryColor,
      },
    },
  },
});

export default materialTheme;
