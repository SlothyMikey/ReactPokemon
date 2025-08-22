import {
  getPokemonImages,
  getPokemonTypes,
  capitalizeFirstLetter,
  getPokemonId,
} from '@/helper/pokemonUtils.ts';

import type { PokemonData } from '@/helper/pokemonTypes';

type PokemonCardProps = {
  data?: PokemonData;
};

export default function PokemonCard({ data }: PokemonCardProps) {
  if (!data) return null;

  const types: string[] = getPokemonTypes(data);

  return (
    <>
      <article className="bg-[url('/card_bg.png')] bg-cover bg-center bg-no-repeat rounded-md w-2xs h-auto flex flex-col shadow-md transition-transform hover:scale-105 hover:cursor-pointer">
        <header className="w-full py-2">
          <div className="px-4 flex justify-between">
            <div className="flex gap-2">
              {types.length ? (
                types.map((type) => (
                  <span
                    key={type}
                    className="bg-pk-yellow py-1 px-2 rounded-xl font-bold capitalize"
                  >
                    {type}
                  </span>
                ))
              ) : (
                <span className="bg-pk-yellow py-1 px-2 rounded-xl font-bold">
                  Unknown
                </span>
              )}
            </div>
            <span>{getPokemonId(data)}</span>
          </div>
        </header>
        <img
          src={getPokemonImages(data)}
          alt={data?.name ?? 'Pokemon Image'}
          className="self-center h-56"
        />
        <div className="mt-auto w-full bg-card-nameBg rounded-b-md">
          <p className="text-card-nameTxt text-center py-2 font-bold ">
            {capitalizeFirstLetter(
              data.name.includes('-') ? data.species.name : data.name,
            ) || 'Pokemon Name'}
          </p>
        </div>
      </article>
    </>
  );
}
