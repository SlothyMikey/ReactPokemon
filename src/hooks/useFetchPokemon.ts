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
    'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  );

  const searchTerm = useDebounceSearch(search);

  const loadMore = async () => {
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
    } catch {
      // Handle Error here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
    return () => {};
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchData = async () => {
      try {
        if (search) {
          const url = `https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}/`;
          try {
            const result = await fetchAllPokemonDetails(url);
            const validResults = result.filter(
              (item): item is PokemonData => item !== null,
            );
            if (isMounted) setPokemonData(validResults);
          } catch {
            const filtered = pokemonList.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase()),
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
          //
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
  }, [searchTerm, pokemonList]);

  return { search, setSearch, pokemonData, loading, error, loadMore };
}
