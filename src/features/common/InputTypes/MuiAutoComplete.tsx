import { Autocomplete, InputLabel, styled } from '@mui/material';

const MuiAutoComplete = styled(Autocomplete)((/* { theme } */) => {
  return {
    width: '100%',
    '& .Mui-disabled .iconFillColor': {
      fillOpacity: '38%',
    },
    flex: '1',
  };
});

const StyledAutoCompleteOption = styled('li')({
  '& span': {
    marginRight: 10,
    fontSize: 18,
  },
});

const StyledInputLabel = styled(InputLabel)((/* { theme } */) => {
  return {
    '& p': {
      fontSize: '0.75rem',
      fontWeight: 700,
    },
  };
});

export { MuiAutoComplete, StyledAutoCompleteOption, StyledInputLabel };
