import { useState, useEffect } from 'react'
import aniara from './assets/IMG_1500.png'

const customPokemon = {
  aniara: {
    name: 'Aniara',
    height: 42,
    weight: 420,
    sprites: {
      other: {
        'official-artwork': {
          front_default: aniara
        }
      },
      front_default: aniara
    },
    types: [
      { type: { name: 'grass' } }
    ]
  }
}

function App() {
  const [search, setSearch] = useState('pikachu')
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!search) return

    let ignore = false;
    setLoading(true)
    const searchLower = search.trim().toLowerCase()

    // Check for custom pokemon first
    if (customPokemon[searchLower]) {
      setData(customPokemon[searchLower])
      setLoading(false)
      return () => { ignore = true }
    }

    // Otherwise fetch from API
    const url = `https://pokeapi.co/api/v2/pokemon/${searchLower}`;

    const fetchPokemon = () => {
      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Pokemon not found: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          if (!ignore) setData(json);
        })
        .catch((error) => {
          if (!ignore) {
            console.error(error.message);
            setData(null)
          }
        })
        .finally(() => {
          if (!ignore) setLoading(false)
        })
    }
    fetchPokemon();

    return () => { ignore = true }
  }, [search])

  return (
    <div className="app-container">
      <h1 className="title">Pokédex</h1>
      
      <input
        type="text"
        className="search-bar"
        placeholder="Search Pokemon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="pokedex-screen">
        {loading ? (
          <p>Loading...</p>
        ) : data ? (
          <div className="pokemon-card">
            <img 
              src={data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default} 
              alt={data.name}
            />
            <h2 className="pokemon-name">{data.name}</h2>
            <div className="type-container">
              {data.types?.map((type) => (
                <span key={type.type.name} className="type-badge">
                  {type.type.name}
                </span>
              ))}
            </div>
            <p>Height: {data.height / 10}m</p>
            <p>Weight: {data.weight / 10}kg</p>
          </div>
        ) : (
          <p>No Pokemon found. Try another search!</p>
        )}
      </div>
    </div>
  )
}

export default App
