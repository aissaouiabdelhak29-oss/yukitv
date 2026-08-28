import type { Episode, Genre, Media, Server } from '../types';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const POSTERS_URL = `${SUPABASE_URL}/storage/v1/object/public/posters`;

type DbContent = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  type: 'movie' | 'series';

  category_id: number | null;
  genre_id: number | null;

  poster: string | null;
  backdrop: string | null;
  trailer: string | null;

  rating: string | number | null;
  year: number | null;
  duration: number | null;
  quality: string | null;
  views: number | null;
  status: string | null;
  featured: number | boolean | null;

  created_at?: string;
};

type DbGenre = {
  id: number;
  name: string;
  slug: string;
};

type DbCategory = {
  id: number;
  name: string;
  slug: string;
};

const genreArabic: Record<string, string> = {
  action: 'أكشن',
  drama: 'دراما',
  comedy: 'كوميديا',
  horror: 'رعب',
  romance: 'رومانسي',
  'sci-fi': 'خيال علمي',
  fantasy: 'فانتازيا',
  thriller: 'إثارة',
  animation: 'رسوم متحركة',
  adventure: 'مغامرات',
  crime: 'جريمة',
  mystery: 'غموض',
  shonen: 'شونن',
  isekai: 'إيسيكاي',
  mecha: 'ميكا'
};

/* =========================================================
   FALLBACK IMAGES
========================================================= */

const fallbackPoster = (id: number) =>
  `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&sig=${id}`;

const fallbackBackdrop = (id: number) =>
  `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop&sig=${id}`;


/* =========================================================
   IMAGE URL
========================================================= */

function imageUrl(
  value: string | null | undefined,
  fallback: string
): string {

  if (!value) {
    return fallback;
  }

  let image = String(value).trim();

  if (!image) {
    return fallback;
  }

  /*
   * الصور الافتراضية القديمة
   */
  const lower = image.toLowerCase();

  if (
    lower === 'default-poster.jpg' ||
    lower === 'default-backdrop.jpg' ||
    lower === 'default.jpg'
  ) {
    return fallback;
  }

  /*
   * إذا كانت الصورة بالفعل رابط HTTP/HTTPS
   */
  if (/^https?:\/\//i.test(image)) {

    /*
     * لو الرابط القديم من kyou.online
     * نستخرج اسم الملف ونحوّله إلى Supabase Storage.
     */

    if (
      image.includes('kyou.online/uploads/posters/') ||
      image.includes('/uploads/posters/')
    ) {
      const filename = image
        .split('?')[0]
        .split('/')
        .pop();

      if (filename) {
        return `${POSTERS_URL}/${encodeURIComponent(filename)}`;
      }
    }

    /*
     * أي رابط خارجي صحيح نتركه كما هو
     */
    return image;
  }

  /*
   * تنظيف المسار
   */
  image = image
    .replace(/^\/+/, '')
    .replace(/\\/g, '/');

  /*
   * إذا كانت قاعدة البيانات تحتوي:
   *
   * posters/6a18cad3173d1.jpg
   *
   * نحذف posters/
   */
  if (image.toLowerCase().startsWith('posters/')) {
    image = image.substring('posters/'.length);
  }

  /*
   * إذا كانت تحتوي:
   *
   * uploads/posters/6a18cad3173d1.jpg
   */
  const uploadsPosterIndex = image
    .toLowerCase()
    .indexOf('uploads/posters/');

  if (uploadsPosterIndex !== -1) {
    image = image.substring(
      uploadsPosterIndex + 'uploads/posters/'.length
    );
  }

  /*
   * إذا كانت تحتوي فقط على اسم الملف:
   *
   * 6a18cad3173d1.jpg
   *
   * هذا هو الشكل المطلوب.
   */

  if (!image) {
    return fallback;
  }

  /*
   * التعامل مع المسارات التي فيها مجلدات
   *
   * نعمل encode لكل جزء ونترك /
   */
  const encodedPath = image
    .split('/')
    .filter(Boolean)
    .map(part => encodeURIComponent(part))
    .join('/');

  return `${POSTERS_URL}/${encodedPath}`;
}


/* =========================================================
   SUPABASE REST
========================================================= */

