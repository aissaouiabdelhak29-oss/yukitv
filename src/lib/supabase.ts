import type { Episode, Genre, Media, Server } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

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
   الصور الافتراضية
========================================================= */

const fallbackPoster = (id: number) =>
  `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop&sig=${id}`;

const fallbackBackdrop = (id: number) =>
  `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop&sig=${id}`;


/* =========================================================
   رابط صور Supabase Storage المباشر
========================================================= */

const IMAGE_BASE_URL =
  'https://euntkhkadunekmlydyes.supabase.co/storage/v1/object/public/posters/';


/* =========================================================
   تحويل أي قيمة poster إلى اسم الملف ثم رابط Supabase
========================================================= */

function imageUrl(
  value: string | null | undefined,
  fallback: string
): string {

  if (!value) {
    return fallback;
  }

  let filename = value.trim();

  if (!filename) {
    return fallback;
  }

<<<<<<< HEAD
=======
  /*
   * إزالة ?query و #hash
   *
   * مثال:
   * image.jpg?abc=123
   * تصبح:
   * image.jpg
   */
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  filename = filename
    .split('?')[0]
    .split('#')[0];

<<<<<<< HEAD
  filename = filename.split('/').pop() || '';
=======
  /*
   * إذا كانت القيمة رابطًا كاملًا أو مسارًا:
   *
   * https://kyou.online/uploads/posters/movie.jpg
   *
   * أو:
   *
   * /uploads/posters/movie.jpg
   *
   * أو:
   *
   * posters/movie.jpg
   *
   * نأخذ آخر جزء فقط:
   *
   * movie.jpg
   */
  filename =
    filename.split('/').pop() || '';

>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  filename = filename.trim();

  if (!filename) {
    return fallback;
  }

<<<<<<< HEAD
=======
  /*
   * الصور الافتراضية
   */
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  if (
    filename === 'default-poster.jpg' ||
    filename === 'default-backdrop.jpg' ||
    filename === 'default.jpg'
  ) {
    return fallback;
  }

<<<<<<< HEAD
  return IMAGE_BASE_URL + encodeURIComponent(filename);
=======
  /*
   * الرابط النهائي دائمًا من Supabase
   */
  return (
    IMAGE_BASE_URL +
    encodeURIComponent(filename)
  );
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
}


/* =========================================================
   Supabase REST API
========================================================= */

async function rest<T>(
  table: string,
  query: string
): Promise<T> {

  if (!SUPABASE_URL || !SUPABASE_KEY) {
<<<<<<< HEAD
    console.error('Supabase env missing:', { url: !!SUPABASE_URL, key: !!SUPABASE_KEY });
    throw new Error('Supabase environment variables are missing.');
  }

  const url = `${SUPABASE_URL}/rest/v1/${table}?${query}`;

  const res = await fetch(url, {
    method: 'GET',
=======
    throw new Error(
      'Supabase environment variables are missing.'
    );
  }

  const url =
    `${SUPABASE_URL}/rest/v1/${table}?${query}`;

  const res = await fetch(url, {
    method: 'GET',

>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Accept: 'application/json'
    }
  });

  if (!res.ok) {
<<<<<<< HEAD
    const text = await res.text();
    console.error(`Supabase ${table} error:`, res.status, text);
    throw new Error(`Supabase ${table}: ${res.status} ${text}`);
=======
    throw new Error(
      `Supabase ${table}: ${res.status} ${await res.text()}`
    );
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  }

  return res.json() as Promise<T>;
}


/* =========================================================
   تحويل بيانات Content إلى Media
========================================================= */

