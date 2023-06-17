import Image from "next/image";
import React, { useState } from "react";

export default function ReplayPage({
  songs,
  playerOrder,
  players,
  setPlaying,
}) {
  const [reveal, setReveal] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [score, setScore] = useState(0);

  const handleNextSong = () => {
    setIndex(index + 1);
    setReveal(false);
  };

  const handleReveal = (player) => {
    setReveal(true);
    setSelectedPlayer(player);
    if (playerOrder[index] === player.id) {
      setScore(score + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-ful items-center">
        <div className="flex flex-col absolute h-1/4">
          <div className="flex flex-row w-full items-center justify-center gap-4">
            <p className="text-2xl text-white">Score: {score}</p>
            <p className="text-2xl text-white">
              {index + 1}/{songs.length}
            </p>
          </div>
          <div className="flex flex-row w-full items-center justify-center mb-2 gap-4 h-3/4">
            {players.map((player) => (
              <div
                key={player.id}
                className={`rounded-full cursor-pointer ${
                  reveal & (playerOrder[index] === player.id) &&
                  "border-2 border-green-500"
                }
                ${
                  reveal &
                    (player === selectedPlayer &&
                      selectedPlayer.id != playerOrder[index]) &&
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
            {reveal &&
              (index < songs.length - 1 ? (
                <button
                  onClick={handleNextSong}
                  className="bg-black text-white border-2 border-white rounded-md p-2"
                >
                  Next song
                </button>
              ) : (
                <button
                  onClick={() => setPlaying(false)}
                  className="bg-black text-white border-2 border-white rounded-md p-2"
                >
                  Go Back
                </button>
              ))}
          </div>
        </div>
      </div>
      <iframe
        src={`https://replay.beatleader.xyz/?scoreId=${songs[index].id}`}
        referrerPolicy="no-referrer"
        className="w-full h-full opacity-100"
      />
      <div
        className={`w-1/3 h-1/4 absolute bottom-0 left-0 ${
          reveal ? "hidden" : ""
        }`}
      >
        <Image src="/cover.png" alt="cover" fill />
      </div>
    </>
  );
}

//
