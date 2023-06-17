import PlayerSelector from "./PlayerSelector";

export default function MainPage({
  players,
  handleSubmit,
  handleChange,
  handleAddPlayer,
  handleRemovePlayer,
  loading,
  errorId,
}) {
  return (
    <div className={`${loading && "blur-sm"}`}>
      <div>
        <h1 className="text-2xl mb-4">Guess the player</h1>
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
        <p className="text-xl w-full">How many songs?</p>
        <input
          type="number"
          id="quantity"
          name="quantity"
          className="bg-black text-white border-2 border-white rounded-md p-2"
          defaultValue={1}
          min={1}
          max={20}
          required
        />
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
