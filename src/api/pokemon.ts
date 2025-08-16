import type { PokemonData } from '@/helper/pokemonTypes.ts';
import type { PokemonBasic } from '@/helper/pokemonTypes.ts';
import type { PokemonListResponse } from '@/helper/pokemonTypes.ts';

export const fetchPokemonList = async (limit = 1000) => {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
  if (!res.ok) {
    throw new Error('Fetching Failed: ' + res.status);
  }
  const data: PokemonListResponse = await res.json();
  return data.results;
};

export const fetchPokemonDetails = async (
  url: string,
): Promise<PokemonData> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Fetching Failed: ' + res.status);
  }
  return await res.json();
};

export const fetchAllPokemonDetails = async (
  pokemonList: PokemonBasic[],
): Promise<PokemonData[]> => {
  const promises = pokemonList.map((p) => fetchPokemonDetails(p.url));
  return Promise.all(promises);
};
