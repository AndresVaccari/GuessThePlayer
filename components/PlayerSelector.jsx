import axios from "axios";
import AsyncSelect from "react-select/async";

export default function PlayerSelector({ index, handleChange, errorId }) {
  const search = async (inputValue) => {
    // Llamamos a nuestra API Route (misma origin => sin CORS)
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
      label: `${item.name} - ${item.country}`,
      value: item,
    }));
  };

  return (
    <div className="grow">
      <AsyncSelect
        loadOptions={search}
        onChange={(result) => handleChange(index, result.value)}
        placeholder="Search for a player..."
        noOptionsMessage={() => "No players found"}
        defaultOptions={false}
        required
        className={`text-black w-full rounded-md ${
          errorId == index && "border-red-500"
        }`}
      />
    </div>
  );
}
