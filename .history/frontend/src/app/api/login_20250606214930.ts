import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  // Forward login request to your Heroku backend
  const apiRes = await fetch('https://elevenfundingapi-f91e4cb9118d.herokuapp.com/api/auth/cookie/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  });

  // Relay Set-Cookie header
  const setCookie = apiRes.headers.get('set-cookie');
  if (setCookie) {
    // Pass the cookie to the browser
    res.setHeader('Set-Cookie', setCookie);
  }

  // Pass the response body back
  const data = await apiRes.json();
  res.status(apiRes.status).json(data);
}