function mapMedia(
  row: DbContent,
  genres: Map<number, DbGenre>,
  categories: Map<number, DbCategory>
): Media {

  const category =
<<<<<<< HEAD
    row.category_id ? categories.get(row.category_id) : undefined;

  const dbGenre =
    row.genre_id ? genres.get(row.genre_id) : undefined;

  const isAnime =
    category?.slug === 'anime' ||
    category?.name?.includes('أنمي') ||
    category?.name?.toLowerCase() === 'anime';

  const type = isAnime ? 'anime' : row.type;

  const genre: Genre[] = dbGenre
    ? [{
        id: dbGenre.id,
        name: dbGenre.name,
        nameAr: genreArabic[dbGenre.slug] || dbGenre.name
      }]
    : [];

  const posterUrl = imageUrl(row.poster, fallbackPoster(row.id));
  // لو backdrop فارغ، استخدم نفس الـ poster كـ fallback
  const backdropUrl = imageUrl(row.backdrop, posterUrl);
=======
    row.category_id
      ? categories.get(row.category_id)
      : undefined;

  const dbGenre =
    row.genre_id
      ? genres.get(row.genre_id)
      : undefined;

  const isAnime =
    category?.slug === 'anime' ||
    category?.name.includes('أنمي') ||
    category?.name.toLowerCase() === 'anime';

  const type =
    isAnime
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
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2

  return {

    id: row.id,

    type,

    title: row.title,

    titleAr: row.title,

    originalTitle: row.title,
<<<<<<< HEAD
    description: row.description || 'لا يوجد وصف متاح لهذا المحتوى.',
    poster: posterUrl,
    backdrop: backdropUrl,
    year: row.year || 0,
    rating: Number(row.rating || 0),
    ratingCount: 0,
    views: Number(row.views || 0),
    genres: genre,
    duration: row.duration || undefined,
    quality: (row.quality === '4K' ? '4K' : row.quality === '1080p' ? '1080p' : row.quality === '720p' ? '720p' : '1080p') as any,
    language: undefined,
    trailer: row.trailer || undefined,
    featured: Boolean(Number(row.featured || 0)),
    trending: Number(row.views || 0) > 100,
    status: row.status === 'pending' ? 'upcoming' : row.status === 'published' ? 'completed' : undefined
  };
}


/* =========================================================
   Cache
========================================================= */

let mediaCache: Media[] | null = null;
let genresCache: Genre[] | null = null;


/* =========================================================
   جلب الكتالوج
========================================================= */

export async function getCatalog(
  force = false
): Promise<{
  media: Media[];
  genres: Genre[];
}> {

  if (!force && mediaCache && genresCache) {
    return { media: mediaCache, genres: genresCache };
  }

  try {
    const [content, dbGenres, dbCategories] = await Promise.all([
      rest<DbContent[]>('content', 'select=*&status=eq.published&order=created_at.desc'),
      rest<DbGenre[]>('genres', 'select=*&order=id.asc'),
      rest<DbCategory[]>('categories', 'select=*&order=id.asc')
    ]);

    const genreMap = new Map(dbGenres.map(g => [g.id, g]));
    const categoryMap = new Map(dbCategories.map(c => [c.id, c]));

    mediaCache = content.map(row => mapMedia(row, genreMap, categoryMap));

    genresCache = dbGenres.map(g => ({
      id: g.id,
      name: g.name,
      nameAr: genreArabic[g.slug] || g.name
    }));

    return { media: mediaCache, genres: genresCache };
  } catch (err) {
    console.error('getCatalog failed:', err);
    throw err;
  }
}


/* =========================================================
   تفاصيل الفيلم أو المسلسل
========================================================= */

