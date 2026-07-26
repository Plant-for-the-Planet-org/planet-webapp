import type { AddressSuggestionsType } from '../features/common/types/geocoder';

import { useCallback, useRef, useState } from 'react';
import {
  getAddressDetailsFromText,
  getAddressSuggestions,
} from '../utils/geocoder';
import { useDebouncedEffect } from '../utils/useDebouncedEffect';

/**
 * Address parts the geocoder resolves for a picked suggestion. Consumers fan
 * these into their own form fields.
 */
export interface ResolvedAddress {
  address: string;
  city: string;
  zipCode: string;
}

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
      try {
        const results = await getAddressSuggestions(value, country);
        // Only update if this is still the latest request
        if (currentRequestId === latestRequestIdRef.current) {
          setSuggestions(results);
        }
      } catch (error) {
        console.error('Failed to fetch address suggestions:', error);
        // Prevent outdated error responses from affecting UI
        if (currentRequestId === latestRequestIdRef.current) {
          setSuggestions([]);
        }
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

      // Fetch suggestions only if input is meaningful (e.g., length > 3)
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
      try {
        const details = await getAddressDetailsFromText(value);
        if (details) {
          onAddressResolved(details);
        }
        setSuggestions([]);
      } catch (error) {
        console.error('Failed to fetch address details:', error);
      }
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
