import { useState, useEffect } from 'react';

/**
 * useDebounce
 * @param value La valeur à "debouncer"
 * @param delay Le délai en ms avant de mettre à jour la valeur
 * @returns La valeur debouncée
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup : annule le timeout si la valeur change avant la fin du délai
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
