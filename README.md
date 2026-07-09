# موقع تذكاري — رحلة إيمان وخدمة

موقع سينمائي روحي باللغة العربية (RTL) يحكي سيرة كاهن مسيحي — تصميم أنيق بإضاءة ذهبية دافئة، رسوم متحركة سلسة، ودعم كامل للجوال.

## المميزات

- **قسم رئيسي** — فيديو خلفية، اقتباس ملهم، تشغيل صوت
- **خط زمني تفاعلي** — رحلة الحياة من الطفولة إلى الكهنوت
- **معرض وسائط** — صور مع lightbox + فيديوهات Swiper
- **أصوات وذكريات** — مشغّل صوت أنيق مع قائمة تشغيل
- **إنجازات** — بطاقات إحصائية متحركة
- **قصة تفاعلية** — scroll storytelling مع GSAP
- **شهادات** — slider للاقتباسات
- **إرث** — رسالة سينمائية
- **تواصل** — معلومات الكنيسة + خريطة + روابط اجتماعية

## التقنيات

| التقنية | الاستخدام |
|---------|-----------|
| HTML5 | بنية семантية + SEO |
| CSS3 | Glassmorphism، RTL، responsive |
| JavaScript | تفاعلات، lazy loading |
| AOS | Scroll animations |
| GSAP + ScrollTrigger | Parallax & storytelling |
| Swiper | Video & testimonial sliders |

## البدء السريع

```bash
# افتح المجلد
cd father-story

# شغّل خادماً محلياً (اختر أحد الخيارات)
npx serve .
# أو
python -m http.server 8080
# أو
php -S localhost:8080
```

ثم افتح `http://localhost:8080` في المتصفح.

## هيكل الملفات

```
father-story/
├── index.html          # الصفحة الرئيسية
├── css/
│   └── style.css       # الأنماط الكاملة
├── js/
│   ├── main.js         # التنقل، الصوت، العدادات
│   ├── animations.js   # GSAP animations
│   └── gallery.js      # Lightbox & filters
└── assets/
    ├── images/         # الصور (أضف صورك هنا)
    ├── videos/         # فيديو الخلفية
    └── audio/          # التسجيلات الصوتية
```

## تخصيص المحتوى

### 1. اسم الكاهن والاقتباس
في `index.html`، ابحث عن `[اسم الكاهن]` واستبدله بالاسم الحقيقي.

### 2. الصور
ضع صورك في المسارات التالية:

| المسار | الوصف |
|--------|-------|
| `assets/images/hero-poster.jpg` | صورة غلاف الفيديو |
| `assets/images/timeline/*.jpg` | صور الخط الزمني (6 صور) |
| `assets/images/gallery/*.jpg` | صور المعرض |
| `assets/images/story/chapter-*.jpg` | خلفيات فصول القصة (5) |
| `assets/images/testimonials/*.jpg` | صور الشهادات |
| `assets/images/legacy-bg.jpg` | خلفية قسم الإرث |
| `assets/images/audio-cover.jpg` | غلاف مشغّل الصوت |

### 3. الفيديو
- `assets/videos/church-hero.mp4` — فيديو خلفية القسم الرئيسي (MP4, H.264)

### 4. الصوت
- `assets/audio/ambient-church.mp3` — موسيقى خلفية
- `assets/audio/sermon-*.mp3` — تسجيلات العظات

### 5. فيديوهات YouTube
استبدل `VIDEO_ID_1`, `VIDEO_ID_2`, `VIDEO_ID_3` في قسم المعرض بمعرّفات YouTube الحقيقية.

### 6. الخريطة
حدّث رابط `iframe` في قسم التواصل بإحداثيات الكنيسة من [Google Maps Embed](https://www.google.com/maps).

### 7. معلومات التواصل
حدّث الهاتف، البريد، روابط السوشيال ميديا، وعنوان الكنيسة.

## إمكانية الوصول (Accessibility)

- Skip link للمحتوى الرئيسي
- ARIA labels على جميع الأزرار التفاعلية
- دعم `prefers-reduced-motion`
- تنقل بلوحة المفاتيح (Escape, أسهم)
- Semantic HTML5 landmarks

## SEO

- Meta description & keywords
- Open Graph tags
- Semantic headings hierarchy
- Lazy loading للصور والفيديو

## المتصفحات المدعومة

Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## الترخيص

للاستخدام الشخصي والكنسي.