async function rest<T>(
  table: string,
  query: string
): Promise<T> {

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error(
      'Supabase environment variables are missing.'
    );
  }

  const url =
    `${SUPABASE_URL}/rest/v1/${table}?${query}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
    const text = await res.text();

    throw new Error(
      `Supabase ${table}: ${res.status} ${text}`
    );
  }

  return res.json() as Promise<T>;
}


/* =========================================================
   MAP MEDIA
========================================================= */

function mapMedia(
  row: DbContent,
  genres: Map<number, DbGenre>,
  categories: Map<number, DbCategory>
): Media {

  const category =
    row.category_id != null
      ? categories.get(row.category_id)
      : undefined;

  const dbGenre =
    row.genre_id != null
      ? genres.get(row.genre_id)
      : undefined;

  const categoryName =
    category?.name || '';

  const categorySlug =
    category?.slug || '';

  const isAnime =
    categorySlug.toLowerCase() === 'anime' ||
    categoryName.includes('أنمي') ||
    categoryName.toLowerCase() === 'anime';

  const type = isAnime
    ? 'anime'
    : row.type;

  const genre: Genre[] =
    dbGenre
      ? [
          {
            id: dbGenre.id,
            name: dbGenre.name,
            nameAr:
              genreArabic[dbGenre.slug] ||
              dbGenre.name
          }
        ]
      : [];

  /*
   * الصورة النهائية
   */
  const poster = imageUrl(
    row.poster,
    fallbackPoster(row.id)
  );

  const backdrop = imageUrl(
    row.backdrop,
    fallbackBackdrop(row.id)
  );

  return {
    id: row.id,

    type,

    title: row.title,
    titleAr: row.title,
    originalTitle: row.title,

    description:
      row.description ||
      'لا يوجد وصف متاح لهذا المحتوى.',

    poster,
    backdrop,

    year: row.year || 0,

    rating:
      Number(row.rating || 0),

    ratingCount: 0,

    views:
      Number(row.views || 0),

    genres,

    duration:
      row.duration || undefined,

    quality:
      (
        row.quality === '4K'
          ? '4K'
          : row.quality === '1080p'
            ? '1080p'
            : row.quality === '720p'
              ? '720p'
              : '1080p'
      ) as any,

    language: undefined,

    trailer:
      row.trailer ||
      undefined,

    featured:
      Boolean(
        Number(row.featured || 0)
      ),

    trending:
      Number(row.views || 0) > 100,

    status:
      row.status === 'pending'
        ? 'upcoming'
        : row.status === 'published'
          ? 'completed'
          : undefined
  };
}


/* =========================================================
   CACHE
========================================================= */

let mediaCache: Media[] | null = null;
let genresCache: Genre[] | null = null;


/* =========================================================
   GET CATALOG
========================================================= */

export async function getCatalog(
  force = false
): Promise<{
  media: Media[];
  genres: Genre[];
}> {

  if (
    !force &&
    mediaCache &&
    genresCache
  ) {
    return {
      media: mediaCache,
      genres: genresCache
    };
  }

  const [
    content,
    dbGenres,
    dbCategories
  ] = await Promise.all([

    rest<DbContent[]>(
      'content',
      'select=*&status=eq.published&order=created_at.desc'
    ),

    rest<DbGenre[]>(
      'genres',
      'select=*&order=id.asc'
    ),

    rest<DbCategory[]>(
      'categories',
      'select=*&order=id.asc'
    )
  ]);

  const genreMap =
    new Map(
      dbGenres.map(
        g => [g.id, g]
      )
    );

  const categoryMap =
    new Map(
      dbCategories.map(
        c => [c.id, c]
      )
    );

  mediaCache =
    content.map(
      row =>
        mapMedia(
          row,
          genreMap,
          categoryMap
        )
    );

  genresCache =
    dbGenres.map(g => ({
      id: g.id,
      name: g.name,
      nameAr:
        genreArabic[g.slug] ||
        g.name
    }));

  return {
    media: mediaCache,
    genres: genresCache
  };
}


/* =========================================================
   GET MEDIA DETAILS
========================================================= */

export async function getMediaDetails(
  media: Media
): Promise<Media> {

  const [
    servers,
    episodes
  ] = await Promise.all([

    rest<any[]>(
      'video_servers',
      `select=*&content_id=eq.${media.id}&order=is_default.desc,id.asc`
    ),

    media.type === 'movie'
      ? Promise.resolve([])
      : rest<any[]>(
          'episodes',
          `select=*&series_id=eq.${media.id}&order=season.asc,episode_number.asc`
        )
  ]);

  const episodeServers =
    await Promise.all(
      episodes.map(ep =>
        rest<any[]>(
          'episode_servers',
          `select=*&episode_id=eq.${ep.id}&order=is_default.desc,id.asc`
        )
      )
    );

  const toServer = (
    s: any
  ): Server => ({
    id: String(s.id),
    name: s.server_name,
    url: s.embed_url,
    quality:
      (s.quality || '1080p') as any
  });

  const grouped =
    new Map<number, Episode[]>();

  episodes.forEach(
    (ep, i) => {

      const season =
        ep.season || 1;

      const thumbnail =
        imageUrl(
          ep.poster,
          media.backdrop
        );

      const item: Episode = {

        id: ep.id,

        number:
          ep.episode_number,

        title:
          ep.title,

        titleAr:
          ep.title,

        description:
          ep.description ||
          undefined,

        thumbnail,

        duration:
          ep.duration || 0,

        servers:
          episodeServers[i]
            .map(toServer)
      };

      grouped.set(
        season,
        [
          ...(grouped.get(season) || []),
          item
        ]
      );
    }
  );

  return {

    ...media,

    servers:
      servers.map(toServer),

    seasons:
      [...grouped.entries()]
        .map(
          ([number, eps]) => ({

            id: number,

            number,

            title:
              `الموسم ${number}`,

            titleAr:
              `الموسم ${number}`,

            episodes:
              eps
          })
        )
  };
}


/* =========================================================
   SEARCH
========================================================= */

export async function searchCatalog(
  query: string,
  type: string = 'all'
): Promise<Media[]> {

  const {
    media
  } = await getCatalog();

  const q =
    query
      .trim()
      .toLowerCase();

  if (!q) {
    return media.filter(
      m =>
        type === 'all' ||
        m.type === type
    );
  }

  return media.filter(
    m =>

      (
        type === 'all' ||
        m.type === type
      )

      &&

      (
        m.title
          .toLowerCase()
          .includes(q)

        ||

        (m.description || '')
          .toLowerCase()
          .includes(q)

        ||

        m.genres.some(
          g =>
            g.name
              .toLowerCase()
              .includes(q)

            ||

            g.nameAr
              .toLowerCase()
              .includes(
                query.trim().toLowerCase()
              )
        )
      )
  );
}
