import { useState, useEffect } from 'react';
import { POKEMON_EXTRA_DATA } from './pokemonExtraData.js';
import { NATIONAL_DEX } from './nationalDex.js';
import './App.css';

const BASE_DEX = [
  "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Abra", "Kadabra", "Alakazam", "Magikarp", "Gyarados", "Budew", "Roselia", "Roserade", "Zubat", "Golbat", "Crobat", "Geodude", "Graveler", "Golem", "Onix", "Steelix", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Machop", "Machoke", "Machamp", "Psyduck", "Golduck", "Burmy", "Wormadam", "Mothim", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Heracross", "Aipom", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Gastly", "Haunter", "Gengar", "Misdreavus", "Mismagius", "Murkrow", "Honchkrow", "Glameow", "Purugly", "Goldeen", "Seaking", "Barboach", "Whiscash", "Chingling", "Chimecho", "Stunky", "Skuntank", "Meditite", "Medicham", "Bronzor", "Bronzong", "Ponyta", "Rapidash", "Bonsly", "Sudowoodo", "Mime Jr.", "Mr. Mime", "Happiny", "Chansey", "Blissey", "Cleffa", "Clefairy", "Clefable", "Chatot", "Pichu", "Pikachu", "Raichu", "Hoothoot", "Noctowl", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Snorlax", "Unown", "Riolu", "Lucario", "Wooper", "Quagsire", "Wingull", "Pelipper", "Girafarig", "Hippopotas", "Hippowdon", "Azurill", "Marill", "Azumarill", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Remoraid", "Octillery", "Finneon", "Lumineon", "Tentacool", "Tentacruel", "Feebas", "Milotic", "Mantyke", "Mantine", "Snover", "Abomasnow", "Sneasel", "Weavile", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Manaphy"
];

const POSTGAME_COMMON = [
  "Heatran", "Regigigas", "Giratina", "Cresselia", "Mewtwo", "Rayquaza", "Latias", "Latios", "Kyogre", "Groudon", "Regirock", "Regice", "Registeel"
];

const POSTGAME_DIAMOND = [
  "Ho-Oh", "Raikou", "Entei", "Suicune"
];

const POSTGAME_PEARL = [
  "Lugia", "Articuno", "Zapdos", "Moltres"
];

const getPokeApiName = (name) => {
  let lowerName = name.toLowerCase();
  if (lowerName === "mime jr.") return "mime-jr";
  if (lowerName === "mr. mime") return "mr-mime";
  if (lowerName === "porygon-z") return "porygon-z";
  if (lowerName === "wormadam") return "wormadam-plant";
  if (lowerName === "giratina") return "giratina-altered";
  if (lowerName === "shaymin") return "shaymin-land";
  if (lowerName === "deoxys") return "deoxys-normal";
  if (lowerName === "ho-oh") return "ho-oh";
  if (lowerName === "nidoran-f" || lowerName === "nidoran♀") return "nidoran-f";
  if (lowerName === "nidoran-m" || lowerName === "nidoran♂") return "nidoran-m";
  return lowerName;
};

const TYPE_CHART = {
  normal: { weak: ['fighting'], resist: [], immune: ['ghost'] },
  fire: { weak: ['water', 'ground', 'rock'], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'], immune: [] },
  water: { weak: ['electric', 'grass'], resist: ['fire', 'water', 'ice', 'steel'], immune: [] },
  electric: { weak: ['ground'], resist: ['electric', 'flying', 'steel'], immune: [] },
  grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], resist: ['water', 'electric', 'grass', 'ground'], immune: [] },
  ice: { weak: ['fire', 'fighting', 'rock', 'steel'], resist: ['ice'], immune: [] },
  fighting: { weak: ['flying', 'psychic', 'fairy'], resist: ['bug', 'rock', 'dark'], immune: [] },
  poison: { weak: ['ground', 'psychic'], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'], immune: [] },
  ground: { weak: ['water', 'grass', 'ice'], resist: ['poison', 'rock'], immune: ['electric'] },
  flying: { weak: ['electric', 'ice', 'rock'], resist: ['grass', 'fighting', 'bug'], immune: ['ground'] },
  psychic: { weak: ['bug', 'ghost', 'dark'], resist: ['fighting', 'psychic'], immune: [] },
  bug: { weak: ['fire', 'flying', 'rock'], resist: ['grass', 'fighting', 'ground'], immune: [] },
  rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], resist: ['normal', 'fire', 'poison', 'flying'], immune: [] },
  ghost: { weak: ['ghost', 'dark'], resist: ['poison', 'bug'], immune: ['normal', 'fighting'] },
  dragon: { weak: ['ice', 'dragon', 'fairy'], resist: ['fire', 'water', 'electric', 'grass'], immune: [] },
  dark: { weak: ['fighting', 'bug', 'fairy'], resist: ['ghost', 'dark'], immune: ['psychic'] },
  steel: { weak: ['fire', 'fighting', 'ground'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], immune: ['poison'] },
  fairy: { weak: ['poison', 'steel'], resist: ['fighting', 'bug', 'dark'], immune: ['dragon'] }
};