export async function getMediaDetails(
  media: Media
): Promise<Media> {

  const [servers, episodes] = await Promise.all([
    rest<any[]>('video_servers', `select=*&content_id=eq.${media.id}&order=is_default.desc,id.asc`),
    media.type === 'movie'
      ? Promise.resolve([])
      : rest<any[]>('episodes', `select=*&series_id=eq.${media.id}&order=season.asc,episode_number.asc`)
  ]);

  const episodeServers = await Promise.all(
    episodes.map(ep =>
      rest<any[]>('episode_servers', `select=*&episode_id=eq.${ep.id}&order=is_default.desc,id.asc`)
    )
  );

  const toServer = (s: any): Server => ({
    id: String(s.id),
    name: s.server_name || 'سيرفر',
    url: s.embed_url || s.url || '',
    quality: (s.quality || '1080p') as any
  });

  const grouped = new Map<number, Episode[]>();

  episodes.forEach((ep, i) => {
    const season = ep.season || 1;
    const item: Episode = {
      id: ep.id,
      number: ep.episode_number,
      title: ep.title || `الحلقة ${ep.episode_number}`,
      titleAr: ep.title || `الحلقة ${ep.episode_number}`,
      description: ep.description || undefined,
      thumbnail: imageUrl(ep.poster, media.backdrop),
      duration: ep.duration || 0,
      servers: episodeServers[i].map(toServer)
    };
    grouped.set(season, [...(grouped.get(season) || []), item]);
  });

  return {
    ...media,
    servers: servers.map(toServer),
    seasons: [...grouped.entries()].map(([number, eps]) => ({
      id: number,
      number,
      title: `الموسم ${number}`,
      titleAr: `الموسم ${number}`,
      episodes: eps
    }))
=======

    description:
      row.description ||
      'لا يوجد وصف متاح لهذا المحتوى.',

    /*
     * poster:
     * أي قيمة موجودة في قاعدة البيانات
     * يتم استخراج اسم الملف منها
     * ثم بناء رابط Supabase.
     */
    poster:
      imageUrl(
        row.poster,
        fallbackPoster(row.id)
      ),

    /*
     * backdrop أيضًا يستخدم نفس Bucket
     */
    backdrop:
      imageUrl(
        row.backdrop,
        fallbackBackdrop(row.id)
      ),

    year:
      row.year || 0,

    rating:
      Number(row.rating || 0),

    ratingCount:
      0,

    views:
      Number(row.views || 0),

    genres:
      genre,

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

    language:
      undefined,

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
   Cache
========================================================= */

let mediaCache:
  Media[] | null = null;

let genresCache:
  Genre[] | null = null;


/* =========================================================
   جلب الكتالوج
========================================================= */

export async function getCatalog(
  force = false
): Promise<{
  media: Media[];
  genres: Genre[];
}> {

  /*
   * استخدام Cache إذا كان موجودًا
   */
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

  /*
   * جلب المحتوى والتصنيفات والأنواع
   */
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

  /*
   * تحويل المحتوى
   */
  mediaCache =
    content.map(
      row =>
        mapMedia(
          row,
          genreMap,
          categoryMap
        )
    );

  /*
   * تحويل الأنواع
   */
  genresCache =
    dbGenres.map(
      g => ({
        id: g.id,

        name: g.name,

        nameAr:
          genreArabic[g.slug] ||
          g.name
      })
    );

  return {
    media: mediaCache,

    genres: genresCache
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  };
}


/* =========================================================
<<<<<<< HEAD
=======
   تفاصيل الفيلم أو المسلسل
========================================================= */

export async function getMediaDetails(
  media: Media
): Promise<Media> {

  const [
    servers,
    episodes
  ] = await Promise.all([

    /*
     * سيرفرات الفيلم
     */
    rest<any[]>(
      'video_servers',
      `select=*&content_id=eq.${media.id}&order=is_default.desc,id.asc`
    ),

    /*
     * حلقات المسلسل
     */
    media.type === 'movie'
      ? Promise.resolve([])

      : rest<any[]>(
          'episodes',
          `select=*&series_id=eq.${media.id}&order=season.asc,episode_number.asc`
        )
  ]);

  /*
   * جلب سيرفرات الحلقات
   */
  const episodeServers =
    await Promise.all(
      episodes.map(
        ep =>
          rest<any[]>(
            'episode_servers',
            `select=*&episode_id=eq.${ep.id}&order=is_default.desc,id.asc`
          )
      )
    );

  /*
   * تحويل السيرفر
   */
  const toServer =
    (s: any): Server => ({
      id:
        String(s.id),

      name:
        s.server_name,

      url:
        s.embed_url,

      quality:
        (s.quality || '1080p') as any
    });

  /*
   * تجميع الحلقات حسب الموسم
   */
  const grouped =
    new Map<number, Episode[]>();

  episodes.forEach(
    (ep, i) => {

      const season =
        ep.season || 1;

      const item: Episode = {

        id:
          ep.id,

        number:
          ep.episode_number,

        title:
          ep.title,

        titleAr:
          ep.title,

        description:
          ep.description ||
          undefined,

        /*
         * صورة الحلقة أيضًا:
         * اسم الملف → Supabase
         */
        thumbnail:
          imageUrl(
            ep.poster,
            media.backdrop
          ),

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

            id:
              number,

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
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
   البحث
========================================================= */

export async function searchCatalog(
  query: string,
  type: string = 'all'
): Promise<Media[]> {

<<<<<<< HEAD
  const { media } = await getCatalog();
  const q = query.trim().toLowerCase();

  return media.filter(m =>
    (type === 'all' || m.type === type) &&
    (
      m.title.toLowerCase().includes(q) ||
      (m.description || '').toLowerCase().includes(q) ||
      m.genres.some(g => g.name.toLowerCase().includes(q) || g.nameAr.includes(query))
    )
=======
  const {
    media
  } = await getCatalog();

  const q =
    query
      .trim()
      .toLowerCase();

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
              .includes(query)
        )
      )
>>>>>>> 1afac36249b90f041825e65af1c0dca6c341f2a2
  );
}
