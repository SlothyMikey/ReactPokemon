export type PokemonBasic = {
  name: string;
  url: string;
};

export type PokemonData = {
  name: string;
  id: number;
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default?: string;
      };
    };
  };
  types?: Array<{
    type: {
      name: string;
    };
  }>;
};

export type PokemonListResponse = {
  results: PokemonBasic[];
};
