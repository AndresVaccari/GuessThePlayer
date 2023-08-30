import Image from "next/image";
import { AiFillHeart } from "react-icons/ai";

export default function BeatLeader({
  props,
  songs,
  lives,
  setLives,
  randomTimeMode,
  hardMode,
  setPlaying,
  setEndless,
  handleReveal,
  handleNextSong,
}) {
  return (
    <>
      <div className="flex flex-col w-full h-ful items-center">
        <div className="flex flex-col absolute h-1/4">
          <div className="flex flex-row w-full items-center justify-center gap-4">
            <p className="text-2xl text-white">Score: {props.score}</p>
            <p className="flex gap-1 items-center justify-center mt-1">
              {[...Array(lives)].map((e, i) => (
                <AiFillHeart key={i} className="text-red-500" size={25} />
              ))}
            </p>
          </div>
          <div className="flex flex-row w-full items-center justify-center mb-2 gap-4 h-3/4">
            {songs.map((player) => (
              <div
                key={player.id}
                className={`rounded-full cursor-pointer ${
                  props.reveal & (props.correctPlayer.id === player.id) &&
                  "border-2 border-green-500"
                }
                ${
                  props.reveal &
                    (player === props.selectedPlayer &&
                      props.selectedPlayer.id != props.correctPlayer.id) &&
                  "border-2 border-red-500"
                }
                `}
                onClick={() => handleReveal(player)}
              >
                <Image
                  src={player.avatar}
                  alt="avatar"
                  height={128}
                  width={128}
                  className="rounded-full"
                />
              </div>
            ))}
          </div>
          <div className="w-full flex items-center justify-center">
            {props.reveal &&
              (lives > 0 ? (
                <button
                  onClick={handleNextSong}
                  className="bg-black text-white border-2 border-white rounded-md p-2"
                >
                  Next song
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLives(3);
                    setEndless(false);
                    setPlaying(false);
                  }}
                  className="bg-black text-white border-2 border-white rounded-md p-2"
                >
                  Go Back
                </button>
              ))}
          </div>
        </div>
      </div>
      <iframe
        src={`https://replay.beatleader.xyz/?scoreId=${props.playingSong.id}${
          randomTimeMode ? `&time=${props.randomTime}` : ""
        }`}
        referrerPolicy="no-referrer"
        className="w-full h-full opacity-100"
      />
      <div
        className={`flex justify-center items-center w-1/4 h-1/4 absolute bottom-0 left-0 bg-white rounded-full ${
          props.reveal ? "hidden" : ""
        }`}
      >
        <p className="text-8xl text-black font-bold mb-5 cursor-default">
          ? ? ? ?
        </p>
      </div>
      <div
        className={`flex justify-center items-center w-1/3 h-16 absolute bottom-0 bg-white rounded-full ${
          randomTimeMode && !props.reveal ? "" : "hidden"
        }`}
      >
        <p className="text-3xl text-black font-bold mb-5 cursor-default">
          ? ? ? ?
        </p>
      </div>
      <div
        className={`flex justify-center items-center w-1/4 h-1/6 absolute top-0 left-0 bg-white rounded-full ${
          hardMode && !props.reveal ? "" : "hidden"
        }`}
      >
        <p className="text-8xl text-black font-bold mb-5 cursor-default">
          ? ? ? ?
        </p>
      </div>
    </>
  );
}
