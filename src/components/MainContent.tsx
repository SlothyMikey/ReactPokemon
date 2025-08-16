import '@/global.css';
import useSearchPokemon from '@/hooks/useSearchPokemon';
import Loader from '@/components/Loader.tsx';
import PokemonCard from '@/feature/PokemonCard';

interface mainProps {
  motto: string;
}

export default function Main({ motto }: mainProps) {
  const { setSearch, filteredPokemon, loading, error } = useSearchPokemon();
  return (
    <main className="max-w-screen-lg mx-auto flex flex-col justify-center items-center px-4 py-6 gap-4">
      <h1 className="font-pokemon tracking-widest text-pk-blue text-2xl">
        {motto}
      </h1>
      <div className="w-full flex justify-center min-w-0">
        <img
          src="/pokeball_icon.png"
          alt="Pokeball Icon"
          className="aspect-square w-12 bg-inputIcon rounded-s-md p-1"
        />
        <input
          type="text"
          className="bg-input-bg text-input-txt font-bold rounded-e-md p-2 box-border w-xs input_reset"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search pokemon name"
        />
      </div>
      <div className="flex justify-center items-center mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-screen-lg justify-center flex flex-wrap gap-16">
            {filteredPokemon && filteredPokemon.length > 0 ? (
              filteredPokemon.map((d: any) => (
                <PokemonCard key={d.name} data={d} />
              ))
            ) : (
              <div>Unknown Pokemon</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
