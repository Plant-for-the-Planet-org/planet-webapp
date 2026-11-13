import type { Control, FieldValues, Path } from 'react-hook-form';
import type { AddressSuggestionsType } from '../types/geocoder';

import { Autocomplete, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

interface AddressAutocompleteProps<TFieldValues extends FieldValues> {
  /** Field on the form this input is bound to. */
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  /** Localized visible label for the input. */
  label: string;
  /** Geocoder suggestions to offer, from `useAddressSuggestions`. */
  suggestions: AddressSuggestionsType[];
  /** Report typed input so a debounced suggestion fetch can be scheduled. */
  onInputChange: (value: string) => void;
  /** Called with a suggestion's text when the user picks one from the list. */
  onSuggestionSelect?: (value: string) => void;
  required?: boolean;
  validationPattern?: RegExp;
  validationMessages: {
    /** Shown when `required` is set and the field is left empty. */
    required?: string;
    /** Shown when `validationPattern` is set and the value does not match. */
    invalid?: string;
  };
  /**
   * Stretch the input to its container's width. Needed where the surrounding
   * layout centers its children instead of stretching them.
   */
  fullWidth?: boolean;
  /** Browser autofill token, e.g. `street-address`. */
  autoComplete?: string;
}

/**
 * Address input backed by geocoder suggestions, rendered as a MUI
 * `Autocomplete` so the combobox keyboard and screen reader semantics
 * (Arrow/Enter/Escape, `aria-activedescendant`) come from MUI.
 */
const AddressAutocomplete = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  suggestions,
  onInputChange,
  onSuggestionSelect,
  required = false,
  validationPattern,
  validationMessages,
  fullWidth = false,
  autoComplete,
}: AddressAutocompleteProps<TFieldValues>) => {
  // A message is only needed for the rules actually in play, so fall back to
  // enforcing the rule without custom text rather than dropping it.
  const validationRules = {
    ...(required && { required: validationMessages.required ?? true }),
    ...(validationPattern && {
      pattern: {
        value: validationPattern,
        message: validationMessages.invalid ?? '',
      },
    }),
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={validationRules}
      render={({
        field: { onChange, onBlur, value, ref },
        fieldState: { error },
      }) => (
        <Autocomplete
          freeSolo
          fullWidth={fullWidth}
          options={suggestions}
          // Suggestions are already relevant results from the geocoder, so
          // keep them all instead of letting MUI filter against the input.
          filterOptions={(options) => options}
          getOptionLabel={(option) =>
            typeof option === 'string' ? option : option.text
          }
          // Use `magicKey` as the React key since suggestion text may not be unique.
          getOptionKey={(option) =>
            typeof option === 'string' ? option : option.magicKey
          }
          value={value ?? ''}
          onInputChange={(_, newValue, reason) => {
            // MUI also fires this with reason "reset" when the value changes
            // programmatically (e.g. right after a suggestion is applied).
            // Only real typing should feed the form and the geocoder.
            if (reason === 'reset') {
              return;
            }
            onChange(newValue);
            onInputChange(newValue);
          }}
          onChange={(_, newValue) => {
            const selected =
              typeof newValue === 'string' ? newValue : newValue?.text ?? '';
            onChange(selected);
            // Only resolve full address details when a real suggestion object
            // is chosen, not when free text is committed via Enter.
            if (newValue && typeof newValue !== 'string') {
              onSuggestionSelect?.(newValue.text);
            }
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              // Spread MUI's own input props first so the combobox ARIA
              // attributes it injects are preserved.
              inputProps={{
                ...params.inputProps,
                ...(autoComplete !== undefined ? { autoComplete } : {}),
              }}
              error={error !== undefined}
              helperText={error?.message}
              inputRef={ref}
              onBlur={onBlur}
            />
          )}
        />
      )}
    />
  );
};

export default AddressAutocomplete;
