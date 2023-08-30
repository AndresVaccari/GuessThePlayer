import Image from "next/image";
import React, { useEffect, useState } from "react";
import { AiFillHeart } from "react-icons/ai";
import ArcViewer from "./ArcViewer";
import BeatLeader from "./BeatLeader";

export default function EndlessReplayPage({
  songs,
  setPlaying,
  setEndless,
  lives,
  setLives,
  randomTimeMode,
  hardMode,
  arcViewer,
}) {
  const [props, setProps] = useState({
    reveal: false,
    selectedPlayer: null,
    score: 0,
    playedSongs: [],
    correctPlayer: null,
    playingSong: null,
    randomTime: null,
  });

  const updateProps = (newProps) => {
    setProps((prevProps) => ({ ...prevProps, ...newProps }));
  };

  useEffect(() => {
    if (props.playingSong === null) {
      const player = songs[Math.floor(Math.random() * songs.length)];
      const song =
        player.songs[Math.floor(Math.random() * player.songs.length)];
      let randomTime = null;
      if (randomTimeMode) {
        randomTime =
          Math.floor(Math.random() * song.leaderboard.song.duration) * 1000;
      }
      setProps({
        ...props,
        correctPlayer: player,
        playingSong: song,
        randomTime: randomTime,
      });
    }
  }, []);

  const handleReveal = (player) => {
    if (props.reveal) return;
    updateProps({
      reveal: true,
      selectedPlayer: player,
      score:
        player.id === props.correctPlayer.id ? props.score + 1 : props.score,
      playedSongs: [...props.playedSongs, props.playingSong],
    });
    if (player.id != props.correctPlayer.id) {
      setLives(lives - 1);
    }
  };

  const handleNextSong = () => {
    updateProps({ reveal: false, selectedPlayer: null });
    const player = songs[Math.floor(Math.random() * songs.length)];
    // Repeat song if it has already been played
    let song = player.songs[Math.floor(Math.random() * player.songs.length)];
    while (props.playedSongs.includes(song)) {
      song = player.songs[Math.floor(Math.random() * player.songs.length)];
    }
    let randomTime = null;
    if (randomTimeMode) {
      randomTime =
        Math.floor(Math.random() * song.leaderboard.song.duration) * 1000;
    }
    updateProps({
      correctPlayer: player,
      playingSong: song,
      randomTime: randomTime,
    });
  };

  if (!props.correctPlayer) return null;

  return (
    <>
      {arcViewer ? (
        <ArcViewer
          props={props}
          songs={songs}
          lives={lives}
          setLives={setLives}
          randomTimeMode={randomTimeMode}
          hardMode={hardMode}
          setPlaying={setPlaying}
          setEndless={setEndless}
          handleReveal={handleReveal}
          handleNextSong={handleNextSong}
        />
      ) : (
        <BeatLeader
          props={props}
          songs={songs}
          lives={lives}
          setLives={setLives}
          randomTimeMode={randomTimeMode}
          hardMode={hardMode}
          setPlaying={setPlaying}
          setEndless={setEndless}
          handleReveal={handleReveal}
          handleNextSong={handleNextSong}
        />
      )}
    </>
  );
}

//
