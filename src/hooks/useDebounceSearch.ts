//Helps to delay fetching
import { useState, useEffect } from 'react';

export default function useDebounceSearch(searchTerm: string, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(searchTerm);
    }, delay);

    return () => clearTimeout(timeout);
  }, [searchTerm]);
  return debouncedValue;
}
