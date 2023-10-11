import { AiFillAlert } from "react-icons/ai";
import axios from "axios";
import AsyncSelect from "react-select/async";
import { PROXY } from "@/pages/api/hello";

export default function PlayerSelector({ index, handleChange, errorId }) {
  const search = async (inputValue) => {
    const headers = {
      "x-requested-with": "XMLHttpRequest",
      "ngrok-skip-browser-warning": "true",
    };

    const res = await axios.get(
      `${PROXY}/https://api.beatleader.xyz/players?sortBy=pp&page=1&count=50&search=${inputValue}&mapsType=ranked&ppType=general&friends=false`,
      { headers }
    );

    const data = await res.data.data;

    return data.map((item) => ({
      label: item.name + " - " + item.country,
      value: item,
    }));
  };

  return (
    <div className="grow">
      <AsyncSelect
        loadOptions={search}
        onChange={(result) => {
          handleChange(index, result.value);
        }}
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
