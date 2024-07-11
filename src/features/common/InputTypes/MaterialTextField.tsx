import { TextField, TextFieldProps, styled } from '@mui/material';
import { Tenant } from '@planet-sdk/common/build/types/tenant';
import { useTenant } from '../Layout/TenantContext';

interface StyledTextFieldType {
  config: Tenant;
}

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => {
    return prop !== 'config';
  },
})(({ config }: StyledTextFieldType) => ({
  width: '100%',
  color: 'var(--primary-font-color)',
  '& .MuiInputBase-input.MuiOutlinedInput-input': {
    color: 'var(--primary-font-color)',
  },
  '& label.Mui-focused': {
    color: 'var(--primary-font-color)',
    fontFamily: config.config.font.primaryFontFamily,
  },
  '& label': {
    color: 'var(--primary-font-color)',
    fontFamily: config.config.font.primaryFontFamily,
    fontSize: '14px',
    top: '-3px',
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -4px) scale(0.75)',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: '0px!important',
  },
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'var(--background-color-dark)',
    color: 'var(--primary-font-color)',
    border: '0px!important',
    borderRadius: '10px',
    fontFamily: config.config.font.primaryFontFamily,
  },
  '& .MuiOutlinedInput-input': {
    padding: '14px',
  },
  '& .MuiOutlinedInput-multiline': {
    padding: '0px',
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"]': {
    padding: '14px',
  },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':
    {
      padding: '0px',
    },
  '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input:first-child':
    {
      paddingLeft: '0px',
    },
  '& .Mui-disabled.MuiOutlinedInput-input ': {
    color: 'var(--disabled-font-color)',
  },
}));

const MaterialTextField = (props: TextFieldProps) => {
  const { tenantConfig } = useTenant();

  return <StyledTextField config={tenantConfig} {...props} />;
};

export default MaterialTextField;
