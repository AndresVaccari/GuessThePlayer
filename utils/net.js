import axios from "axios";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(
  url,
  { retries = 4, baseDelay = 500 } = {}
) {
  let attempt = 0;
  // backoff exponencial con jitter y respeto de Retry-After
  while (true) {
    try {
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      const status = err?.response?.status;
      const headers = err?.response?.headers || {};
      attempt++;

      if (
        (status === 429 || (status >= 500 && status < 600)) &&
        attempt <= retries
      ) {
        const retryAfterHeader = headers["retry-after"];
        const retryAfterMs = retryAfterHeader
          ? Number(retryAfterHeader) * 1000
          : Math.min(8000, baseDelay * 2 ** (attempt - 1)) +
            Math.floor(Math.random() * 200);
        await sleep(retryAfterMs);
        continue;
      }

      throw err;
    }
  }
}

// Concurrencia limitada simple
export function limitConcurrency(items, limit, worker) {
  const results = new Array(items.length);
  let i = 0;

  const runNext = () => {
    if (i >= items.length) return Promise.resolve();
    const idx = i++;
    const p = worker(items[idx], idx)
      .then((val) => {
        results[idx] = val;
      })
      .catch((e) => {
        results[idx] = undefined; /* opcional: guarda error por idx */
      });
    return p.then(runNext);
  };

  const starters = Array.from(
    { length: Math.min(limit, items.length) },
    runNext
  );
  return Promise.all(starters).then(() => results);
}
