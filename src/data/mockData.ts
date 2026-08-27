import { Media, Genre, Comment } from '../types';

export const genres: Genre[] = [
  { id: 1, name: 'Action', nameAr: 'أكشن' },
  { id: 2, name: 'Drama', nameAr: 'دراما' },
  { id: 3, name: 'Comedy', nameAr: 'كوميديا' },
  { id: 4, name: 'Horror', nameAr: 'رعب' },
  { id: 5, name: 'Romance', nameAr: 'رومانسي' },
  { id: 6, name: 'Sci-Fi', nameAr: 'خيال علمي' },
  { id: 7, name: 'Fantasy', nameAr: 'فانتازيا' },
  { id: 8, name: 'Thriller', nameAr: 'إثارة' },
  { id: 9, name: 'Animation', nameAr: 'رسوم متحركة' },
  { id: 10, name: 'Adventure', nameAr: 'مغامرات' },
  { id: 11, name: 'Crime', nameAr: 'جريمة' },
  { id: 12, name: 'Mystery', nameAr: 'غموض' },
  { id: 13, name: 'Shonen', nameAr: 'شونن' },
  { id: 14, name: 'Isekai', nameAr: 'إيسيكاي' },
  { id: 15, name: 'Mecha', nameAr: 'ميكا' },
];

const moviePosters = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1596727147705-61a532a659bd?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1567696911980-2c669abbe713?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1550236520-7050f3582da0?w=400&h=600&fit=crop',
];

const backdropImages = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1280&h=720&fit=crop',
  'https://images.unsplash.com/photo-1512070679279-8988d32161be?w=1280&h=720&fit=crop',
];

const animePosters = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1601850494422-3cf14624b0b3?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1548872591-3533e8f0b71e?w=400&h=600&fit=crop',
];

