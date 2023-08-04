import { useState } from "react";
import MainPage from "@/components/MainPage";
import ReplayPage from "@/components/ReplayPage";
import LoadingComponent from "@/components/LoadingComponent";
import Head from "next/head";
import EndlessReplayPage from "@/components/EndlessReplayPage";

export default function Home() {
  const [mainProps, setMainProps] = useState({
    players: [""],
    loading: false,
    errorId: null,
    scores: 200,
    endless: false,
    lives: 3,
    randomTimeMode: false,
    playing: false,
    playerOrder: [],
    songs: [],
    endlessSongs: [],
    hardMode: false,
  });

  const updateMainProps = (newProps) => {
    setMainProps({ ...mainProps, ...newProps });
  };

  const handleAddPlayer = () => {
    updateMainProps({ players: [...mainProps.players, ""] });
  };

  const handleRemovePlayer = (index) => {
    if (mainProps.players.length === 1) return;
    const newPlayers = [...mainProps.players];
    newPlayers.splice(index, 1);
    updateMainProps({ players: newPlayers });
  };

  const handleChange = (index, player) => {
    const newPlayers = [...mainProps.players];
    newPlayers[index] = player;
    updateMainProps({ players: newPlayers });
  };

  async function fetchPlayersSongs() {
    let playersSongs = [];

    for (const [index, player] of mainProps.players.entries()) {
      try {
        const res = await fetch(
          `https://cors-anywhere-andresvaccari.onrender.com/https://api.beatleader.xyz/player/${player.id}/scores?count=${mainProps.scores}`
        );
        const data = await res.json();
        playersSongs.push({
          id: player.id,
          avatar: player.avatar,
          name: player.name,
          songs: data.data,
        });
      } catch (error) {
        setErrorId(index);
        setLoading(false);
        return;
      }
    }

    return playersSongs;
  }

  async function normalMode(e) {
    updateMainProps({ loading: true, errorId: null });

    let SongList = [];
    let playersOrder = [];
    let playersSongs = await fetchPlayersSongs();

    const quantity = e.target.quantity.value;

    for (let i = 0; i < quantity; i++) {
      const randomPlayer =
        playersSongs[Math.floor(Math.random() * mainProps.players.length)];

      const randomSong =
        randomPlayer.songs[
          Math.floor(Math.random() * randomPlayer.songs.length)
        ];

      SongList.push(randomSong);
      playersOrder.push(randomPlayer.id);
    }

    updateMainProps({
      songs: SongList,
      playerOrder: playersOrder,
      playing: true,
      loading: false,
    });
  }

  async function endlessMode() {
    updateMainProps({ endlessSongs: [], loading: true });
    const playersSongs = await fetchPlayersSongs();
    updateMainProps({
      endlessSongs: playersSongs,
      playing: true,
      loading: false,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    updateMainProps({ endless: mainProps.endless });
    mainProps.endless ? endlessMode() : normalMode(e);
  }

  return (
    <main className="flex flex-col justify-center items-center h-screen w-screen">
      <Head>
        <title>Guess the Player</title>
        <meta
          name="description"
          content="A game where you have to guess the player based on their scores"
        />
      </Head>
      {!mainProps.playing ? (
        <MainPage
          handleAddPlayer={handleAddPlayer}
          handleChange={handleChange}
          handleRemovePlayer={handleRemovePlayer}
          handleSubmit={handleSubmit}
          players={mainProps.players}
          loading={mainProps.loading}
          errorId={mainProps.errorId}
          scores={mainProps.scores}
          setScores={(scores) => updateMainProps({ scores })}
          endless={mainProps.endless}
          lives={mainProps.lives}
          setLives={(lives) => updateMainProps({ lives })}
          setEndless={(endless) => updateMainProps({ endless })}
          randomTimeMode={mainProps.randomTimeMode}
          setRandomTimeMode={(randomTimeMode) =>
            updateMainProps({ randomTimeMode })
          }
          hardMode={mainProps.hardMode}
          setHardMode={(hardMode) => updateMainProps({ hardMode })}
        />
      ) : mainProps.endless ? (
        <EndlessReplayPage
          songs={mainProps.endlessSongs}
          setPlaying={(playing) => updateMainProps({ playing })}
          setEndless={(endless) => updateMainProps({ endless })}
          lives={mainProps.lives}
          setLives={(lives) => updateMainProps({ lives })}
          randomTimeMode={mainProps.randomTimeMode}
          hardMode={mainProps.hardMode}
        />
      ) : (
        <ReplayPage
          songs={mainProps.songs}
          playerOrder={mainProps.playerOrder}
          setPlaying={(playing) => updateMainProps({ playing })}
        />
      )}
      {mainProps.loading && <LoadingComponent />}
    </main>
  );
}
