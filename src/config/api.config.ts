/**
 * YUKI API Configuration
 * 
 * 📌 لتغيير السيرفر: غيّر BASE_URL فقط
 * 📌 لا تضع كلمات مرور هنا - استخدم متغيرات البيئة
 */

export const API_CONFIG = {
  // رابط الـ API - يمكن تغييره بسهولة دون إعادة بناء التطبيق
  BASE_URL: (import.meta as any).env?.VITE_SUPABASE_URL || 'https://euntkhkadunekmlydyes.supabase.co/rest/v1/',
  
  // نسخة الـ API
  VERSION: 'v1',
  
  // مدة انتهاء الجلسة (ساعة)
  SESSION_TIMEOUT: 60 * 60 * 1000,
  
  // وقت انتظار الطلبات (ثانية)
  REQUEST_TIMEOUT: 30000,
  
  // إعدادات الصور
  IMAGES: {
    POSTER_SIZE: 'w400',
    BACKDROP_SIZE: 'w1280',
    THUMBNAIL_SIZE: 'w320',
  },
  
  // حد التقييم
  RATING: {
    MIN: 1,
    MAX: 5,
  },
  
  // إعدادات الصفحات
  PAGINATION: {
    DEFAULT_LIMIT: 20,
    MAX_LIMIT: 100,
  },
};

/**
 * MIGRATION GUIDE
 * ================
 * لنقل البيانات من MySQL إلى قاعدة بيانات جديدة:
 * 
 * 1. صدّر البيانات من MySQL:
 *    mysqldump -u user -p yuki_db > yuki_backup.sql
 * 
 * 2. حوّل البيانات لـ JSON:
 *    node scripts/migrate.js
 * 
 * 3. استورد في القاعدة الجديدة
 * 
 * 4. غيّر BASE_URL في هذا الملف
 * 
 * الجداول المطلوبة:
 * - media (id, type, title, title_ar, description, poster, backdrop, year, rating, views, ...)
 * - genres (id, name, name_ar)
 * - media_genres (media_id, genre_id)
 * - seasons (id, media_id, number, title)
 * - episodes (id, season_id, number, title, duration, servers_json)
 * - users (id, name, email, password_hash, avatar, created_at)
 * - favorites (user_id, media_id, created_at)
 * - watch_progress (user_id, media_id, episode_id, progress, current_time, updated_at)
 * - ratings (user_id, media_id, rating, created_at)
 * - comments (id, user_id, media_id, text, rating, created_at, updated_at)
 */

export const FREE_HOSTING_OPTIONS = {
  /**
   * خيارات الاستضافة المجانية الموصى بها:
   * 
   * 1. Supabase (الأفضل):
   *    - PostgreSQL مجاني
   *    - Auth مدمج
   *    - Storage للصور
   *    - REST API تلقائي
   *    - 500MB مجاناً
   *    - https://supabase.com
   * 
   * 2. PlanetScale:
   *    - MySQL متوافق
   *    - 5GB مجاناً
   *    - branching للـ development
   *    - https://planetscale.com
   * 
   * 3. Railway:
   *    - MySQL/PostgreSQL
   *    - Node.js backend
   *    - $5 credit مجاناً
   *    - https://railway.app
   * 
   * 4. Render:
   *    - PostgreSQL مجاني
   *    - Node.js
   *    - https://render.com
   * 
   * التوصية: استخدم Supabase
   * - سهل الإعداد
   * - Auth مدمج
   * - Row Level Security
   * - Real-time subscriptions
   */
  recommended: 'Supabase',
};

export default API_CONFIG;
