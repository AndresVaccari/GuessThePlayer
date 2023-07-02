import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";

export default function EndlessReplayPage({ songs, setPlaying, setEndless }) {
  const [lives, setLives] = useState(3);
  const [reveal, setReveal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [score, setScore] = useState(0);
  const [playedSongs, setPlayedSongs] = useState([]);
  const [correctPlayer, setCorrectPlayer] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);

  useEffect(() => {
    if (playedSongs.length === 0) {
      const player = songs[Math.floor(Math.random() * songs.length)];
      console.log("player", player);
      setCorrectPlayer(player);
      console.log(
        "song",
        player.songs[Math.floor(Math.random() * player.songs.length)]
      );
      setPlayingSong(
        player.songs[Math.floor(Math.random() * player.songs.length)]
      );
    }
  }, [songs, playedSongs]);

  const handleReveal = (player) => {
    if (reveal) return;
    setReveal(true);
    setSelectedPlayer(player);
    if (player.id === correctPlayer.id) {
      setScore(score + 1);
      setPlayedSongs([...playedSongs, playingSong]);
    } else {
      setLives(lives - 1);
      setPlayedSongs([...playedSongs, playingSong]);
    }
  };

  const handleNextSong = () => {
    setReveal(false);
    const player = songs[Math.floor(Math.random() * songs.length)];
    setCorrectPlayer(player);
    // Repeat song if it has already been played
    let song = player.songs[Math.floor(Math.random() * player.songs.length)];
    while (playedSongs.includes(song)) {
      song = player.songs[Math.floor(Math.random() * player.songs.length)];
    }
    setPlayingSong(song);
  };

  if (!correctPlayer) return null;

  return (
    <>
      <div className="flex flex-col w-full h-ful items-center">
        <div className="flex flex-col absolute h-1/4">
          <div className="flex flex-row w-full items-center justify-center gap-4">
            <p className="text-2xl text-white">Score: {score}</p>
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
                  reveal & (correctPlayer.id === player.id) &&
                  "border-2 border-green-500"
                }
                ${
                  reveal &
                    (player === selectedPlayer &&
                      selectedPlayer.id != correctPlayer.id) &&
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
        src={`https://replay.beatleader.xyz/?scoreId=${playingSong.id}`}
        referrerPolicy="no-referrer"
        className="w-full h-full opacity-100"
      />
      <div
        className={`flex justify-center items-center w-1/4 h-1/4 absolute bottom-0 left-0 bg-white rounded-full blur-sm ${
          reveal ? "hidden" : ""
        }`}
      >
        <p className="text-8xl text-black font-bold mb-5 cursor-default">
          ? ? ? ?
        </p>
      </div>
    </>
  );
}

//
