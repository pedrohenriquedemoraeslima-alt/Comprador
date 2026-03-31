import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { material, local } = req.body;

    const query = `${material} em ${local}`;

    const url = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API_KEY}&hl=pt-br`;

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: 'Erro' });
  }
}
