import type { PokemonData, PokemonListResponse } from '@/helper/pokemonTypes';

export const getPokemonImages = (pokemon: PokemonData) => {
  return (
    pokemon?.sprites?.other?.['official-artwork']?.front_default ||
    '/pokeball_bg'
  );
};

export const getPokemonTypes = (pokemon: PokemonData): string[] => {
  return (pokemon?.types || []).map((p) => p.type?.name) as string[];
};

export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getPokemonId = (pokemon: PokemonData): string => {
  return `#${pokemon?.id}` || '#';
};
