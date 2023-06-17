import { useCallback, useState, useRef } from "react";
import { SearchList } from "./SearchList";

export default function PlayerSelector({ index, handleChange, player }) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const searchEndpoint = (query) =>
    `https://web-production-55ce.up.railway.app/https://api.beatleader.xyz/players?sortBy=pp&page=1&count=50&search=${query}&mapsType=ranked&ppType=general&friends=false`;

  const search = useCallback(async (event) => {
    setResults([]);
    const searchTerm = event.target.value;
    if (searchTerm.trim() !== "" && searchTerm.length > 3) {
      try {
        const response = await fetch(searchEndpoint(searchTerm));
        const { data } = await response.json();
        setResults(data);
      } catch (error) {
        setResults([]);
      }
    } else {
      setResults([]);
    }
  }, []);

  const handleResultClick = (result) => {
    handleChange(index, result);
    setSelectedPlayer(result);
    inputRef.current.value = result.name;
    setResults([]);
  };

  return (
    <div>
      <input
        type="text"
        name="name"
        id="name"
        className="text-black border-2 border-black rounded-md p-2"
        placeholder="Search for a player..."
        title="Search for a player..."
        required
        defaultValue={player?.name || ""}
        onChange={search}
        onClick={(e) => {
          setSelectedPlayer(null);
          search(e);
          inputRef.current.value = "";
          inputRef.current.focus();
        }}
        ref={inputRef}
      />
      {results.length > 0 && !selectedPlayer && (
        <SearchList results={results} onClick={handleResultClick} />
      )}
    </div>
  );
}