const calculateTypeMatchup = (types) => {
  const result = {};
  for (const t of Object.keys(TYPE_CHART)) result[t] = 1;
  for (const t of types) {
    const typeDef = TYPE_CHART[t];
    if (!typeDef) continue;
    for (const w of typeDef.weak) result[w] *= 2;
    for (const r of typeDef.resist) result[r] *= 0.5;
    for (const i of typeDef.immune) result[i] *= 0;
  }
  return result;
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('lobby'); // lobby, pokedex-regional, pokedex-national, types, shiny
  const [version, setVersion] = useState('diamond');
  
  const [caughtMap, setCaughtMap] = useState(() => {
    const saved = localStorage.getItem('sinnoh-dex-caught');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed["1"] !== undefined) {
        const migrated = {};
        for (const [key, value] of Object.entries(parsed)) {
          if (value) {
            const idx = parseInt(key, 10);
            if (!isNaN(idx) && BASE_DEX[idx - 1]) migrated[BASE_DEX[idx - 1]] = true;
          }
        }
        localStorage.setItem('sinnoh-dex-caught', JSON.stringify(migrated));
        return migrated;
      }
      return parsed;
    }
    return {};
  });

  const [shinyCounters, setShinyCounters] = useState(() => {
    const saved = localStorage.getItem('sinnoh-dex-shiny-counters');
    return saved ? JSON.parse(saved) : {};
  });

  const toggleCaught = (name, e) => {
    if (e) e.stopPropagation();
    const newCaught = { ...caughtMap, [name]: !caughtMap[name] };
    setCaughtMap(newCaught);
    localStorage.setItem('sinnoh-dex-caught', JSON.stringify(newCaught));
  };

  const updateCounter = (name, amount) => {
    setShinyCounters(prev => {
      const current = prev[name] || 0;
      const next = Math.max(0, current + amount);
      const updated = { ...prev, [name]: next };
      localStorage.setItem('sinnoh-dex-shiny-counters', JSON.stringify(updated));
      return updated;
    });
  };

  const getShinyMethod = (name) => {
    const legendaries = ["Uxie", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Mewtwo", "Rayquaza", "Latias", "Latios", "Kyogre", "Groudon", "Regirock", "Regice", "Registeel", "Ho-Oh", "Raikou", "Entei", "Suicune", "Lugia", "Articuno", "Zapdos", "Moltres"];
    const starters = ["Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon"];
    const shinyLocked = ["Mew", "Jirachi", "Manaphy"];
    const roamer = ["Mesprit", "Cresselia"];
    const fossilOrGift = ["Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Riolu", "Lucario", "Eevee"];

    if (shinyLocked.includes(name)) return { title: "Shiny Locked", desc: "Este Pokémon no puede obtenerse Shiny de forma legal en los juegos originales de Sinnoh.", tips: [] };
    if (legendaries.includes(name)) return { title: "Soft Reset (Legendario)", desc: "Guarda la partida justo delante del Pokémon. Inicia el combate y reinicia si no es Shiny.", tips: ["Probabilidad: 1/8192 (DS).", "Lleva Falso Tortazo y Espora."] };
    if (starters.includes(name) || fossilOrGift.includes(name)) return { title: "Soft Reset (Regalo)", desc: "Guarda la partida justo antes de recibir el Pokémon. Recíbelo y reinicia si no es Shiny.", tips: ["Probabilidad estándar: 1/8192."] };
    if (roamer.includes(name)) return { title: "Soft Reset (Errante)", desc: "El estado Shiny se determina la primera vez que hablas con ellos.", tips: ["Usa Mal de Ojo o Sombra Trampa."] };
    if (name === "Pichu") return { title: "Pichu Picoreja / Evento", desc: "Obtenido por huevo.", tips: ["Método Masuda recomendado."] };

    return { 
      title: "Poké Radar / Cadena", 
      desc: "Usa el Poké Radar en la hierba alta para encadenar encuentros.", 
      tips: [
        "Lleva muchos Repelentes Máximos.",
        "Entra a la hierba a 4 pasos de distancia.",
        "Al llegar a 40, ¡el ratio es de 1/99!."
      ] 
    };
  };

  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showShinyImage, setShowShinyImage] = useState(false);
  const [showShinyModal, setShowShinyModal] = useState(false);
  const [showCalcModal, setShowCalcModal] = useState(false);

  const toggleGlobalType = (type) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else if (selectedTypes.length < 2) {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const loadEvolutions = async (name) => {
    try {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${getPokeApiName(name)}`);
      if (!speciesRes.ok) return;
      const speciesData = await speciesRes.json();
      if (!speciesData.evolution_chain) return;
      const chainRes = await fetch(speciesData.evolution_chain.url);
      if (!chainRes.ok) return;
      const chainData = await chainRes.json();
      
      const parseChain = (node) => {
        let evos = [node.species.name];
        if (node.evolves_to && node.evolves_to.length > 0) {
          node.evolves_to.forEach(child => {
            evos = evos.concat(parseChain(child));
          });
        }
        return evos;
      };
      
      const allEvos = parseChain(chainData.chain);
      
      const evoSprites = await Promise.all(allEvos.map(async (evoName) => {
        const capsName = evoName.charAt(0).toUpperCase() + evoName.slice(1);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
        if(res.ok) {
          const d = await res.json();
          return { name: capsName, image: d.sprites.front_default };
        }
        return { name: capsName, image: null };
      }));

      setPokemonDetails(prev => ({
        ...prev,
        [name]: {
          ...prev[name],
          evolutions: evoSprites.filter(e => e.image !== null)
        }
      }));
    } catch (e) {
      console.error('Error loading evolutions', e);
    }
  };

  const handleSelect = async (name) => {
    setSelectedPokemon({ name });
    setShowShinyModal(false);
    setShowCalcModal(false);
    setShowShinyImage(false);
    
    if (!pokemonDetails[name]) {
      setLoading(true);
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${getPokeApiName(name)}`);
        if (res.ok) {
          const data = await res.json();
          const encountersRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.id}/encounters`);
          let encounters = [];
          if (encountersRes.ok) {
            const encData = await encountersRes.json();
            encounters = encData.filter(e => e.location_area.name.includes('sinnoh')).map(e => e.location_area.name.replace(/-/g, ' '));
          }
          
          setPokemonDetails(prev => ({
            ...prev,
            [name]: {
              image: data.sprites.other['official-artwork'].front_default,
              imageShiny: data.sprites.other['official-artwork'].front_shiny || data.sprites.front_shiny,
              types: data.types.map(t => t.type.name),
              stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
              locations: [...new Set(encounters)]
            }
          }));
          loadEvolutions(name);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    } else {
      const cached = pokemonDetails[name];
      if (cached && !cached.evolutions) {
        loadEvolutions(name);
      }
    }
  };

  const renderLobby = () => (
    <div className="mobile-lobby">
      <div className="lobby-header">
        <h1>Pokémon OS</h1>
        <p>Terminal Móvil de Entrenador</p>
      </div>
      <div className="lobby-grid">
        <div className="app-icon" onClick={() => setCurrentScreen('pokedex-regional')}>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Pokédex Regional" />
          <span>Regional</span>
        </div>
        <div className="app-icon" onClick={() => setCurrentScreen('pokedex-national')}>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Pokédex Nacional" />
          <span>Nacional</span>
        </div>
        <div className="app-icon" onClick={() => setCurrentScreen('types')}>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/vs-seeker.png" alt="Tipos" />
          <span>Tipos</span>
        </div>
        <div className="app-icon" onClick={() => setCurrentScreen('shiny')}>
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/shiny-charm.png" alt="Shiny" />
          <span>Rastreador</span>
        </div>
      </div>
    </div>
  );

  const renderTypes = () => (
    <div className="mobile-app-screen types-screen">
      <div className="nav-bar">
        <button className="back-btn" onClick={() => setCurrentScreen('lobby')}>← Atrás</button>
        <h2>Calculadora de Tipos</h2>
      </div>
      <div className="content-area">
        <p style={{color: '#ccc', textAlign: 'center', margin: '10px 0'}}>Selecciona 1 o 2 tipos:</p>
        <div className="type-selector-grid">
          {Object.keys(TYPE_CHART).map(t => (
            <span 
              key={t} 
              className={`type-badge type-${t} type-badge-btn ${!selectedTypes.includes(t) && selectedTypes.length === 2 ? 'dimmed' : ''}`}
              onClick={() => toggleGlobalType(t)}
              style={{ border: selectedTypes.includes(t) ? '2px solid #fff' : '2px solid transparent' }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px', padding: '0 10px'}}>
          {(() => {
            if (selectedTypes.length === 0) return <p style={{width:'100%', textAlign:'center'}}>Ningún tipo seleccionado.</p>;
            const matchup = calculateTypeMatchup(selectedTypes);
            const weak4x = Object.keys(matchup).filter(t => matchup[t] === 4);
            const weak2x = Object.keys(matchup).filter(t => matchup[t] === 2);
            const resist05x = Object.keys(matchup).filter(t => matchup[t] === 0.5);
            const resist025x = Object.keys(matchup).filter(t => matchup[t] === 0.25);
            const immune = Object.keys(matchup).filter(t => matchup[t] === 0);
            
            return (
              <div className="type-results">
                {weak4x.length > 0 && <div className="result-group"><strong>x4 (Súper Débil):</strong><div className="badges">{weak4x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                {weak2x.length > 0 && <div className="result-group"><strong>x2 (Débil):</strong><div className="badges">{weak2x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                {resist05x.length > 0 && <div className="result-group"><strong>x0.5 (Resiste):</strong><div className="badges">{resist05x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                {resist025x.length > 0 && <div className="result-group"><strong>x0.25 (Súper Resiste):</strong><div className="badges">{resist025x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                {immune.length > 0 && <div className="result-group"><strong>x0 (Inmune):</strong><div className="badges">{immune.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );

  const renderShiny = () => {
    const list = [...BASE_DEX, ...POSTGAME_COMMON, ...(version === 'diamond' ? POSTGAME_DIAMOND : POSTGAME_PEARL)];
    const shinyHuntedList = list.filter(name => shinyCounters[name] > 0);
    return (
      <div className="mobile-app-screen shiny-hunt-screen">
        <div className="nav-bar">
          <button className="back-btn" onClick={() => setCurrentScreen('lobby')}>← Atrás</button>
          <h2>Rastreador Shiny</h2>
        </div>
        <div className="content-area">
          <p style={{textAlign: 'center', fontSize: '14px', color: '#ccc', margin: '15px 0'}}>Tus cadenas y Soft Resets activos:</p>
          <div className="shiny-list">
            {shinyHuntedList.length === 0 ? (
              <p style={{textAlign: 'center', fontStyle: 'italic', marginTop: '30px'}}>No tienes contadores activos.</p>
            ) : (
              shinyHuntedList.sort((a,b) => shinyCounters[b] - shinyCounters[a]).map(name => (
                <div key={name} className="shiny-card">
                  <div>
                    <span className="shiny-name">{name}</span>
                    <div className="shiny-method">{getShinyMethod(name).title}</div>
                  </div>
                  <div className="shiny-counter-val">
                    {shinyCounters[name]}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPokedex = () => {
    const currentList = currentScreen === 'pokedex-national' 
      ? NATIONAL_DEX 
      : [...BASE_DEX, ...POSTGAME_COMMON, ...(version === 'diamond' ? POSTGAME_DIAMOND : POSTGAME_PEARL)];
    const total = currentList.length;
    const totalCaught = currentList.filter(name => caughtMap[name]).length;

    return (
      <div className="mobile-app-screen pokedex-app">
        {selectedPokemon ? (
          <div className="detail-view">
            <div className="nav-bar">
              <button className="back-btn" onClick={() => setSelectedPokemon(null)}>← Lista</button>
              <h2>{selectedPokemon.name}</h2>
            </div>
            
            <div className="content-area">
              {loading && !pokemonDetails[selectedPokemon.name] ? (
                <div className="loading-spinner">Cargando datos del servidor de la liga...</div>
              ) : pokemonDetails[selectedPokemon.name] ? (
                <>
                  <div className="action-buttons-top">
                    <button className="help-btn" onClick={() => setShowShinyModal(true)}>Info Shiny</button>
                    <button className="calc-button" onClick={() => setShowCalcModal(true)}>Defensas</button>
                  </div>
                  
                  {showShinyModal && (
                    <div className="modal-overlay" onClick={() => setShowShinyModal(false)}>
                      <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowShinyModal(false)}>X</button>
                        <h3 className="modal-title">Caza Shiny: {selectedPokemon.name}</h3>
                        <h4 className="modal-subtitle">{getShinyMethod(selectedPokemon.name).title}</h4>
                        <p className="modal-desc">{getShinyMethod(selectedPokemon.name).desc}</p>
                        <ul className="modal-tips">
                          {getShinyMethod(selectedPokemon.name).tips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {showCalcModal && (
                    <div className="modal-overlay" onClick={() => setShowCalcModal(false)}>
                      <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowCalcModal(false)}>X</button>
                        <h3 className="modal-title">Análisis Defensivo</h3>
                        <div className="type-results">
                          {(() => {
                            const matchup = calculateTypeMatchup(pokemonDetails[selectedPokemon.name].types);
                            const weak4x = Object.keys(matchup).filter(t => matchup[t] === 4);
                            const weak2x = Object.keys(matchup).filter(t => matchup[t] === 2);
                            const resist05x = Object.keys(matchup).filter(t => matchup[t] === 0.5);
                            const resist025x = Object.keys(matchup).filter(t => matchup[t] === 0.25);
                            const immune = Object.keys(matchup).filter(t => matchup[t] === 0);
                            
                            return (
                              <>
                                {weak4x.length > 0 && <div className="result-group"><strong>x4 (Súper Débil):</strong><div className="badges">{weak4x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                                {weak2x.length > 0 && <div className="result-group"><strong>x2 (Débil):</strong><div className="badges">{weak2x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                                {resist05x.length > 0 && <div className="result-group"><strong>x0.5 (Resiste):</strong><div className="badges">{resist05x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                                {resist025x.length > 0 && <div className="result-group"><strong>x0.25 (Súper Resiste):</strong><div className="badges">{resist025x.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                                {immune.length > 0 && <div className="result-group"><strong>x0 (Inmune):</strong><div className="badges">{immune.map(t => <span key={t} className={`type-badge type-${t}`}>{t}</span>)}</div></div>}
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="pokemon-image-container">
                    <img 
                      src={showShinyImage && pokemonDetails[selectedPokemon.name].imageShiny ? pokemonDetails[selectedPokemon.name].imageShiny : pokemonDetails[selectedPokemon.name].image} 
                      alt={selectedPokemon.name}
                      className={`pokemon-image ${!caughtMap[selectedPokemon.name] ? 'uncaught' : ''}`}
                    />
                    <button className="shiny-toggle-btn" onClick={() => setShowShinyImage(!showShinyImage)}>
                      {showShinyImage ? '✨' : '⭐'}
                    </button>
                  </div>
                  
                  <div className="pokemon-info">
                    <div className="types-container">
                      {pokemonDetails[selectedPokemon.name].types.map(t => (
                        <span key={t} className={`type-badge type-${t}`}>{t}</span>
                      ))}
                    </div>
                    <p className="pokemon-lore">
                      {POKEMON_EXTRA_DATA[selectedPokemon.name] || 'Información clasificada.'}
                    </p>

                    {pokemonDetails[selectedPokemon.name].evolutions && (
                      <div className="evos-container">
                        <h4>Línea Evolutiva</h4>
                        <div className="evos-grid">
                          {pokemonDetails[selectedPokemon.name].evolutions.map(evo => (
                            <div key={evo.name} className="evo-item" onClick={(e) => { e.stopPropagation(); handleSelect(evo.name); }}>
                              <img src={evo.image} alt={evo.name} />
                              <span>{evo.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pokemonDetails[selectedPokemon.name].stats && (
                      <div className="stats-container">
                        <h4>Estadísticas Base</h4>
                        {pokemonDetails[selectedPokemon.name].stats.map(s => {
                          let label = s.name.toUpperCase();
                          if(label === 'SPECIAL-ATTACK') label = 'SP. ATK';
                          if(label === 'SPECIAL-DEFENSE') label = 'SP. DEF';
                          let color = '#7AC74C'; 
                          if (s.value < 50) color = '#EE8130'; 
                          if (s.value < 30) color = '#C22E28'; 
                          if (s.value > 100) color = '#6390F0'; 
                          if (s.value > 130) color = '#A33EA1'; 
                          
                          return (
                            <div key={s.name} className="stat-row">
                              <span className="stat-label">{label}</span>
                              <span className="stat-val">{s.value}</span>
                              <div className="stat-bar-bg">
                                <div className="stat-bar-fill" style={{width: `${Math.min(100, (s.value / 255) * 100)}%`, background: color}}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {pokemonDetails[selectedPokemon.name].locations && (
                      <div className="locations-container">
                        <h4>Rutas y Hábitats</h4>
                        {pokemonDetails[selectedPokemon.name].locations.length > 0 ? (
                          <div className="locations-grid">
                            {pokemonDetails[selectedPokemon.name].locations.map(loc => (
                              <span key={loc} className="location-badge">{loc}</span>
                            ))}
                          </div>
                        ) : (
                          <p className="no-locations">No se encuentra de forma salvaje.</p>
                        )}
                      </div>
                    )}
                    
                    <div className="action-cards">
                      <div className="action-card">
                        <span>¿Capturado?</span>
                        <input 
                          type="checkbox" 
                          className="caught-checkbox-big"
                          checked={!!caughtMap[selectedPokemon.name]}
                          onChange={(e) => toggleCaught(selectedPokemon.name, null)}
                        />
                      </div>
                      
                      <div className="action-card">
                        <span>Resets/Cadena:</span>
                        <div className="counter-controls">
                          <button onClick={() => updateCounter(selectedPokemon.name, -1)}>-</button>
                          <span className="counter-value">{shinyCounters[selectedPokemon.name] || 0}</span>
                          <button onClick={() => updateCounter(selectedPokemon.name, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="loading-spinner">No se encontraron datos.</div>
              )}
            </div>
          </div>
        ) : (
          <div className="list-view-container">
            <div className="nav-bar">
              <button className="back-btn" onClick={() => setCurrentScreen('lobby')}>← Atrás</button>
              <h2>Pokédex {currentScreen === 'pokedex-national' ? 'Nacional' : 'Regional'}</h2>
            </div>
            <div className="search-bar-container">
              <input 
                type="text" 
                className="search-input" 
                placeholder="Buscar Pokémon..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="filter-buttons">
                <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
                <button className={`filter-btn ${filter === 'caught' ? 'active' : ''}`} onClick={() => setFilter('caught')}>Tengo</button>
                <button className={`filter-btn ${filter === 'uncaught' ? 'active' : ''}`} onClick={() => setFilter('uncaught')}>Faltan</button>
              </div>
            </div>
            
            <div className="list-view">
              {currentList
                .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()))
                .filter(name => {
                  if (filter === 'caught') return caughtMap[name];
                  if (filter === 'uncaught') return !caughtMap[name];
                  return true;
                })
                .map((name) => {
                  const originalIndex = currentList.indexOf(name);
                  return (
                    <div 
                      key={name} 
                      className={`pokemon-item ${caughtMap[name] ? 'caught' : ''}`}
                      onClick={() => handleSelect(name)}
                    >
                      <div className="pokemon-item-info">
                        <span className="pokemon-number">#{String(originalIndex + 1).padStart(3, '0')}</span>
                        <span className="pokemon-name">{name}</span>
                      </div>
                      <input 
                        type="checkbox" 
                        className="caught-checkbox"
                        checked={!!caughtMap[name]}
                        onChange={(e) => toggleCaught(name, e)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )
                })}
            </div>
            
            <div className="bottom-status-bar">
              <div className="status-stats">Progreso: {totalCaught} / {total}</div>
              {currentScreen === 'pokedex-regional' && (
                <div className="version-toggles">
                  <button className={`v-btn ${version === 'diamond' ? 'active' : ''}`} onClick={() => setVersion('diamond')}>BD</button>
                  <button className={`v-btn ${version === 'pearl' ? 'active' : ''}`} onClick={() => setVersion('pearl')}>SP</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="iphone-viewport">
      <div className="iphone-screen">
        {currentScreen === 'lobby' && renderLobby()}
        {currentScreen === 'types' && renderTypes()}
        {currentScreen === 'shiny' && renderShiny()}
        {(currentScreen === 'pokedex-regional' || currentScreen === 'pokedex-national') && renderPokedex()}
      </div>
    </div>
  );
}
