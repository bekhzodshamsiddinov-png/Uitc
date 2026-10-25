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
| `/admin` | Boshqaruv paneli: arizalar (CRM), statistika, xavfsizlik (parol, 2FA) |

## Kontentni tahrirlash

| Nima | Fayl |
|---|---|
| Kurslar, o‘quv rejasi, telefonlar | `src/data/courses.ts` |
| O‘quvchi va ota-ona video fikrlari | `src/data/testimonials.ts` (yo‘riqnoma fayl ichida) |
| Savol-javoblar | `src/components/Faq.tsx` |
| Rasmlar | `public/images/` |

### Video fikr qo‘shish
1. Videoni `public/videos/` ga qo‘ying (vertikal 9:16, MP4/H.264, ~15 MB gacha), muqova rasmi ixtiyoriy.
2. `src/data/testimonials.ts` da yozuvni to‘ldiring: `name`, `age`, `course`, `src: '/videos/fayl.mp4'`, `poster`.
   Yoki YouTube uchun: `youtubeId: '...'`.
Video qo‘shilmagan kartalar “Video tez orada” ko‘rinishida turadi.

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
