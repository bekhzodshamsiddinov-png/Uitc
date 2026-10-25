// Course catalogue. Durations and course names come from UITC; module breakdowns
// are a proposed curriculum — review them with the teaching team before launch.

export type AudienceId = 'kids' | 'teens' | 'adults'

export interface Audience {
  id: AudienceId
  name: string
  ages: string
  pitch: string
}

export const audiences: Audience[] = [
  { id: 'kids', name: 'Bolalar', ages: '7–13 yosh', pitch: 'Kompyuterni to‘g‘ri ishlatish, mantiqiy fikrlash va ijod — o‘yin orqali.' },
  { id: 'teens', name: 'O‘smirlar', ages: '14–17 yosh', pitch: 'Kelajak kasbiga erta start: AI, kontent yaratish va dasturlash.' },
  { id: 'adults', name: 'Kattalar', ages: '18–50 yosh', pitch: 'Yangi kasb yoki qo‘shimcha daromad — noldan amaliy natijagacha.' },
]

export interface Module {
  title: string
  topics: string[]
}

export interface Course {
  slug: string
  title: string
  short: string
  subtitle: string
  duration: string
  months: number
  level: string
  audiences: AudienceId[]
  ages: string
  accent: string // tailwind gradient classes for the cover
  image: string
  tags: string[]
  outcomes: string[]
  result: string
  forWhom: string[]
  modules: Module[]
  featured?: boolean
}

