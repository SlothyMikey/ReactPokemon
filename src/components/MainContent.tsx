import '@/global.css';
import useSearchPokemon from '@/hooks/useFetchPokemon';
import Loader from '@/components/Loader.tsx';
import PokemonCard from '@/feature/PokemonCard';

interface mainProps {
  motto: string;
}

export default function Main({ motto }: mainProps) {
  const { search, setSearch, pokemonData, loading, error, loadMore } =
    useSearchPokemon();
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
          value={search}
          placeholder="Search pokemon name"
        />
      </div>
      <div className="flex justify-center items-center mt-8">
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="w-screen-lg justify-center flex flex-col gap-8">
            {pokemonData && pokemonData.length > 0 ? (
              <>
                <div className="justify-center flex flex-wrap gap-16">
                  {pokemonData.map((d) => (
                    <PokemonCard key={d.id} data={d} />
                  ))}
                </div>
                {pokemonData.length !== 1 && (
                  <button
                    className=" p-4 w-xs rounded bg-pk-red text-pk-light justify-center font-bold self-center transition-transform hover:cursor-pointer hover:scale-105"
                    onClick={loadMore}
                  >
                    Load More
                  </button>
                )}
              </>
            ) : (
              <div>Unknown Pokemon</div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
