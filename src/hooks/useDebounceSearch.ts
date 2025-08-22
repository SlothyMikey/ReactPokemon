//Helps to delay fetching
import { useState, useEffect } from 'react';

export default function useDebounceSearch(searchTerm: string, delay = 1000) {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchTerm, delay]);
  return debouncedValue;
}
