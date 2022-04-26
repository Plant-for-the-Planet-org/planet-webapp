import { TextField, styled } from 'mui-latest';
import { ReactElement } from 'react';

const InlineFormGroup = styled('div')({
  display: 'flex',
  gap: 16,
});

interface GenericCodesProps {}

const GenericCodesPartial = ({}: GenericCodesProps): ReactElement => {
  return (
    <>
      <InlineFormGroup>
        <TextField label="Units per code"></TextField>
        <TextField label="Total number of codes"></TextField>
      </InlineFormGroup>
      <TextField label="Occasion"></TextField>
    </>
  );
};

export default GenericCodesPartial;
