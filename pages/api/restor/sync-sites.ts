import type { NextApiRequest, NextApiResponse } from 'next';

import { buildRestorPayload } from '../../../src/utils/geometrySanitization';

interface SiteInput {
  id: string;
  name: string | null;
  status: string | null;
  geometry: { type: string; coordinates: unknown };
}

interface RequestBody {
  sites: SiteInput[];
  purpose: string | undefined;
  interventionStartYear: number | '';
}

interface SyncResult {
  siteId: string;
  siteName: string | null;
  success: boolean;
  error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const restorApiUrl = process.env.RESTOR_API;
  const restorApiKey = process.env.RESTOR_API_KEY;

  if (!restorApiKey) return res.status(500).json({ error: 'Restor API key is not configured' });
  if (!restorApiUrl) return res.status(500).json({ error: 'Restor URL is not configured' });

  const { sites, purpose, interventionStartYear } = req.body as RequestBody;

  if (!Array.isArray(sites) || sites.length === 0) {
    return res.status(400).json({ error: 'No sites provided' });
  }

  const results = await Promise.allSettled(
    sites.map(async (site) => {
      const payload = buildRestorPayload(
        { id: site.id, name: site.name, status: site.status },
        site.geometry,
        purpose,
        interventionStartYear
      );
      const response = await fetch(restorApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-API-KEY': restorApiKey },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || `HTTP ${response.status}`);
      }
      return response.json();
    })
  );

  const syncResults: SyncResult[] = results.map((result, i) => ({
    siteId: sites[i].id,
    siteName: sites[i].name,
    success: result.status === 'fulfilled',
    error: result.status === 'rejected'
      ? (result.reason instanceof Error ? result.reason.message : String(result.reason))
      : undefined,
  }));

  return res.status(200).json({ results: syncResults });
}
