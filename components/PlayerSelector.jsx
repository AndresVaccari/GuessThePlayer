import { useCallback, useState, useRef } from "react";
import { SearchList } from "./SearchList";

export default function PlayerSelector({
  index,
  handleChange,
  player,
  errorId,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  const searchEndpoint = (query) =>
    `https://cors-anywhere-andresvaccari.onrender.com/https://api.beatleader.xyz/players?sortBy=pp&page=1&count=50&search=${query}&mapsType=ranked&ppType=general&friends=false`;

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
    <div className="grow">
      <input
        type="text"
        id="beatleader-player"
        name="beatleader-player"
        className={`text-black w-full border-2 rounded-md p-2 ${
          errorId == index && "border-red-500"
        }`}
        placeholder="Search for a player..."
        title="Search for a player..."
        required
        autoComplete="off"
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
