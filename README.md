# UITC — Online IT Akademiya

6 yillik tajribaga ega IT ta’lim markazining online kurslar sotish platformasi (frontend).

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS v4 · Framer Motion · Vercel Functions

## Sahifalar

| Yo‘l | Sahifa |
|---|---|
| `/` | Bosh sahifa: hero, statistika, kurslar (tablar), 4 qadam, platforma, narxlar, sharhlar, FAQ, ariza formasi |
| `/kurslar` | Katalog: qidiruv, yo‘nalish/daraja filtrlari, saralash (URL’da saqlanadi) |
| `/kurs/:slug` | Kurs sahifasi: natijalar, o‘quv dasturi, mentor, sticky xarid kartasi |
| `/tolov/:slug` | To‘lov: to‘liq / bo‘lib to‘lash, Payme / Click / Uzum / karta |
| `/kirish`, `/royxatdan-otish` | SMS-kod orqali kirish (UI, demo) |
| `/kabinet` | O‘quvchi kabineti (UI, demo) |
| `/narxlar`, `/biz-haqimizda`, `/maxfiylik`, `/oferta` | Qo‘shimcha sahifalar |

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Muhit o‘zgaruvchilari (Vercel → Settings → Environment Variables)

| Kalit | Vazifasi |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Arizalar yuboriladigan bot tokeni |
| `TELEGRAM_CHAT_ID` | Arizalar tushadigan chat/guruh ID |
| `ALLOWED_ORIGINS` | (ixtiyoriy) `https://uitc.uz,https://www.uitc.uz` |

O‘zgaruvchilar berilmasa, forma ishlaydi, lekin arizalar hech qayerga yuborilmaydi.

## ⚠️ Ishga tushirishdan oldin almashtirish kerak

`src/data/courses.ts` va sahifalardagi quyidagilar **namuna (placeholder)**:
kurslar ro‘yxati, narxlar, mentorlar ismlari, sharhlar, statistikalar (10 000+, 87%, 4.9),
telefon/email, ijtimoiy tarmoq havolalari, tarix (timeline), qaytarish va bo‘lib to‘lash shartlari, oferta va maxfiylik matni.

Xavfsizlik bo‘yicha batafsil: [SECURITY.md](SECURITY.md).
