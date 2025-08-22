import { useEffect, useState } from 'react';
import type { PokemonBasic, PokemonData } from '@/helper/pokemonTypes';
import { fetchAllPokemonDetails, fetchPokemonList } from '@/api/pokemon';
import useDebounceSearch from './useDebounceSearch';

export default function useSearchPokemon() {
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageUrl, setPageUrl] = useState<string | null>(
    'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21',
  );

  const searchTerm = useDebounceSearch(search);

  const loadMore = async () => {
    if (!pageUrl || loading) return; // Prevent multiple simultaneous requests

    setLoading(true);
    try {
      const result = await fetchPokemonList(pageUrl);
      setPageUrl(result?.next ?? null);
      const newList = result?.results ?? [];
      const details = await fetchAllPokemonDetails(newList);
      const validDetails = details.filter(
        (item): item is PokemonData => item !== null,
      );

      setPokemonData((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNewDetails = validDetails.filter(
          (p) => !existingIds.has(p.id),
        );
        return [...prev, ...uniqueNewDetails];
      });

      setPokemonList((prev) => {
        const existingNames = new Set(prev.map((p) => p.name));
        const uniqueNewList = newList.filter((p) => !existingNames.has(p.name));
        return [...prev, ...uniqueNewList];
      });
    } catch (err) {
      console.error('Error loading more Pokemon:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load effect
  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      try {
        const result = await fetchPokemonList(
          'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21',
        );
        setPageUrl(result?.next ?? null);
        const newList = result?.results ?? [];
        const details = await fetchAllPokemonDetails(newList);
        const validDetails = details.filter(
          (item): item is PokemonData => item !== null,
        );
        setPokemonData(validDetails);
        setPokemonList(newList);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };

    initialLoad();
  }, []);

  // Search effect - only runs when searchTerm changes
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (searchTerm) {
          // Clear existing data when searching
          setPokemonData([]);
          setPokemonList([]);

          const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}/`;
          try {
            const result = await fetchAllPokemonDetails(url);
            const validResults = result.filter(
              (item): item is PokemonData => item !== null,
            );
            if (isMounted) setPokemonData(validResults);
          } catch {
            // If direct search fails, try filtering from existing list
            const filtered = pokemonList.filter((p) =>
              p.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            if (filtered.length > 0) {
              const result = await fetchAllPokemonDetails(filtered);
              const validResults = result.filter(
                (item): item is PokemonData => item !== null,
              );
              if (isMounted) setPokemonData(validResults);
            } else {
              if (isMounted) setPokemonData([]);
            }
          }
        } else {
          // When search is cleared, reset to initial state and reload
          setPokemonData([]);
          setPokemonList([]);
          setPageUrl('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21');

          // Load initial data
          const result = await fetchPokemonList(
            'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=21',
          );
          setPageUrl(result?.next ?? null);
          const newList = result?.results ?? [];
          const details = await fetchAllPokemonDetails(newList);
          const validDetails = details.filter(
            (item): item is PokemonData => item !== null,
          );
          if (isMounted) {
            setPokemonData(validDetails);
            setPokemonList(newList);
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [searchTerm]);

  return {
    search,
    setSearch,
    pokemonData,
    loading,
    error,
    loadMore,
    hasMore: !!pageUrl,
  };
}
