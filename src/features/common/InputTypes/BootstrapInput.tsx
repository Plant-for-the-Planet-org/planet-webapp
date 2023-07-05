import { InputBase, styled } from '@mui/material';
import tenantConfig from '../../../../tenant.config';

const config = tenantConfig();

const BootstrapInput = styled(InputBase)({
  '& .MuiInputBase-input': {
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
});

export default BootstrapInput;
