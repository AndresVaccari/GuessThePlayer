import axios from "axios";
import AsyncSelect from "react-select/async";
import { useMemo } from "react";
import { fetchWithRetry } from "@/utils/net";

export default function PlayerSelector({
  player,
  index,
  handleChange,
  errorId,
}) {
  // Carga remota de opciones
  const search = async (inputValue) => {
    const res = await axios.get(`/api/bl/players`, {
      params: {
        sortBy: "pp",
        page: 1,
        count: 50,
        search: inputValue,
        mapsType: "ranked",
        ppType: "general",
        friends: false,
      },
    });

    const data = res.data?.data ?? [];
    return data.map((item) => ({
      label: `${item.name}${item.country ? ` - ${item.country}` : ""}`,
      value: {
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        country: item.country,
      },
    }));
  };

  // Opción seleccionada desde el estado persistido (string u objeto)
  const selectedOption = useMemo(() => {
    if (!player) return null;
    if (typeof player === "string") {
      // si por algún motivo quedó un string, no marcamos selección
      return null;
    }
    return {
      label: `${player.name}${player.country ? ` - ${player.country}` : ""}`,
      value: player,
    };
  }, [player]);

  return (
    <div className="grow">
      <AsyncSelect
        loadOptions={search}
        value={selectedOption} // ← CONTROLADO
        onChange={(opt) => handleChange(index, opt?.value ?? "")}
        placeholder="Search for a player..."
        noOptionsMessage={() => "No players found"}
        cacheOptions
        defaultOptions={false}
        isClearable
        className={`text-black w-full rounded-md ${
          errorId == index ? "border-red-500" : ""
        }`}
      />
    </div>
  );
}
