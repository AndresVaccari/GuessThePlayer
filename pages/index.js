import { useState } from "react";
import MainPage from "@/components/MainPage";
import ReplayPage from "@/components/ReplayPage";
import LoadingComponent from "@/components/LoadingComponent";
import Head from "next/head";

export default function Home() {
  const [players, setPlayers] = useState([""]);

  const [playing, setPlaying] = useState(false);
  const [playerOrder, setPlayerOrder] = useState([]);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorId, setErrorId] = useState(null);

  const handleAddPlayer = () => {
    setPlayers([...players, ""]);
  };

  const handleRemovePlayer = (index) => {
    if (players.length === 1) return;
    const newPlayers = [...players];
    newPlayers.splice(index, 1);
    setPlayers(newPlayers);
  };

  const handleChange = (index, player) => {
    const newPlayers = [...players];
    newPlayers[index] = player;
    setPlayers(newPlayers);
  };

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setErrorId(null);

    let SongList = [];
    let playersOrder = [];
    let playersSongs = [];

    const quantity = e.target.quantity.value;

    //fetch all players songs an save in playerScores
    for (const [index, player] of players.entries()) {
      try {
        const res = await fetch(
          `https://web-production-55ce.up.railway.app/https://api.beatleader.xyz/player/${player.id}/scores?count=200`
        );
        const data = await res.json();
        playersSongs.push({
          id: player.id,
          songs: data.data,
        });
      } catch (error) {
        setErrorId(index);
        setLoading(false);
        return;
      }
    }

    for (let i = 0; i < quantity; i++) {
      const randomPlayer =
        playersSongs[Math.floor(Math.random() * players.length)];

      console.log("randomPlayer", randomPlayer);

      const randomSong =
        randomPlayer.songs[
          Math.floor(Math.random() * randomPlayer.songs.length)
        ];

      console.log(randomSong);

      SongList.push(randomSong);
      playersOrder.push(randomPlayer.id);
    }

    setSongs(SongList);
    setPlayerOrder(playersOrder);

    setPlaying(true);
    setLoading(false);
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
      {!playing ? (
        <MainPage
          handleAddPlayer={handleAddPlayer}
          handleChange={handleChange}
          handleRemovePlayer={handleRemovePlayer}
          handleSubmit={handleSubmit}
          players={players}
          loading={loading}
          errorId={errorId}
        />
      ) : (
        <ReplayPage
          songs={songs}
          playerOrder={playerOrder}
          players={players}
          setPlaying={setPlaying}
        />
      )}
      {loading && <LoadingComponent />}
    </main>
  );
}
