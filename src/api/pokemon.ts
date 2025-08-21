import type { PokemonData } from '@/helper/pokemonTypes.ts';
import type { PokemonBasic } from '@/helper/pokemonTypes.ts';
import type { PokemonListResponse } from '@/helper/pokemonTypes.ts';

export const fetchPokemonList = async (url: string) => {
  const res = await fetch(url);
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

export const fetchAllPokemonDetails = async (arg: PokemonBasic[] | string) => {
  if (typeof arg === 'string') {
    const data = await fetchPokemonDetails(arg);
    return [data];
  } else if (Array.isArray(arg)) {
    const promises = arg.map((p) => fetchPokemonDetails(p.url));
    return Promise.all(promises);
  } else {
    throw new Error('Invalid argument: must be a list or a URL');
  }
};