export const courses: Course[] = [
  {
    slug: 'foundation',
    image: '/images/course-foundation.webp',
    title: 'Foundation — Kompyuter savodxonligi',
    short: 'Foundation',
    subtitle: 'IT olamiga birinchi qadam: kompyuter, internet, ofis dasturlari va xavfsizlik.',
    duration: '1–2 oy',
    months: 2,
    level: 'Noldan',
    audiences: ['kids', 'teens', 'adults'],
    ages: '7 yoshdan',
    accent: 'from-sky-500 via-blue-500 to-indigo-600',
    tags: ['Kompyuter', 'Internet', 'Word', 'Excel', 'Xavfsizlik'],
    outcomes: [
      'Kompyuter va klaviatura bilan ishonchli, tez ishlash',
      'Fayl va papkalar, brauzer, elektron pochta',
      'Word, Excel va PowerPoint’da hujjat, jadval va taqdimot',
      'Internetda xavfsizlik: parollar, firibgarlikdan himoya',
      'Algoritmik fikrlash asoslari',
    ],
    result: 'Kompyuterdan erkin foydalanadi va keyingi IT yo‘nalishga tayyor bo‘ladi.',
    forWhom: ['Kompyuter bilan endi tanishayotganlar', 'Maktab o‘quvchilari', 'Ishda kompyuter ko‘nikmasi kerak bo‘lgan kattalar'],
    modules: [
      { title: 'Kompyuter bilan tanishuv', topics: ['Qurilmalar va operatsion tizim', 'Tez yozish (touch typing)', 'Fayl va papkalar'] },
      { title: 'Internet va xavfsizlik', topics: ['Brauzer va qidiruv', 'Elektron pochta', 'Parollar, 2FA, firibgarlikdan himoya'] },
      { title: 'Ofis dasturlari', topics: ['Word: hujjatlar', 'Excel: jadval va formulalar', 'PowerPoint: taqdimot'] },
      { title: 'Mantiq va yakuniy loyiha', topics: ['Algoritmik fikrlash', 'Mini loyiha va taqdimot'] },
    ],
  },
  {
    slug: 'ai',
    image: '/images/course-ai.webp',
    title: 'Sun’iy intellekt (AI)',
    short: 'AI',
    subtitle: 'ChatGPT, Claude va boshqa AI vositalari bilan o‘qish, ishlash va ijod qilishni o‘rganing.',
    duration: '3 oy',
    months: 3,
    level: 'Boshlang‘ich',
    audiences: ['teens', 'adults'],
    ages: '12 yoshdan',
    accent: 'from-violet-600 via-purple-600 to-fuchsia-600',
    tags: ['ChatGPT', 'Claude', 'Prompt', 'AI rasm', 'Avtomatlashtirish'],
    outcomes: [
      'AI qanday ishlashini oddiy tilda tushunish',
      'Professional prompt yozish (prompt engineering)',
      'AI bilan matn, rasm, video va taqdimot yaratish',
      'O‘qish va ishda AI yordamchidan foydalanish',
      'Kundalik vazifalarni AI bilan avtomatlashtirish',
    ],
    result: 'AI vositalarini o‘qish, ish va biznesda samarali qo‘llaydi.',
    forWhom: ['O‘quvchi va talabalar', 'Ofis xodimlari va tadbirkorlar', 'Kontent yaratuvchilar'],
    modules: [
      { title: 'AI asoslari', topics: ['AI, ML va LLM nima', 'AI xavfsizligi va etikasi'] },
      { title: 'Prompt engineering', topics: ['Prompt tuzilmasi', 'Rol, kontekst va namunalar', 'Natijani tekshirish'] },
      { title: 'AI bilan ijod', topics: ['Rasm va dizayn generatsiyasi', 'Video va ovoz', 'Taqdimot va hujjatlar'] },
      { title: 'AI ishda', topics: ['Avtomatlashtirish', 'AI yordamchi va agentlar', 'Yakuniy loyiha'] },
    ],
  },
  {
    slug: 'youtube',
    image: '/images/course-youtube.webp',
    title: 'YouTube va kontent yaratish',
    short: 'YouTube',
    subtitle: 'Kanal ochishdan montaj va monetizatsiyagacha — o‘z auditoriyangizni yarating.',
    duration: '3 oy',
    months: 3,
    level: 'Boshlang‘ich',
    audiences: ['teens', 'adults'],
    ages: '12 yoshdan',
    accent: 'from-rose-500 via-red-500 to-orange-500',
    tags: ['Ssenariy', 'Suratga olish', 'Montaj', 'Thumbnail', 'SEO'],
    outcomes: [
      'Kanal g‘oyasi, nisha va kontent rejasi',
      'Telefon va kamerada sifatli suratga olish',
      'Professional montaj, ovoz va subtitrlar',
      'E’tiborni tortadigan thumbnail va sarlavhalar',
      'YouTube SEO, analitika va monetizatsiya',
    ],
    result: 'O‘z kanalini ishga tushiradi va muntazam sifatli video chiqaradi.',
    forWhom: ['Blogger bo‘lishni xohlaganlar', 'Biznesini video orqali rivojlantiruvchilar', 'Montajchi bo‘lib ishlashni istaganlar'],
    modules: [
      { title: 'Kanal strategiyasi', topics: ['Nisha va auditoriya', 'Kontent reja', 'Ssenariy yozish'] },
      { title: 'Suratga olish', topics: ['Kamera va yorug‘lik', 'Ovoz yozish', 'Shorts va vertikal video'] },
      { title: 'Montaj', topics: ['Montaj dasturlari', 'Rang, ovoz, subtitr', 'AI vositalari bilan montaj'] },
      { title: 'O‘sish va daromad', topics: ['Thumbnail va sarlavha', 'SEO va analitika', 'Monetizatsiya va reklama'] },
    ],
  },
  {
    slug: 'fullstack',
    image: '/images/course-fullstack.webp',
    title: 'Fullstack dasturlash (AI integrated)',
    short: 'Fullstack',
    subtitle: '6 oyda noldan Fullstack Developer: frontend, backend, ma’lumotlar bazasi va AI integratsiyasi.',
    duration: '6 oy',
    months: 6,
    level: 'Noldan',
    audiences: ['teens', 'adults'],
    ages: '14 yoshdan',
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    tags: ['HTML/CSS', 'JavaScript', 'React', 'Node.js', 'PostgreSQL', 'AI API'],
    outcomes: [
      'Zamonaviy, moslashuvchan web sahifalar yaratish',
      'JavaScript va TypeScript’ni chuqur tushunish',
      'React bilan interfeys, Node.js bilan backend',
      'Ma’lumotlar bazasi, autentifikatsiya va xavfsizlik',
      'Ilovalarga AI (LLM) imkoniyatlarini qo‘shish',
      'Real loyihalardan iborat portfolio va deploy',
    ],
    result: '6 oyda ishga tayyor Fullstack Developer bo‘ladi va portfolio bilan chiqadi.',
    forWhom: ['Dasturchi bo‘lishni maqsad qilganlar', 'Kasbini o‘zgartirmoqchi bo‘lgan kattalar', 'Kuchli o‘smirlar (14+)'],
    featured: true,
    modules: [
      { title: '1–2 oy: Frontend asoslari', topics: ['HTML, CSS, Flexbox, Grid', 'JavaScript', 'Git va GitHub'] },
      { title: '3 oy: React', topics: ['Komponentlar va hooks', 'Routing va formalar', 'TypeScript'] },
      { title: '4–5 oy: Backend', topics: ['Node.js va REST API', 'PostgreSQL', 'Auth va xavfsizlik'] },
      { title: '6 oy: AI va production', topics: ['LLM API integratsiyasi', 'Deploy va CI/CD', 'Yakuniy loyiha va portfolio'] },
    ],
  },
]

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug)

export const phones = ['+998 91 218 00 08', '+998 91 216 66 66']
export const telHref = (p: string) => 'tel:' + p.replace(/\s/g, '')
