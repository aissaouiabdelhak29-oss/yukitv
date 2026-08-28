# YUKI TV - تعديلات المشروع

## 📁 الملفات المعدلة

انسخ هذه الملفات فوق الملفات القديمة في مشروعك:

| الملف | الوصف |
|-------|-------|
| `src/lib/supabase.ts` | ✅ أصلح الصور (poster/backdrop) + الـ API |
| `src/pages/PlayerPage.tsx` | ✅ iframe بدل React Player |
| `src/pages/DetailPage.tsx` | ✅ تفاصيل الفيلم/المسلسل + تشغيل |
| `src/pages/HomePage.tsx` | ✅ fallback للـ mockData |
| `src/App.tsx` | ✅ نفس التصميم |
| `src/lib/useCatalog.ts` | ✅ جلب البيانات |

## 🔧 خطوات التطبيق

### 1. نسخ الملفات
```bash
# انسخ الملفات المعدلة
```

### 2. تفعيل RLS في Supabase
افتح **SQL Editor** في Supabase ونفذ ملف `supabase_policies.sql`

### 3. تأكد من البيانات
تأكد أن جدول `content` فيه بيانات و `status = 'published'`

### 4. تشغيل التطبيق
```bash
npm run dev
```

## 🖼️ كيف تعمل الصور

```
قاعدة البيانات (content.poster)
    ↓
"6a1a1387ee053.jpg"
    ↓
imageUrl() → يبني الرابط
    ↓
https://euntkhkadunekmlydyes.supabase.co/storage/v1/object/public/posters/6a1a1387ee053.jpg
```

## 🎬 كيف يشتغل المشغل

بدل React Player المدمج، الحين:
1. تضغط "شاهد الآن"
2. يفتح صفحة `PlayerPage`
3. يعرض **iframe** برابط السيرفر (embed URL)
4. لو فيه أكثر من سيرفر، تقدر تختار من قائمة السيرفرات

## ⚠️ ملاحظات

- **لا تغير** `VITE_SUPABASE_PUBLISHABLE_KEY` في `.env` — هو صحيح
- لو `backdrop` فارغ في قاعدة البيانات، يستخدم `poster` كـ fallback
- لو الاتصال بـ Supabase فشل، يعرض البيانات الافتراضية (mockData)
