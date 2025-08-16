import { useEffect, useState } from 'react';
import type { PokemonData } from '@/helper/pokemonTypes';
import type { PokemonBasic } from '@/helper/pokemonTypes';
import { fetchAllPokemonDetails, fetchPokemonList } from '@/api/pokemon';

export default function useSearchPokemon() {
  const [pokemonList, setPokemonList] = useState<PokemonBasic[]>([]);
  const [pokemonDetails, setPokemonDetails] = useState<PokemonData[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    (async () => {
      try {
        const result = await fetchPokemonList();
        setPokemonList(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!pokemonList.length) return;
    setLoading(true);

    (async () => {
      try {
        const details = await fetchAllPokemonDetails(pokemonList);

        setPokemonDetails(details);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [pokemonList]);

  const searchTerm = search.toLowerCase();

  const filteredPokemon = search
    ? pokemonDetails.filter((p) => p.name.toLowerCase().includes(searchTerm))
    : pokemonDetails;

  return { setSearch, filteredPokemon, loading, error };
}
