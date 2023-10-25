// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({ name: "John Doe" });
}

export const PROXY = "https://63e7-186-13-96-151.ngrok-free.app";
