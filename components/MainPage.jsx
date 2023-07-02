import PlayerSelector from "./PlayerSelector";

export default function MainPage({
  players,
  handleSubmit,
  handleChange,
  handleAddPlayer,
  handleRemovePlayer,
  loading,
  errorId,
  endless,
  setEndless,
}) {
  return (
    <div className={`${loading && "blur-sm"}`}>
      <div>
        <h1 className="text-3xl mb-4 text-center">Guess the player</h1>
      </div>
      <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2 flex-col">
        <button
          onClick={handleAddPlayer}
          type="button"
          className="bg-black text-white border-2 border-white rounded-md p-2"
        >
          Add player
        </button>
        {players.map((player, index) => {
          return (
            <div key={index} className="flex gap-2 items-center">
              <PlayerSelector
                player={player}
                index={index}
                handleChange={handleChange}
                errorId={errorId}
              />
              <button
                onClick={() => handleRemovePlayer(index)}
                type="button"
                className="bg-black text-white border-2 border-white rounded-md p-2"
              >
                Remove player
              </button>
            </div>
          );
        })}
        <p className="text-xl w-full text-center">How many songs?</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            id="quantity"
            name="quantity"
            className={`bg-black text-white border-2 border-white rounded-md p-2 grow ${
              endless && "opacity-50"
            }`}
            defaultValue={1}
            min={1}
            max={50}
            required
            disabled={endless}
          />
          <label htmlFor="endless" className="text-xl">
            Endless Mode
          </label>
          <input
            type="checkbox"
            id="endless"
            name="endless"
            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
            onChange={() => setEndless(!endless)}
          />
        </div>
        <button
          type="submit"
          className="bg-black text-white border-2 border-white rounded-md p-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
