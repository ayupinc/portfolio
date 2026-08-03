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

declare const caches: {
  default: {
    match(request: Request): Promise<Response | undefined>;
    put(request: Request, response: Response): Promise<void>;
  };
};

const CACHE_CONTROL =
  "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400";

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
  const cacheKey = new Request(
    new URL(`/api/tmdb/providers/${id}?filter=subscription-v2`, requestUrl.origin),
  );
  const cached = await caches.default.match(cacheKey);
  if (cached) return cached;

  const upstream = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/watch/providers`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${context.env.TMDB_READ_TOKEN}`,
      },
    },
  );

  if (!upstream.ok) {
    return json(
      { error: "Provider lookup is temporarily unavailable." },
      upstream.status === 404 ? 404 : 502,
    );
  }

  const payload = (await upstream.json()) as TmdbResponse;
  const uk = payload.results?.GB;
  // TMDB's flatrate group represents subscription streaming. Rental and
  // purchase offers are deliberately excluded from the app.
  const candidates = [...(uk?.flatrate ?? [])].sort(
    (left, right) =>
      (left.display_priority ?? Number.MAX_SAFE_INTEGER) -
      (right.display_priority ?? Number.MAX_SAFE_INTEGER),
  );

  const seen = new Set<number>();
  const providers = candidates.flatMap((provider) => {
    const providerId = provider.provider_id;
    if (
      typeof providerId !== "number" ||
      seen.has(providerId) ||
      !provider.provider_name ||
      !provider.logo_path
    ) {
      return [];
    }

    seen.add(providerId);
    return [
      {
        id: providerId,
        name: provider.provider_name,
        logoPath: provider.logo_path,
      },
    ];
  });

  const response = json(
    {
      link: uk?.link ?? null,
      providers: providers.slice(0, 4),
    },
    200,
    CACHE_CONTROL,
  );
  context.waitUntil(caches.default.put(cacheKey, response.clone()));
  return response;
};
