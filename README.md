# United IT Clubs (UITC) — sayt va boshqaruv paneli

7 yoshdan 50 yoshgacha bo‘lganlar uchun offline IT kurslar: **Foundation** (kompyuter savodxonligi), **AI**, **YouTube** va **Fullstack (AI integrated)**.
Saytning asosiy vazifasi — bepul sinov darsiga ariza yig‘ish.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Vercel Functions

## Sahifalar

| Yo‘l | Sahifa |
|---|---|
| `/` | Bosh sahifa: hero + tezkor forma, kim uchun (bolalar / o‘smirlar / kattalar), kurslar, nega UITC, qanday boshlanadi, o‘quvchilar va ota-onalar video fikrlari, diplom, savollar, ariza |
| `/kurslar` | Kurslar (yosh toifasi bo‘yicha filtr) |
| `/kurs/:slug` | Kurs sahifasi: o‘quv rejasi, natija, sinov darsi formasi |
| `/biz-haqimizda`, `/maxfiylik` | Qo‘shimcha sahifalar |
| `/ru/...`, `/en/...` | Xuddi shu sahifalar rus va ingliz tilida (masalan `/ru/kurslar`, `/en/kurs/ai`) |
| `/admin` | Boshqaruv paneli: arizalar (CRM), statistika, xavfsizlik (parol, 2FA) |

## Kontentni tahrirlash — admin paneldan (kod shart emas)

`/admin` → **Sayt kontenti**. Har bir bo‘lim tahrirlanadi:

| Tab | Nima o‘zgaradi |
|---|---|
| Kontaktlar | Telefonlar, Telegram, manzil, mo‘ljal, xarita koordinatalari |
| Bosh sahifa | Hero matnlari va rasmi, 4 ta raqam, yugurib turuvchi yozuvlar |
| Kurslar | Qo‘shish / o‘chirish / tartib / yashirish, barcha maydonlar, rasm, o‘quv rejasi |
| Video fikrlar | O‘quvchi va ota-ona videolari (yuklash yoki YouTube ID), muqova, ism, yosh |
| Bloklar | “Nega UITC” kartalari, qadamlar, diplom va ariza bloki afzalliklari |
| Kim uchun | 3 ta yosh toifasi matnlari |
| Savol-javob | Savollar va javoblar |
| Biz haqimizda | Sahifa matni, rasmi va kartalari |
| Sarlavhalar | Har bir bo‘limning sarlavha va tavsifi |
| Versiyalar | Oxirgi 30 ta saqlash — bir tugma bilan tiklash |

“Saqlash va chiqarish” bosilgach, sayt ~20 soniya ichida yangilanadi. Rasm va videolar xususiy omborga
to‘g‘ridan-to‘g‘ri yuklanadi (video 300 MB gacha) va `/api/media` orqali beriladi.
Standart (dastlabki) kontent: `src/content/defaults.ts` (o‘zbekcha), `defaults.ru.ts`, `defaults.en.ts`.

### Tillar (O‘zbekcha · Русский · English)

Muharrir tepasidagi tugmalar bilan tilni tanlang. **O‘zbekcha** — asosiy nusxa: telefonlar, rasm va
videolar, kurslar ro‘yxati, tartib va yashirish shu yerda o‘zgartiriladi va barcha tillarga birdan
qo‘llanadi. **Русский** va **English** bo‘limlarida faqat matnlar tarjima qilinadi. Tarjima qilinmagan
yangi kurs vaqtincha o‘zbekcha matn bilan ko‘rinadi. Tugma va menyu kabi doimiy yozuvlar:
`src/i18n/ui.ts`.

## SEO

- Har bir ochiq sahifa (3 til × 8 sahifa) build paytida tayyor HTML qilib yaratiladi (`scripts/prerender.mjs`):
  qidiruv tizimlari JavaScript’siz ham to‘liq matnni ko‘radi, sahifa birinchi ochilishda darhol chiqadi.
- Har sahifada: sarlavha, tavsif, `canonical`, `hreflang` (uz/ru/en + x-default), Open Graph / Twitter rasmi (`public/og.jpg`),
  JSON-LD (EducationalOrganization + LocalBusiness manzil bilan, Course, FAQPage, BreadcrumbList).
- `sitemap.xml` va `robots.txt` avtomatik yaratiladi. Asosiy manzil: `https://uitc.uz` (boshqasi uchun Vercel’da `SITE_URL` qo‘ying).
- Admin kontentni saqlaganda tayyor HTML ham yangilanishi uchun Vercel → Settings → Git → Deploy Hooks’da hook yarating
  va uning manzilini `VERCEL_DEPLOY_HOOK_URL` sifatida qo‘shing (bo‘lmasa ham tashrif buyuruvchilar yangi matnni darhol ko‘radi).
- Google Search Console’ga saytni qo‘shib, `sitemap.xml` ni yuboring.

## Ishga tushirish

```bash
npm install
npm run dev
npm run build
```

## Muhit o‘zgaruvchilari (Vercel → Settings → Environment Variables)

| Kalit | Vazifasi |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Xususiy Blob ombori (arizalar) — Vercel avtomatik qo‘shadi |
| `ADMIN_PASSWORD_HASH` | Admin vaqtinchalik parolining scrypt xeshi |
| `ADMIN_SESSION_SECRET` | Sessiya va 2FA shifrlash kaliti (≥32 belgi) |
| `TELEGRAM_BOT_TOKEN` | Arizalar yuboriladigan bot tokeni |
| `TELEGRAM_CHAT_ID` | Arizalar tushadigan guruh/chat ID |
| `ALLOWED_ORIGINS` | (ixtiyoriy) masalan `https://uitc.uz,https://www.uitc.uz` |

## ⚠️ Tekshirib, kerak bo‘lsa almashtiring
- Hero va kurs rasmlari AI yordamida yaratilgan — imkon bo‘lsa haqiqiy dars suratlari bilan almashtiring.
- Modullar tarkibi (o‘quv rejasi) — taklif; o‘qituvchilar bilan tasdiqlang.
- Quyidagi va’dalar to‘g‘riligini tasdiqlang: kichik guruhlar, ota-onaga hisobot, diplom, bepul sinov darsi.
- Maxfiylik siyosati matni — yuridik tekshiruvdan o‘tkazing.

Xavfsizlik: [SECURITY.md](SECURITY.md). Raqobatchilar tahlili: [docs/raqobatchilar-tahlili.md](docs/raqobatchilar-tahlili.md).

## Brend
`public/brand/` — logotip (SVG vektor + PNG: vertikal, gorizontal, oq), ikonkalar.
