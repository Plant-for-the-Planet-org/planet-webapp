import type { InputBaseProps } from '@mui/material';
import type { Tenant } from '@planet-sdk/common/build/types/tenant';

import { InputBase, styled } from '@mui/material';
import { useTenant } from '../Layout/TenantContext';

interface StyledInputBaseType {
  config: Tenant;
}

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: (prop) => {
    return prop !== 'config';
  },
})(({ config }: StyledInputBaseType) => ({
  '& .MuiInputBase-input': {
    borderRadius: 9,
    position: 'relative',
    backgroundColor: 'var(--background-color)',
    color: 'var(--primary-font-color)',
    boxShadow: '0px 3px 6px #00000029',
    fontSize: 14,
    padding: '10px 26px 10px 12px',
    // Use the system font instead of the default Roboto font.
    fontFamily: [config.config.font.primaryFontFamily].join(','),
    '&:focus': {
      backgroundColor: 'var(--background-color)',
      borderRadius: 9,
    },
  },
}));

const BootstrapInput = (props: InputBaseProps) => {
  const { tenantConfig } = useTenant();

  return <StyledInputBase {...props} config={tenantConfig} />;
};

export default BootstrapInput;
