import { use, useEffect, useMemo, useState } from 'react';
import type { PokemonData } from '@/helper/pokemonTypes';
import type { PokemonBasic } from '@/helper/pokemonTypes';
import {
  fetchAllPokemonDetails,
  fetchPokemonDetails,
  fetchPokemonList,
} from '@/api/pokemon';
import useDebounceSearch from '@/hooks/useDebounceSearch';

export default function useSearchPokemon() {
  const [pokemonData, setPokemonData] = useState<PokemonData[]>([]);
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [search, setSearch] = useState('');
  const [url, setUrl] = useState(`https://pokeapi.co/api/v2/pokemon/`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceSearch = useDebounceSearch(search);
  const pokemonName = debounceSearch.toLowerCase();

  useEffect(() => {
    if (!search) return;

    let m = true;
    const searchPokemonByName = async () => {
      try {
        const res = await fetchAllPokemonDetails(
          `https://pokeapi.co/api/v2/pokemon/${pokemonName}/`,
        );
        if (m) setPokemonData(res);
      } catch (e) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    searchPokemonByName();
    return () => {
      m = false;
    };
  }, [search, pokemonList]);

  useEffect(() => {
    let m = true;
    setLoading(true);
    setError(null);

    const fetchPokemonListByUrl = async () => {
      try {
        const result = await fetchPokemonList(url);
        if (m) setPokemonList((prev) => [...prev, ...result]);
      } catch (e) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonListByUrl();
    return () => {
      m = false;
    };
  }, []);

  useEffect(() => {
    let m = true;

    setLoading(true);
    setError(null);

    const fetchPokemonListDetails = async () => {
      try {
        const result = await fetchAllPokemonDetails(pokemonList);
        if (m) setPokemonData(result);
      } catch (e) {
        setError('Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonListDetails();

    return () => {
      m = false;
    };
  }, [pokemonList]);

  return { search, setSearch, pokemonData, loading, error };
}
