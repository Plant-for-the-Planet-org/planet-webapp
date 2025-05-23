import { Autocomplete, styled } from '@mui/material';
import themeProperties from '../../../theme/themeProperties';

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
    fontSize: themeProperties.fontSizes.fontMedium,
  },
});

export { MuiAutoComplete, StyledAutoCompleteOption };