const demoServers = [
  { id: 's1', name: 'سيرفر 1', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', quality: '720p' as const },
  { id: 's2', name: 'سيرفر 2', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', quality: '1080p' as const },
  { id: 's3', name: 'سيرفر 3', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', quality: '480p' as const },
];

function generateEpisodes(count: number, seasonNum: number): any[] {
  return Array.from({ length: count }, (_, i) => ({
    id: seasonNum * 100 + i + 1,
    number: i + 1,
    title: `الحلقة ${i + 1}`,
    titleAr: `الحلقة ${i + 1}`,
    description: `وصف الحلقة ${i + 1} من الموسم ${seasonNum} - مشهد مثير ومليء بالأحداث المتسارعة والمواجهات الدرامية.`,
    thumbnail: `https://images.unsplash.com/photo-${1536440136628 + i * 1000}-849c177e76a1?w=320&h=180&fit=crop`,
    duration: Math.floor(Math.random() * 20) + 20,
    airDate: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    servers: demoServers,
    watched: false,
    watchProgress: 0,
  }));
}

export const movies: Media[] = [
  {
    id: 1, type: 'movie', title: 'ظلال الأبدية', titleAr: 'ظلال الأبدية', originalTitle: 'Shadows of Eternity',
    description: 'في عالم تتشابك فيه الأسرار والمؤامرات، يجد بطلنا نفسه أمام اختيار مصيري بين إنقاذ من يحب أو كشف الحقيقة المرة التي تهدد كل شيء.',
    poster: moviePosters[0], backdrop: backdropImages[0], year: 2024, rating: 8.7,
    ratingCount: 12543, views: 985420, genres: [genres[0], genres[1], genres[7]],
    duration: 142, quality: '4K', servers: demoServers, featured: true, trending: true,
    director: 'أحمد السيد', cast: ['محمد علي', 'سارة حسن', 'كريم خالد'],
    language: 'عربي', country: 'مصر',
  },
  {
    id: 2, type: 'movie', title: 'قوة الإرادة', titleAr: 'قوة الإرادة', originalTitle: 'Force of Will',
    description: 'ملحمة أكشن مثيرة عن رجل يقاتل من أجل العدالة في مدينة يسودها الفساد والظلام، حيث كل خطوة قد تكون الأخيرة.',
    poster: moviePosters[1], backdrop: backdropImages[1], year: 2024, rating: 8.2,
    ratingCount: 8920, views: 754230, genres: [genres[0], genres[10]],
    duration: 118, quality: '1080p', servers: demoServers, trending: true,
    director: 'خالد المنصور', cast: ['عمر شريف', 'ليلى أحمد'],
    language: 'عربي', country: 'السعودية',
  },
  {
    id: 3, type: 'movie', title: 'ليلة الخيانة', titleAr: 'ليلة الخيانة', originalTitle: 'Night of Betrayal',
    description: 'إثارة ودراما نفسية مكثفة في ليلة واحدة تكشف فيها الأسرار المدفونة وتتبدل فيها الأقنعة.',
    poster: moviePosters[2], backdrop: backdropImages[2], year: 2023, rating: 7.9,
    ratingCount: 6780, views: 543100, genres: [genres[1], genres[7], genres[11]],
    duration: 105, quality: '1080p', servers: demoServers,
    director: 'فاطمة الزهراء', cast: ['ياسمين حسام', 'طارق محمود'],
    language: 'عربي', country: 'المغرب',
  },
  {
    id: 4, type: 'movie', title: 'العالم الجديد', titleAr: 'العالم الجديد', originalTitle: 'New World',
    description: 'رحلة خيال علمي عبر الزمن والفضاء، حيث تكتشف الإنسانية أنها ليست وحيدة في الكون.',
    poster: moviePosters[3], backdrop: backdropImages[3], year: 2024, rating: 9.1,
    ratingCount: 19870, views: 1254300, genres: [genres[5], genres[9], genres[0]],
    duration: 165, quality: '4K', servers: demoServers, featured: true,
    director: 'سامي الحربي', cast: ['نادين وسيم', 'ياسر قحطاني'],
    language: 'عربي', country: 'الإمارات',
  },
  {
    id: 5, type: 'movie', title: 'أصوات الصمت', titleAr: 'أصوات الصمت',
    description: 'قصة إنسانية عميقة عن شاب يفقد حاسة السمع ويكتشف عالماً مختلفاً مليئاً بالجمال الخفي.',
    poster: moviePosters[4], backdrop: backdropImages[4], year: 2023, rating: 8.5,
    ratingCount: 9230, views: 678900, genres: [genres[1], genres[4]],
    duration: 128, quality: '1080p', servers: demoServers,
    language: 'عربي', country: 'لبنان',
  },
  {
    id: 6, type: 'movie', title: 'رحلة المجهول', titleAr: 'رحلة المجهول',
    description: 'مغامرة شيقة في أعماق الأدغال حيث تتحول رحلة بحثية إلى صراع من أجل البقاء.',
    poster: moviePosters[5], backdrop: backdropImages[5], year: 2024, rating: 7.6,
    ratingCount: 5430, views: 423700, genres: [genres[9], genres[0], genres[7]],
    duration: 132, quality: '1080p', servers: demoServers, trending: true,
    language: 'عربي', country: 'الجزائر',
  },
  {
    id: 7, type: 'movie', title: 'الوجه الآخر', titleAr: 'الوجه الآخر',
    description: 'غموض ونفسية معقدة عندما يكتشف المحقق أن الجاني والضحية كانا شخصاً واحداً.',
    poster: moviePosters[6], backdrop: backdropImages[6], year: 2023, rating: 8.0,
    ratingCount: 7650, views: 598200, genres: [genres[11], genres[7], genres[10]],
    duration: 118, quality: '720p', servers: demoServers,
    language: 'عربي', country: 'تونس',
  },
  {
    id: 8, type: 'movie', title: 'نار وجليد', titleAr: 'نار وجليد',
    description: 'فانتازيا ملحمية في عالم سحري تتصارع فيه قوى النار والجليد على مصير الأرض.',
    poster: moviePosters[7], backdrop: backdropImages[7], year: 2024, rating: 8.8,
    ratingCount: 14320, views: 987600, genres: [genres[6], genres[0], genres[9]],
    duration: 155, quality: '4K', servers: demoServers,
    language: 'عربي', country: 'مصر',
  },
  {
    id: 9, type: 'movie', title: 'قلب الظلام', titleAr: 'قلب الظلام',
    description: 'رعب نفسي مكثف في منزل معزول حيث الخوف الحقيقي يسكن في الداخل لا الخارج.',
    poster: moviePosters[8], backdrop: backdropImages[8], year: 2023, rating: 7.4,
    ratingCount: 4210, views: 356800, genres: [genres[3], genres[7], genres[11]],
    duration: 98, quality: '1080p', servers: demoServers,
    language: 'عربي', country: 'الكويت',
  },
  {
    id: 10, type: 'movie', title: 'أسرار المدينة', titleAr: 'أسرار المدينة',
    description: 'جريمة ودراما في مدينة لا تنام، حيث كل شخص يحمل سراً يمكن أن يدمر حياته.',
    poster: moviePosters[9], backdrop: backdropImages[9], year: 2024, rating: 8.3,
    ratingCount: 10870, views: 812400, genres: [genres[10], genres[1], genres[11]],
    duration: 135, quality: '1080p', servers: demoServers, trending: true,
    language: 'عربي', country: 'الأردن',
  },
  {
    id: 11, type: 'movie', title: 'ضوء القمر', titleAr: 'ضوء القمر',
    description: 'قصة حب استثنائية تنشأ في أحلك الظروف وتتحدى المستحيل من أجل البقاء معاً.',
    poster: moviePosters[10], backdrop: backdropImages[0], year: 2024, rating: 8.6,
    ratingCount: 11230, views: 895600, genres: [genres[4], genres[1]],
    duration: 122, quality: '1080p', servers: demoServers,
    language: 'عربي', country: 'مصر',
  },
  {
    id: 12, type: 'movie', title: 'الصحراء الحمراء', titleAr: 'الصحراء الحمراء',
    description: 'ملحمة تاريخية في قلب الصحراء العربية حيث تُكتب أسطورة القبائل بالدم والشرف.',
    poster: moviePosters[11], backdrop: backdropImages[1], year: 2023, rating: 7.8,
    ratingCount: 6540, views: 487300, genres: [genres[0], genres[1], genres[9]],
    duration: 148, quality: '4K', servers: demoServers,
    language: 'عربي', country: 'السعودية',
  },
];

export const series: Media[] = [
  {
    id: 101, type: 'series', title: 'عالم الأسرار', titleAr: 'عالم الأسرار',
    description: 'مسلسل دراما غموض مثير تدور أحداثه حول عائلة تكتشف أن كل ما عاشته كان مبنياً على كذبة كبرى.',
    poster: moviePosters[0], backdrop: backdropImages[2], year: 2024, rating: 8.9,
    ratingCount: 23450, views: 1987600, genres: [genres[1], genres[11], genres[7]],
    featured: true, trending: true, status: 'ongoing',
    seasons: [
      { id: 1, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(15, 1) },
      { id: 2, number: 2, title: 'الموسم الثاني', episodes: generateEpisodes(12, 2) },
    ],
    language: 'عربي', country: 'مصر',
  },
  {
    id: 102, type: 'series', title: 'تحت الرماد', titleAr: 'تحت الرماد',
    description: 'إثارة وتشويق في مسلسل يتتبع محقق متقاعد يعود لكشف جريمة بقيت طي الكتمان لعشرين عاماً.',
    poster: moviePosters[1], backdrop: backdropImages[3], year: 2024, rating: 8.4,
    ratingCount: 15670, views: 1234500, genres: [genres[10], genres[7], genres[11]],
    trending: true, status: 'completed',
    seasons: [
      { id: 3, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(10, 3) },
    ],
    language: 'عربي', country: 'الأردن',
  },
  {
    id: 103, type: 'series', title: 'قصر الأحلام', titleAr: 'قصر الأحلام',
    description: 'دراما اجتماعية رومانسية عن أسرة ثرية تتحول حياتها رأساً على عقب عندما يظهر وريث مجهول.',
    poster: moviePosters[2], backdrop: backdropImages[4], year: 2023, rating: 7.7,
    ratingCount: 9870, views: 876500, genres: [genres[1], genres[4]],
    status: 'completed',
    seasons: [
      { id: 4, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(30, 4) },
      { id: 5, number: 2, title: 'الموسم الثاني', episodes: generateEpisodes(25, 5) },
    ],
    language: 'عربي', country: 'السعودية',
  },
  {
    id: 104, type: 'series', title: 'الخط الأحمر', titleAr: 'الخط الأحمر',
    description: 'أكشن مثير عن عميل سري يعمل في منطقة رمادية بين القانون والجريمة لحماية بلده.',
    poster: moviePosters[3], backdrop: backdropImages[5], year: 2024, rating: 8.6,
    ratingCount: 18920, views: 1567300, genres: [genres[0], genres[7], genres[10]],
    trending: true, status: 'ongoing',
    seasons: [
      { id: 6, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(12, 6) },
      { id: 7, number: 2, title: 'الموسم الثاني', episodes: generateEpisodes(8, 7) },
    ],
    language: 'عربي', country: 'الإمارات',
  },
  {
    id: 105, type: 'series', title: 'نسيج المدينة', titleAr: 'نسيج المدينة',
    description: 'دراما اجتماعية تصور حياة ثلاث عائلات من خلفيات مختلفة تتشابك مصائرها في مدينة واحدة.',
    poster: moviePosters[4], backdrop: backdropImages[6], year: 2023, rating: 8.1,
    ratingCount: 11230, views: 987400, genres: [genres[1], genres[2]],
    status: 'completed',
    seasons: [
      { id: 8, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(20, 8) },
    ],
    language: 'عربي', country: 'لبنان',
  },
  {
    id: 106, type: 'series', title: 'أرض الأبطال', titleAr: 'أرض الأبطال',
    description: 'مسلسل تاريخي ملحمي يروي قصة المقاومة والبطولة في أحلك فترات التاريخ العربي.',
    poster: moviePosters[5], backdrop: backdropImages[7], year: 2024, rating: 9.0,
    ratingCount: 25670, views: 2134500, genres: [genres[0], genres[1], genres[9]],
    featured: true, status: 'completed',
    seasons: [
      { id: 9, number: 1, title: 'الجزء الأول', episodes: generateEpisodes(15, 9) },
      { id: 10, number: 2, title: 'الجزء الثاني', episodes: generateEpisodes(15, 10) },
    ],
    language: 'عربي', country: 'مصر',
  },
];

export const animeList: Media[] = [
  {
    id: 201, type: 'anime', title: 'فارس الشفق', titleAr: 'فارس الشفق', originalTitle: 'Twilight Knight',
    description: 'في عالم حيث يحمل البشر قوى خارقة، يصارع بطل شاب مصيره المحتوم بينما يكتشف الحقيقة المرعبة خلف هذه القوى.',
    poster: animePosters[0], backdrop: backdropImages[8], year: 2024, rating: 9.2,
    ratingCount: 34560, views: 3456700, genres: [genres[12], genres[0], genres[6]],
    featured: true, trending: true, status: 'ongoing', season: 'Winter 2024',
    seasons: [
      { id: 11, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(24, 11) },
      { id: 12, number: 2, title: 'الموسم الثاني', episodes: generateEpisodes(12, 12) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
  {
    id: 202, type: 'anime', title: 'روح السماء', titleAr: 'روح السماء', originalTitle: 'Sky Soul',
    description: 'مغامرة ملحمية في عالم السماء حيث تطير المدن وتتحارب الممالك على السيطرة على قوة الرياح.',
    poster: animePosters[1], backdrop: backdropImages[9], year: 2024, rating: 8.8,
    ratingCount: 21340, views: 2145600, genres: [genres[13], genres[9], genres[6]],
    trending: true, status: 'ongoing', season: 'Spring 2024',
    seasons: [
      { id: 13, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(13, 13) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
  {
    id: 203, type: 'anime', title: 'ملك الآلات', titleAr: 'ملك الآلات', originalTitle: 'Machine King',
    description: 'عالم ميكا مستقبلي حيث تتحول البشرية إلى معركة ضد الروبوتات الحاكمة في آخر حصون المقاومة.',
    poster: animePosters[2], backdrop: backdropImages[0], year: 2023, rating: 8.5,
    ratingCount: 17890, views: 1876500, genres: [genres[14], genres[5], genres[0]],
    status: 'completed', season: 'Fall 2023',
    seasons: [
      { id: 14, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(26, 14) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
  {
    id: 204, type: 'anime', title: 'عالم آخر', titleAr: 'عالم آخر', originalTitle: 'Another World',
    description: 'قصة شاب ينقله الموت إلى عالم فانتازيا مختلف تماماً حيث يجب أن يتكيف ويبني حياة جديدة وسط مخلوقات مدهشة.',
    poster: animePosters[3], backdrop: backdropImages[1], year: 2024, rating: 8.3,
    ratingCount: 14560, views: 1543200, genres: [genres[13], genres[6], genres[4]],
    trending: true, status: 'ongoing', season: 'Summer 2024',
    seasons: [
      { id: 15, number: 1, title: 'الجزء الأول', episodes: generateEpisodes(12, 15) },
      { id: 16, number: 2, title: 'الجزء الثاني', episodes: generateEpisodes(12, 16) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
  {
    id: 205, type: 'anime', title: 'وحش البحر', titleAr: 'وحش البحر', originalTitle: 'Sea Demon',
    description: 'مغامرة بحرية مدهشة حيث تواجه طاقم سفينة صيد مخلوقات أسطورية تسكن أعماق المحيط.',
    poster: animePosters[4], backdrop: backdropImages[2], year: 2023, rating: 7.9,
    ratingCount: 9870, views: 987600, genres: [genres[9], genres[0], genres[12]],
    status: 'completed', season: 'Winter 2023',
    seasons: [
      { id: 17, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(25, 17) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
  {
    id: 206, type: 'anime', title: 'بطل الأرواح', titleAr: 'بطل الأرواح', originalTitle: 'Soul Hero',
    description: 'شاب يكتشف أنه يمتلك قدرة رؤية الأرواح ويتحول مصيره بشكل مفاجئ إلى حارس عالم الأحياء.',
    poster: animePosters[5], backdrop: backdropImages[3], year: 2024, rating: 8.7,
    ratingCount: 19870, views: 1987400, genres: [genres[12], genres[7], genres[6]],
    featured: true, status: 'ongoing', season: 'Fall 2024',
    seasons: [
      { id: 18, number: 1, title: 'الموسم الأول', episodes: generateEpisodes(24, 18) },
    ],
    language: 'ياباني', country: 'اليابان',
  },
];

export const allMedia: Media[] = [...movies, ...series, ...animeList];

export const mockComments: Comment[] = [
  {
    id: 1, mediaId: 1, userId: 'user1', userName: 'أحمد محمد', userAvatar: undefined,
    text: 'فيلم رائع جداً! الإخراج والتصوير احترافي والقصة مشوقة من البداية للنهاية. أنصح الجميع بمشاهدته.',
    rating: 5, createdAt: '2024-01-15T10:30:00Z', likes: 45, liked: false,
  },
  {
    id: 2, mediaId: 1, userId: 'user2', userName: 'سارة علي', userAvatar: undefined,
    text: 'تجربة سينمائية استثنائية! الممثلون قدموا أداءً مذهلاً والموسيقى التصويرية كانت تحفة.',
    rating: 5, createdAt: '2024-01-16T14:20:00Z', likes: 32, liked: false,
  },
  {
    id: 3, mediaId: 1, userId: 'user3', userName: 'خالد إبراهيم',
    text: 'القصة جيدة لكن النهاية كانت متسرعة نوعاً ما. يستحق المشاهدة بكل تأكيد.',
    rating: 4, createdAt: '2024-01-17T09:15:00Z', likes: 18, liked: false,
  },
  {
    id: 4, mediaId: 1, userId: 'user4', userName: 'منى حسين',
    text: 'واحد من أفضل الأفلام التي شاهدتها في 2024. مستوى الإنتاج عالمي.',
    rating: 5, createdAt: '2024-01-18T20:45:00Z', likes: 27, liked: false,
  },
];

export const featuredMedia = allMedia.filter(m => m.featured);
export const trendingMedia = allMedia.filter(m => m.trending);
export const topRatedMedia = [...allMedia].sort((a, b) => b.rating - a.rating).slice(0, 10);
