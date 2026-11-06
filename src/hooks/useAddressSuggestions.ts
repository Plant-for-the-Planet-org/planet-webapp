import type {
  AddressSuggestionsType,
  ResolvedAddress,
} from '../features/common/types/geocoder';

import { useCallback, useRef, useState } from 'react';
import {
  getAddressDetailsFromText,
  getAddressSuggestions,
} from '../utils/geocoder';
import { useDebouncedEffect } from '../utils/useDebouncedEffect';

interface UseAddressSuggestionsProps {
  /** Country code used to scope geocoder results. */
  country: string;
  /** Called with the resolved address parts after a suggestion is picked. */
  onAddressResolved: (address: ResolvedAddress) => void;
  /** Delay before a suggestion request is issued, in ms. */
  debounceDelay?: number;
}

interface UseAddressSuggestionsResult {
  /** Suggestions for the latest debounced input, to feed an autocomplete. */
  suggestions: AddressSuggestionsType[];
  /** Report the current input text; schedules a debounced suggestion fetch. */
  handleInputChange: (value: string) => void;
  /** Resolve a picked suggestion into address parts and clear the list. */
  selectSuggestion: (value: string) => Promise<void>;
  /** Drop the current suggestions, e.g. when a form is reset. */
  clearSuggestions: () => void;
}

const DEFAULT_DEBOUNCE_DELAY = 700;

/**
 * Owns the geocoder wiring shared by every address autocomplete: a debounced
 * suggestion fetch, a request-ID race guard so a slow response cannot overwrite
 * a newer one, and resolving a picked suggestion into address parts.
 */
export const useAddressSuggestions = ({
  country,
  onAddressResolved,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
}: UseAddressSuggestionsProps): UseAddressSuggestionsResult => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestionsType[]>([]);
  const latestRequestIdRef = useRef(0);

  const clearSuggestions = useCallback(() => setSuggestions([]), []);

  const fetchSuggestions = useCallback(
    async (value: string) => {
      // Bump request ID to track the latest API call
      latestRequestIdRef.current++;
      const currentRequestId = latestRequestIdRef.current;
      // `getAddressSuggestions` logs and swallows its own failures, resolving
      // to an empty list, so there is nothing here left to catch.
      const results = await getAddressSuggestions(value, country);
      // Only update if this is still the latest request
      if (currentRequestId === latestRequestIdRef.current) {
        setSuggestions(results);
      }
    },
    [country]
  );

  useDebouncedEffect(
    () => {
      const trimmedInput = inputValue.trim();

      // Clear suggestions if input is empty or just whitespace
      if (trimmedInput === '') {
        setSuggestions([]);
        return;
      }

      // `getAddressSuggestions` skips the API call for inputs of 3 characters
      // or fewer and resolves to an empty list.
      fetchSuggestions(trimmedInput);
    },
    debounceDelay,
    [inputValue]
  );

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const selectSuggestion = useCallback(
    async (value: string) => {
      // `getAddressDetailsFromText` logs and swallows its own failures,
      // resolving to `null`, so there is nothing here left to catch.
      const details = await getAddressDetailsFromText(value);
      if (details) {
        onAddressResolved(details);
      }
      setSuggestions([]);
    },
    [onAddressResolved]
  );

  return {
    suggestions,
    handleInputChange,
    selectSuggestion,
    clearSuggestions,
  };
};
