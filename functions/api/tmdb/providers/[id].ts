interface Env {
  TMDB_READ_TOKEN?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
  params: { id?: string | string[] };
  waitUntil(promise: Promise<unknown>): void;
}

interface TmdbProvider {
  display_priority?: number;
  logo_path?: string;
  provider_id?: number;
  provider_name?: string;
}

interface TmdbRegion {
  flatrate?: TmdbProvider[];
  link?: string;
}

interface TmdbResponse {
  results?: { GB?: TmdbRegion };
}

interface TmdbNetwork {
  id?: number;
  logo_path?: string | null;
  name?: string;
}

interface TmdbDetails {
  networks?: TmdbNetwork[];
}

declare const caches: {
  default: {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
  };
};

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";
const RESELLER_CHANNEL = /\b(?:amazon|apple tv|roku premium)\s+channel\b/i;

function serviceKey(name: string) {
  const value = name.toLowerCase();
  if (value.includes("netflix")) return "netflix";
  if (value.includes("amazon prime")) return "prime-video";
  if (value.includes("disney")) return "disney-plus";
  if (value.includes("apple tv plus")) return "apple-tv-plus";
  if (value.includes("paramount")) return "paramount-plus";
  if (value.includes("bbc iplayer")) return "bbc-iplayer";
  if (value.includes("itvx")) return "itvx";
  if (value.includes("channel 4")) return "channel-4";
  if (/\bnow\b/.test(value)) return "now";
  if (value.includes("sky")) return "sky";
  if (value.includes("discovery")) return "discovery-plus";
  if (value.includes("britbox")) return "britbox";
  if (value.includes("hbo max")) return "hbo-max";
  if (value.includes("mubi")) return "mubi";
  return value
    .replace(/\b(?:standard\s+)?with ads\b/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function json(body: unknown, status = 200, cacheControl = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Cache-Control": cacheControl,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

export const onRequestGet = async (context: PagesContext) => {
  const id = Array.isArray(context.params.id)
    ? context.params.id[0]
    : context.params.id;

  if (!id || !/^\d+$/.test(id)) {
    return json({ error: "Invalid TV series ID." }, 400);
  }

  if (!context.env.TMDB_READ_TOKEN) {
    return json({ error: "Provider lookup is not configured." }, 503);
  }

  const requestUrl = new URL(context.request.url);
  const seasonValue = requestUrl.searchParams.get("season");
  if (seasonValue !== null && !/^\d{1,3}$/.test(seasonValue)) {
    return json({ error: "Invalid season number." }, 400);
  }
  const season = seasonValue === null ? null : Number(seasonValue);
  const cacheKey = new Request(
    new URL(
      `/api/tmdb/providers/${id}?filter=season-v4&season=${season ?? "series"}`,
      requestUrl.origin,
    ),
  );
  const cached = await caches.default.match(cacheKey);
  if (cached) return cached;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${context.env.TMDB_READ_TOKEN}`,
  };
  const providerPath =
    season === null
      ? `https://api.themoviedb.org/3/tv/${id}/watch/providers`
      : `https://api.themoviedb.org/3/tv/${id}/season/${season}/watch/providers`;
  const [upstream, detailsResult] = await Promise.all([
    fetch(providerPath, { headers }),
    fetch(`https://api.themoviedb.org/3/tv/${id}?language=en-GB`, {
      headers: {
        ...headers,
      },
    }),
  ]);

  if (!upstream.ok) {
    return json(
      { error: "Provider lookup is temporarily unavailable." },
      upstream.status === 404 ? 404 : 502,
    );
  }

  const payload = (await upstream.json()) as TmdbResponse;
  const details = detailsResult.ok
    ? ((await detailsResult.json()) as TmdbDetails)
    : null;
  const uk = payload.results?.GB;
  // TMDB's flatrate group represents subscription streaming. Rental and
  // purchase offers are deliberately excluded from the app.
  const candidates = [...(uk?.flatrate ?? [])].sort(
    (left, right) =>
      (left.display_priority ?? Number.MAX_SAFE_INTEGER) -
      (right.display_priority ?? Number.MAX_SAFE_INTEGER),
  );

  const seen = new Set<string>();
  const providers = candidates.flatMap((provider) => {
    const providerId = provider.provider_id;
    const key = provider.provider_name
      ? serviceKey(provider.provider_name)
      : "";
    if (
      typeof providerId !== "number" ||
      !key ||
      seen.has(key) ||
      !provider.provider_name ||
      !provider.logo_path ||
      RESELLER_CHANNEL.test(provider.provider_name)
    ) {
      return [];
    }

    seen.add(key);
    return [
      {
        id: providerId,
        name: provider.provider_name,
        logoPath: provider.logo_path,
        serviceKey: key,
      },
    ];
  });
  const network = details?.networks?.find(
    (item) => typeof item.id === "number" && item.name,
  );

  const response = json(
    {
      link: uk?.link ?? null,
      providers,
      originalNetwork: network
        ? {
            id: network.id,
            name: network.name,
            logoPath: network.logo_path ?? null,
          }
        : null,
      season,
    },
    200,
    CACHE_CONTROL,
  );
  context.waitUntil(caches.default.put(cacheKey, response.clone()));
  return response;
};
