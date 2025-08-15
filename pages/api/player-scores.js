// pages/api/player-scores.js
import axios from "axios";

export default async function handler(req, res) {
  const { id, count } = req.query;

  try {
    const headers = {
      "x-requested-with": "XMLHttpRequest",
      "ngrok-skip-browser-warning": "true",
    };

    const response = await axios.get(
      `https://api.beatleader.xyz/player/${id}/scores?count=${count}`,
      { headers }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      error: "Error fetching data from BeatLeader API",
    });
  }
}
