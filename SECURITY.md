# Xavfsizlik siyosati

Zaiflik topsangiz, iltimos, ochiq issue yaratmang — **security@uitc.uz** manziliga yozing.
48 soat ichida javob beramiz.

## Amalga oshirilgan himoya choralari

| Qatlam | Chora |
|---|---|
| Transport | HTTPS majburiy, HSTS (2 yil, preload), `upgrade-insecure-requests` |
| Brauzer | Qat’iy CSP: faqat o‘z domenidan skript (`script-src 'self'`), inline skript yo‘q, `object-src 'none'`, `frame-ancestors 'none'` |
| Clickjacking | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| MIME / izolyatsiya | `X-Content-Type-Options: nosniff`, COOP/CORP `same-origin` |
| Maxfiylik | `Referrer-Policy: strict-origin-when-cross-origin`, kamera/mikrofon/geolokatsiya o‘chirilgan (`Permissions-Policy`) |
| Uchinchi tomon | Shriftlar va rasmlar o‘zimizda (self-hosted). Yagona istisno — YouTube video fikrlar: faqat `youtube-nocookie.com` iframe’i, sandbox bilan va faqat bosilganda yuklanadi |
| API (`/api/lead`) | Faqat `POST` + `application/json`, 4 KB limit, Origin tekshiruvi (CSRF), IP bo‘yicha rate-limit, honeypot + vaqt tuzog‘i (bot), server tomonida qat’iy validatsiya, Telegram’ga yuborishda HTML-escape |
| Sirlar | Tokenlar faqat Vercel Environment Variables’da (server-side). `VITE_` prefiksi ishlatilmaydi. `.env` git’ga kirmaydi |
| Kod | XSS uchun React avtomatik escaping, `dangerouslySetInnerHTML` ishlatilmaydi; URL parametrlari oq ro‘yxat bo‘yicha qabul qilinadi |
| Ta’minot zanjiri | Dependabot, CI’da `npm audit`, CodeQL (security-extended), source map’lar production’da o‘chirilgan |

## Admin panel (`/admin`)

| Himoya | Tafsilot |
|---|---|
| Parol | scrypt (N=32768) bilan xeshlanadi; birinchi kirishda vaqtinchalik parolni almashtirish majburiy |
| 2FA | TOTP (Google Authenticator), maxfiy kalit AES-256-GCM bilan shifrlangan, kodni qayta ishlatish bloklangan |
| Sessiya | `__Host-` HttpOnly, Secure, SameSite=Strict cookie, HMAC-SHA256 imzo, 8 soat; parol almashtirilsa yoki “hamma joydan chiqish” bosilsa barcha sessiyalar bekor bo‘ladi |
| Brute-force | IP bo‘yicha 5 ta xato → 15 daqiqa blok; umumiy 30 ta xato → 15 daqiqa blok; javob vaqti bir xil (timing hujumlardan himoya) |
| CSRF | Origin tekshiruvi + maxsus `x-uitc-admin` header + SameSite=Strict |
| Ma’lumotlar | Arizalar xususiy (private) Vercel Blob omborida; faqat autentifikatsiyadan o‘tgan funksiya o‘qiy oladi |
| Eksport | CSV’da formula-injection (`=`, `+`, `-`, `@`) neytrallashtiriladi |
| Indekslash | `/admin` va `/api` qidiruv tizimlari uchun yopiq (`noindex`, robots.txt) |
| Kod | Admin kodi alohida chunk — oddiy tashrif buyuruvchilar yuklab olmaydi |
| Kontent muharriri | Server har bir saqlashni qat’iy tekshiradi: matnlar tozalanadi va uzunligi cheklanadi, rasm/video faqat o‘z serverimizdagi manzillardan (tashqi havola, `javascript:` rad etiladi), telefon, Telegram, koordinata va YouTube ID formati tekshiriladi; bir vaqtda ikki kishi tahrirlasa ustma-ust yozilmaydi (versiya nazorati); har saqlash tarixda qoladi |
| Media yuklash | Faqat tizimga kirgan admin 10 daqiqalik token oladi; faqat JPG/PNG/WEBP/AVIF (8 MB) va MP4/WEBM/MOV (300 MB); fayllar xususiy omborda, sayt ularni `nosniff` va `sandbox` CSP bilan beradi |

## Telegram
- Saytdagi Telegram tugmalari faqat `https://t.me/uitcadmin` ga oddiy havola (`rel="noopener noreferrer"`): saytdan Telegram’ga hech qanday ma’lumot yoki token uzatilmaydi.
- Bot tokeni (`TELEGRAM_BOT_TOKEN`) faqat serverda; xabarlar HTML-escape qilinadi.
- Firibgarlikdan ogohlantirish: rasmiy aloqa faqat **@uitcadmin** — boshqa akkauntlar nomidan yozilgan xabarlarga ishonmang.

## Tavsiya (Vercel Dashboard → Firewall)
API orqali yoqib bo‘lmadi (tarif cheklovi), qo‘lda yoqish tavsiya etiladi:
- `/api/lead` POST: IP bo‘yicha 10 so‘rov / 10 daqiqa (rate limit).
- `/api/admin/*`: IP bo‘yicha 60 so‘rov / daqiqa.
- Bot Protection: yoqilgan.

## Kelajakda (online kurslar ishga tushganda)

- Autentifikatsiya: SMS OTP server tomonida, sessiya `HttpOnly; Secure; SameSite=Strict` cookie’da.
- To‘lovlar (Payme/Click/Uzum): faqat server-to-server callback va imzo tekshiruvi.
- Vercel Firewall: `/api/*` uchun global rate-limit qoidasi va Bot Protection.
