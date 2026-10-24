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
| Uchinchi tomon | Shriftlar o‘zimizda (self-hosted) — tashqi CDN/trekerlar yo‘q |
| API (`/api/lead`) | Faqat `POST` + `application/json`, 4 KB limit, Origin tekshiruvi (CSRF), IP bo‘yicha rate-limit, honeypot + vaqt tuzog‘i (bot), server tomonida qat’iy validatsiya, Telegram’ga yuborishda HTML-escape |
| Sirlar | Tokenlar faqat Vercel Environment Variables’da (server-side). `VITE_` prefiksi ishlatilmaydi. `.env` git’ga kirmaydi |
| Kod | XSS uchun React avtomatik escaping, `dangerouslySetInnerHTML` ishlatilmaydi; URL parametrlari oq ro‘yxat bo‘yicha qabul qilinadi |
| Ta’minot zanjiri | Dependabot, CI’da `npm audit`, CodeQL (security-extended), source map’lar production’da o‘chirilgan |

## Backend ulanganda qilinishi kerak

- Autentifikatsiya: SMS OTP server tomonida tekshiriladi, sessiya `HttpOnly; Secure; SameSite=Strict` cookie’da; OTP urinishlari cheklanadi.
- To‘lovlar (Payme/Click/Uzum): faqat server-to-server callback, imzo (signature) tekshiruvi, summa server tomonda qayta hisoblanadi — klientdan kelgan narxga ishonilmaydi.
- Vercel Firewall: `/api/*` uchun global rate-limit qoidasi va Bot Protection yoqilsin.
- Video kontent: imzolangan, muddati cheklangan URL’lar (signed URLs) + watermark.
