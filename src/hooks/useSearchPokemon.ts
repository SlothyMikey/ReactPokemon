import { useEffect, useMemo, useState } from 'react';
import type { PokemonData } from '@/helper/pokemonTypes';
import type { PokemonBasic } from '@/helper/pokemonTypes';
import { fetchAllPokemonDetails, fetchPokemonList } from '@/api/pokemon';
import useDebounceSearch from '@/hooks/useDebounceSearch';

export default function useSearchPokemon() {
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [pokemonFilteredDetails, setPokemonFilteredDetails] = useState<
    PokemonData[]
  >([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceSearch = useDebounceSearch(search);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    (async () => {
      try {
        const result = await fetchPokemonList();
        if (isMounted) setPokemonList(result);
      } catch (e: any) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const searchTerm = debounceSearch.toLowerCase();

  const filteredPokemon = useMemo(() => {
    return debounceSearch
      ? pokemonList.filter((p) => p.name.toLowerCase().includes(searchTerm))
      : pokemonList;
  }, [pokemonList, debounceSearch]);

  useEffect(() => {
    if (!filteredPokemon.length) return;

    let isMounted = true;
    setLoading(true);

    (async () => {
      try {
        const details = await fetchAllPokemonDetails(filteredPokemon);

        if (isMounted) setPokemonFilteredDetails(details);
      } catch (e: any) {
        if (isMounted) setError(e.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [filteredPokemon]);

  return { setSearch, pokemonFilteredDetails, loading, error };
}
