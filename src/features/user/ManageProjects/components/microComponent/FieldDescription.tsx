import type { ReactNode } from 'react';

import { FormHelperText } from '@mui/material';

interface Props {
  children: ReactNode;
}

/**
 * Help text for a questionnaire field.
 *
 * Always sits directly beneath its label and flush with it. MUI gives
 * FormHelperText a 14px left margin by default, which indented the description
 * relative to the caption it belongs to and made it read as a separate,
 * subordinate block rather than part of the question.
 */
export default function FieldDescription({ children }: Props) {
  return (
    <FormHelperText
      sx={{
        ml: 0,
        mr: 0,
        mb: 1,
        color: '#333333',
      }}
    >
      {children}
    </FormHelperText>
  );
}
