// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

export const PROXY = "https://c260-186-13-96-175.ngrok-free.app";
