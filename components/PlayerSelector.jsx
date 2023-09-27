import { AiFillAlert } from "react-icons/ai";
import AsyncSelect from "react-select/async";

export default function PlayerSelector({ index, handleChange, errorId }) {
  const search = async (inputValue) => {
    // const res = await fetch(
    //   `https://d803-186-13-96-199.ngrok-free.app/https://api.beatleader.xyz/players?sortBy=pp&page=1&count=50&search=${inputValue}&mapsType=ranked&ppType=general&friends=false`
    // );

    const res = await fetch(
      `https://d803-186-13-96-199.ngrok-free.app/https://api.beatleader.xyz/players?sortBy=pp&page=1&count=50&search=${inputValue}&mapsType=ranked&ppType=general&friends=false`,
      {
        headers: {
          origin: "aplication/json",
        },
      }
    );

    const { data } = await res.json();
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
