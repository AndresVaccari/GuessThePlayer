import { useEffect, useRef, useState } from "react";
import Head from "next/head";

import MainPage from "@/components/MainPage";
import ReplayPage from "@/components/ReplayPage";
import LoadingComponent from "@/components/LoadingComponent";
import EndlessReplayPage from "@/components/EndlessReplayPage";
import { fetchWithRetry, limitConcurrency } from "@/utils/net";

// ---- Persistencia simple en localStorage ----
const PERSIST_KEY = "gtp:prefs:v1";

function loadPrefs() {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(PERSIST_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("loadPrefs error", e);
    return null;
  }
}

function savePrefs(data) {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem(PERSIST_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("savePrefs error", e);
  }
}
// --------------------------------------------

export default function Home() {
  const [mainProps, setMainProps] = useState({
    // players puede ser array de strings o de objetos { id, name, avatar }
    players: [""],
    loading: false,
    errorId: null,
    scores: 100,
    endless: false,
    randomTimeMode: false,
    playing: false,
    playerOrder: [],
    songs: [],
    endlessSongs: [],
    hardMode: false,
    arcViewer: true,
  });

  const [lives, setLives] = useState(3);

  // Para evitar guardar durante la primera hidratación
  const didHydrate = useRef(false);

  // Al montar: cargar prefs guardadas y mergear
  useEffect(() => {
    const saved = loadPrefs();
    if (saved) {
      setMainProps((prev) => ({
        ...prev,
        players: saved.players ?? prev.players,
        scores: saved.scores ?? prev.scores,
        endless: saved.endless ?? prev.endless,
        randomTimeMode: saved.randomTimeMode ?? prev.randomTimeMode,
        hardMode: saved.hardMode ?? prev.hardMode,
        arcViewer: saved.arcViewer ?? prev.arcViewer,
      }));
      if (typeof saved.lives === "number") setLives(saved.lives);
    }
    didHydrate.current = true;
  }, []);

  // Helper para actualizar estado y persistir automáticamente
  const updateMainProps = (newProps) => {
    setMainProps((prev) => {
      const next = { ...prev, ...newProps };
      if (didHydrate.current) {
        const persistedSubset = {
          players: next.players?.map((p) => {
            if (typeof p === "string") return p;
            return { id: p?.id, name: p?.name, avatar: p?.avatar };
          }),
          scores: next.scores,
          endless: next.endless,
          randomTimeMode: next.randomTimeMode,
          hardMode: next.hardMode,
          arcViewer: next.arcViewer,
          lives,
          __v: 1,
        };
        savePrefs(persistedSubset);
      }
      return next;
    });
  };

  // Guardar cuando cambien las vidas
  useEffect(() => {
    if (!didHydrate.current) return;
    const raw = loadPrefs() || {};
    savePrefs({ ...raw, lives });
  }, [lives]);

  // ---- handlers de players ----
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
    newPlayers[index] = player; // string u objeto { id, name, avatar }
    updateMainProps({ players: newPlayers });
  };

  // ---- fetching de canciones con rate-limit friendly ----
  async function fetchPlayersSongs() {
    const ITEMS_PER_PAGE = 8; // tu comentario indicaba 8
    const CONCURRENCY = 2; // 2 jugadores en paralelo suele ser seguro
    const totalPages = Math.ceil(mainProps.scores / ITEMS_PER_PAGE);

    const players = (mainProps.players || []).filter(Boolean);

    const perPlayer = async (player) => {
      if (!player) return null;

      const pages = [];
      for (let page = 1; page <= totalPages; page++) {
        const url = `/api/player-scores?id=${player.id}&count=${ITEMS_PER_PAGE}&page=${page}`;
        const data = await fetchWithRetry(url); // { data: [...] } esperado
        const chunk = Array.isArray(data?.data) ? data.data : [];
        if (!chunk.length) break; // si la página viene vacía, cortar
        pages.push(...chunk);

        // pequeña pausa opcional para suavizar rate-limit
        await new Promise((r) => setTimeout(r, 80));
      }

      // de-dupe por id / hash si existen
      const seen = new Set();
      const songs = pages.filter((s) => {
        const key = s?.id || s?.song?.id || s?.song?.hash || JSON.stringify(s);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

      return {
        id: player.id,
        avatar: player.avatar,
        name: player.name,
        songs,
      };
    };

    try {
      const playersSongs = await limitConcurrency(
        players,
        CONCURRENCY,
        perPlayer
      );
      return playersSongs.filter(Boolean);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  // ---- modos de juego ----
  async function normalMode(e) {
    updateMainProps({ loading: true, errorId: null });

    let SongList = [];
    let playersOrder = [];
    let playersSongs = await fetchPlayersSongs();

    const quantity = e.target.quantity.value;

    for (let i = 0; i < quantity; i++) {
      const randomPlayer =
        playersSongs[Math.floor(Math.random() * playersSongs.length)];

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

  // ---- render ----
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
          lives={lives}
          setLives={setLives}
          setEndless={(endless) => updateMainProps({ endless })}
          randomTimeMode={mainProps.randomTimeMode}
          setRandomTimeMode={(randomTimeMode) =>
            updateMainProps({ randomTimeMode })
          }
          hardMode={mainProps.hardMode}
          setHardMode={(hardMode) => updateMainProps({ hardMode })}
          arcViewer={mainProps.arcViewer}
          setArcViewer={(arcViewer) => updateMainProps({ arcViewer })}
        />
      ) : mainProps.endless ? (
        <EndlessReplayPage
          songs={mainProps.endlessSongs}
          setPlaying={(playing) => updateMainProps({ playing })}
          setEndless={(endless) => updateMainProps({ endless })}
          lives={lives}
          setLives={setLives}
          randomTimeMode={mainProps.randomTimeMode}
          hardMode={mainProps.hardMode}
          arcViewer={mainProps.arcViewer}
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
