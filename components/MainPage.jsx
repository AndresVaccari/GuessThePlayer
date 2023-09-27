import { useState } from "react";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import PlayerSelector from "./PlayerSelector";
import { Tooltip } from "@mui/material";

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
  scores,
  setScores,
  lives,
  setLives,
  randomTimeMode,
  setRandomTimeMode,
  hardMode,
  setHardMode,
  arcViewer,
  setArcViewer,
}) {
  const [proMode, setProMode] = useState(false);

  return (
    <div className={`${loading && "blur-sm"}`}>
      <div>
        <h1 className="text-3xl mb-4 text-center">Guess the player</h1>
      </div>
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="flex justify-center gap-3 w-screen"
      >
        <div
          className={`flex flex-col gap-2 w-1/5 ${
            proMode ? "" : "hidden"
          } items-center`}
        >
          <p className="text-xl w-full text-center">Player</p>
          <div className="flex w-full items-center gap-2">
            <button
              onClick={() => setArcViewer(!arcViewer)}
              type="button"
              className={`bg-black text-white border-2 w-full border-white rounded-md p-2`}
            >
              {arcViewer ? "ArcViewer" : "BeatLeader"}
            </button>
            <Tooltip title="Use the new ArcViewer Player or the old BeatLeader Player. Default value is ArcViewer.">
              <button type="button">
                <BsFillQuestionCircleFill size={25} />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="flex gap-2 flex-col w-1/5">
          <button
            onClick={handleAddPlayer}
            type="button"
            className="bg-black text-white border-2 border-white rounded-md p-2"
          >
            Add player
          </button>
          {players.map((player, index) => {
            return (
              <div key={index} className="flex gap-2 w-full items-center">
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
              checked={endless}
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-blue-500 checked:bg-blue-500 checked:before:bg-blue-500 hover:before:opacity-10"
              onChange={() => setEndless(!endless)}
            />
          </div>
          <button
            onClick={() => setProMode(!proMode)}
            type="button"
            className="bg-black text-white border-2 border-white rounded-md p-2"
          >
            {proMode ? "Basic Config" : "Pro Config"}
          </button>
          <button
            type="submit"
            className="bg-black text-white border-2 border-white rounded-md p-2"
          >
            Submit
          </button>
        </div>
        <div className={`flex flex-col gap-2 w-1/5 ${proMode ? "" : "hidden"}`}>
          <p className="text-xl w-full text-center">How many scores?</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="scores"
              name="scores"
              className="bg-black text-white border-2 border-white w-full rounded-md p-2"
              defaultValue={scores}
              min={26}
              max={100}
              required
              onChange={(e) => setScores(e.target.value)}
            />
            <Tooltip title="This will be the number of scores fetched from the API for each player starting from the most recent one. With bigger numbers, the game will be more difficult but the loading time will be longer. Default value is 100.">
              <button type="button">
                <BsFillQuestionCircleFill size={25} />
              </button>
            </Tooltip>
          </div>
          <p className="text-xl w-full text-center">How many lives?</p>
          <div className="flex items-center gap-2">
            <input
              type="number"
              id="lives"
              name="lives"
              className={`bg-black text-white border-2 w-full border-white rounded-md p-2 ${
                !endless && "opacity-50"
              }`}
              defaultValue={lives}
              min={1}
              max={10}
              required
              disabled={!endless}
              onChange={(e) => setLives(e.target.value)}
            />
            <Tooltip title="Quantity of lives on endless mode. If endless mode is not selected, this value will be ignored. Default value is 3.">
              <button type="button">
                <BsFillQuestionCircleFill size={25} />
              </button>
            </Tooltip>
          </div>
          <p className="text-xl w-full text-center">Random time mode?</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setRandomTimeMode(!randomTimeMode)}
              type="button"
              disabled={arcViewer}
              className={`bg-black text-white border-2 w-full border-white rounded-md p-2 ${
                randomTimeMode ? "bg-green-900" : ""
              } ${arcViewer && "opacity-50"}`}
            >
              {randomTimeMode ? "On" : "Off"}
            </button>
            <Tooltip title="If this is on, the time to guess the song will be random. Default value is off. For now, this is only available on endless mode. This sometimes can be buggy. Not working on ArcViewer.">
              <button type="button">
                <BsFillQuestionCircleFill size={25} />
              </button>
            </Tooltip>
          </div>
          <p className="text-xl w-full text-center">Hard mode?</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHardMode(!hardMode)}
              type="button"
              className={`bg-black text-white border-2 w-full border-white rounded-md p-2 ${
                hardMode ? "bg-green-900" : ""
              }`}
            >
              {hardMode ? "On" : "Off"}
            </button>
            <Tooltip title="If this is on, the game will be harder hiding the song name and the artist name. Default value is off.">
              <button type="button">
                <BsFillQuestionCircleFill size={25} />
              </button>
            </Tooltip>
          </div>
        </div>
      </form>
    </div>
  );
}
