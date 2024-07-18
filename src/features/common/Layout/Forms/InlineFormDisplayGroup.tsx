import { styled } from '@mui/material';
import { ReactElement, ReactNode } from 'react';

const InlineFormGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: 16,
  rowGap: 24,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  width: '100%',
  '&.InlineFormGroup--other': {
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  '& .MuiTextField-root, & .MuiFormControlLabel-root': {
    flex: 1,
    minWidth: 180,
  },
  '&.InlineFormGroup--no-spacing': {
    columnGap: 0,
  },
});

interface Props {
  /** Use type='other' to specify inline groups that do not contain only text field elements */
  type?: 'field' | 'other';
  children: ReactNode;
  spacing?: 'none' | 'regular';
}

/**
 * Responsive element that groups fields/other form elements that need to be arranged in one line
 */
const InlineFormDisplayGroup = ({
  spacing = 'regular',
  type = 'field',
  children,
}: Props): ReactElement => {
  let classes =
    type === 'field' ? 'InlineFormGroup--fields' : 'InlineFormGroup--other';
  classes +=
    spacing === 'none'
      ? ' InlineFormGroup--no-spacing'
      : ' InlineFormGroup--regular-spacing';

  return <InlineFormGroup className={classes}>{children}</InlineFormGroup>;
};

export default InlineFormDisplayGroup;
