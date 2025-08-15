// pages/api/bl/[...path].js
import axios from "axios";

export default async function handler(req, res) {
  // Construimos la URL destino preservando path + query
  const path = Array.isArray(req.query.path) ? req.query.path.join("/") : "";
  const { path: _omit, ...restQuery } = req.query; // quitamos 'path' del query
  const qs = new URLSearchParams(restQuery).toString();
  const url = `https://api.beatleader.xyz/${path}${qs ? `?${qs}` : ""}`;

  // (Opcional) si alguna vez llamaras a ESTA ruta desde otro origin:
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Max-Age", "86400");
    return res.status(204).end();
  }

  try {
    const upstream = await axios.get(url, {
      // si el endpoint devuelve JSON, default está bien
      // si devolviera binario, usar: responseType: "arraybuffer"
      headers: {
        "User-Agent": "GuessThePlayer/1.0",
        // copia headers si necesitas auth, etc.
      },
      timeout: 15000,
    });

    // Reenvía status y tipo de contenido
    if (upstream.headers["content-type"]) {
      res.setHeader("Content-Type", upstream.headers["content-type"]);
    }
    // Cache opcional (ajústalo a tu gusto)
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");

    return res.status(upstream.status).send(upstream.data);
  } catch (err) {
    const status = err.response?.status ?? 502;
    const data = err.response?.data ?? { error: "Upstream fetch failed" };
    return res.status(status).json(data);
  }
}
