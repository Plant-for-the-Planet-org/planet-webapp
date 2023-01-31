import { createStyles, withStyles } from '@mui/styles';
import { InputBase } from '@mui/material';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

const BootstrapInput = withStyles(() =>
  createStyles({
    input: {
      borderRadius: 9,
      position: 'relative',
      backgroundColor: 'var(--background-color)',
      color: 'var(--primary-font-color)',
      boxShadow: '0px 3px 6px #00000029',
      fontSize: 14,
      padding: '10px 26px 10px 12px',
      // Use the system font instead of the default Roboto font.
      fontFamily: [config?.font.primaryFontFamily].join(','),
      '&:focus': {
        backgroundColor: 'var(--background-color)',
        borderRadius: 9,
      },
    },
  })
)(InputBase);

// export const MaterialInput = withStyles((theme) =>
//   createStyles({
//     root: {
//       width: '100%',
//       'label + &': {
//         marginTop: theme.spacing(3),
//       },
//     },
//     input: {
//       borderRadius: 10,
//       position: 'relative',
//       backgroundColor: 'var(--background-color-dark)',
//       color: 'var(--primary-font-color)',
//       // boxShadow: '0px 3px 6px #00000029',
//       fontSize: 14,
//       padding: '10px 26px 10px 12px',
//       transition: theme.transitions.create(['border-color', 'box-shadow']),
//       // Use the system font instead of the default Roboto font.
//       fontFamily: [config.font.primaryFontFamily].join(','),
//       '&:focus': {
//         backgroundColor: 'var(--background-color-dark)',
//         borderRadius: 10,
//         // borderColor: '#80bdff',
//         // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
//       },
//     },
//   })
// )(InputBase);

export default BootstrapInput;
