// NOTE: Course content, prices, mentors and reviews below are placeholder data
// for the UI. Replace them with real data (or load from a CMS/API) before launch.

export type Level = 'Boshlang‘ich' | 'O‘rta' | 'Yuqori'

export type CategoryId = 'frontend' | 'backend' | 'mobile' | 'design' | 'data' | 'basics'

export interface Category {
  id: CategoryId
  name: string
  short: string
}

export interface Lesson {
  title: string
  minutes: number
  free?: boolean
}

export interface Module {
  title: string
  lessons: Lesson[]
}

export interface Mentor {
  name: string
  role: string
  years: number
  initials: string
}

export interface Course {
  slug: string
  title: string
  subtitle: string
  category: CategoryId
  level: Level
  months: number
  lessons: number
  hours: number
  projects: number
  students: number
  rating: number
  reviews: number
  price: number
  oldPrice?: number
  bestseller?: boolean
  isNew?: boolean
  accent: string // tailwind gradient classes for the cover
  tags: string[]
  outcomes: string[]
  requirements: string[]
  mentor: Mentor
  modules: Module[]
}

export const categories: Category[] = [
  { id: 'frontend', name: 'Frontend', short: 'Web interfeyslar' },
  { id: 'backend', name: 'Backend', short: 'Server va API' },
  { id: 'mobile', name: 'Mobil', short: 'iOS va Android' },
  { id: 'design', name: 'Dizayn', short: 'UI/UX va grafika' },
  { id: 'data', name: 'Data va AI', short: 'Tahlil va ML' },
  { id: 'basics', name: 'Asoslar', short: 'Noldan boshlash' },
]

const mod = (title: string, items: [string, number, boolean?][]): Module => ({
  title,
  lessons: items.map(([t, m, f]) => ({ title: t, minutes: m, free: f })),
})

export const courses: Course[] = [
  {
    slug: 'frontend-react',
    title: 'Frontend dasturlash: React va TypeScript',
    subtitle: 'HTML’dan production-darajadagi React ilovalarigacha — 6 oyda portfolio bilan.',
    category: 'frontend',
    level: 'Boshlang‘ich',
    months: 6,
    lessons: 142,
    hours: 96,
    projects: 8,
    students: 3420,
    rating: 4.9,
    reviews: 812,
    price: 2490000,
    oldPrice: 3290000,
    bestseller: true,
    accent: 'from-indigo-500 via-violet-500 to-fuchsia-500',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Git'],
    outcomes: [
      'Zamonaviy, moslashuvchan (responsive) web sahifalar yaratish',
      'JavaScript va TypeScript’ni chuqur tushunish',
      'React, React Router va state management bilan ishlash',
      'REST API bilan ishlash va autentifikatsiya qilish',
      'Loyihani Vercel’ga deploy qilish va Git bilan jamoada ishlash',
      'Ish suhbatiga tayyor 8 ta loyihali portfolio',
    ],
    requirements: ['Kompyuter va internet', 'Dasturlash tajribasi shart emas', 'Haftasiga 8–10 soat vaqt'],
    mentor: { name: 'Aziz Karimov', role: 'Senior Frontend Engineer', years: 8, initials: 'AK' },
    modules: [
      mod('HTML va CSS asoslari', [['Kursga kirish va o‘qish tartibi', 8, true], ['HTML struktura va semantika', 22, true], ['CSS: selektorlar, box model', 28], ['Flexbox va Grid', 35], ['Responsive dizayn', 30]]),
      mod('JavaScript', [['O‘zgaruvchilar va turlar', 25], ['Funksiyalar va scope', 32], ['DOM bilan ishlash', 40], ['Asinxron JS: Promise, async/await', 38], ['Fetch va REST API', 34]]),
      mod('React', [['Komponentlar va JSX', 30], ['State va props', 36], ['Hooks chuqur', 44], ['React Router', 28], ['Formalar va validatsiya', 32]]),
      mod('TypeScript va production', [['TypeScript asoslari', 30], ['React + TypeScript', 36], ['Testlash asoslari', 26], ['Deploy va CI/CD', 22], ['Yakuniy loyiha', 60]]),
    ],
  },
  {
    slug: 'backend-python',
    title: 'Backend dasturlash: Python va Django',
    subtitle: 'Python, Django, REST API, PostgreSQL va Docker bilan real backend tizimlar.',
    category: 'backend',
    level: 'Boshlang‘ich',
    months: 7,
    lessons: 158,
    hours: 110,
    projects: 6,
    students: 2860,
    rating: 4.8,
    reviews: 604,
    price: 2690000,
    oldPrice: 3490000,
    bestseller: true,
    accent: 'from-emerald-500 via-teal-500 to-cyan-500',
    tags: ['Python', 'Django', 'DRF', 'PostgreSQL', 'Docker', 'Linux'],
    outcomes: [
      'Python’da toza va tushunarli kod yozish',
      'Django va Django REST Framework bilan API yaratish',
      'PostgreSQL ma’lumotlar bazasini loyihalash',
      'Autentifikatsiya, ruxsatlar va xavfsizlik amaliyotlari',
      'Docker va Linux serverga deploy qilish',
      'Telegram bot va to‘lov tizimlarini integratsiya qilish',
    ],
    requirements: ['Kompyuter va internet', 'Dasturlash tajribasi shart emas', 'Haftasiga 10 soat vaqt'],
    mentor: { name: 'Dilshod Rahimov', role: 'Backend Team Lead', years: 9, initials: 'DR' },
    modules: [
      mod('Python asoslari', [['Kirish va muhitni sozlash', 12, true], ['Ma’lumot turlari', 26, true], ['Funksiyalar va modullar', 30], ['OOP', 42]]),
      mod('Ma’lumotlar bazasi', [['SQL asoslari', 34], ['PostgreSQL', 36], ['ORM tushunchasi', 28]]),
      mod('Django', [['Loyiha tuzilmasi', 30], ['Modellar va migratsiyalar', 34], ['DRF bilan API', 46], ['Autentifikatsiya va JWT', 38]]),
      mod('DevOps asoslari', [['Linux buyruqlari', 28], ['Docker', 40], ['Deploy va monitoring', 32], ['Yakuniy loyiha', 60]]),
    ],
  },
  {
    slug: 'nodejs-backend',
    title: 'Node.js va NestJS bilan Backend',
    subtitle: 'JavaScript’da yuqori yuklamali API va mikroservislar yaratishni o‘rganing.',
    category: 'backend',
    level: 'O‘rta',
    months: 5,
    lessons: 118,
    hours: 84,
    projects: 5,
    students: 1240,
    rating: 4.8,
    reviews: 231,
    price: 2290000,
    isNew: true,
    accent: 'from-lime-500 via-green-500 to-emerald-600',
    tags: ['Node.js', 'NestJS', 'TypeScript', 'MongoDB', 'Redis'],
    outcomes: ['Node.js runtime’ni chuqur tushunish', 'NestJS bilan modulli arxitektura', 'MongoDB va Redis bilan ishlash', 'WebSocket va real-time ilovalar', 'Testlash va dokumentatsiya (Swagger)'],
    requirements: ['JavaScript asoslarini bilish', 'Haftasiga 8 soat vaqt'],
    mentor: { name: 'Sardor Tursunov', role: 'Software Architect', years: 10, initials: 'ST' },
    modules: [
      mod('Node.js ichidan', [['Event loop', 24, true], ['Modullar va npm', 20], ['Express asoslari', 34]]),
      mod('NestJS', [['Modullar, controller, service', 36], ['Validatsiya va pipe’lar', 28], ['Auth va guard’lar', 34]]),
      mod('Ma’lumotlar va masshtab', [['MongoDB', 32], ['Redis va kesh', 26], ['Mikroservislar', 40], ['Yakuniy loyiha', 55]]),
    ],
  },
  {
    slug: 'flutter-mobile',
    title: 'Flutter: iOS va Android ilovalar',
    subtitle: 'Bitta kod bazasi bilan ikki platformaga chiroyli mobil ilovalar yarating.',
    category: 'mobile',
    level: 'Boshlang‘ich',
    months: 6,
    lessons: 130,
    hours: 92,
    projects: 6,
    students: 1980,
    rating: 4.9,
    reviews: 402,
    price: 2390000,
    oldPrice: 2990000,
    accent: 'from-sky-500 via-blue-500 to-indigo-600',
    tags: ['Dart', 'Flutter', 'Firebase', 'BLoC', 'REST API'],
    outcomes: ['Dart tilini noldan o‘rganish', 'Flutter widget’lari va animatsiyalar', 'BLoC bilan state management', 'Firebase, push-bildirishnomalar', 'App Store va Google Play’ga chiqarish'],
    requirements: ['Kompyuter (8 GB RAM tavsiya)', 'Tajriba shart emas'],
    mentor: { name: 'Jasur Aliyev', role: 'Lead Mobile Developer', years: 7, initials: 'JA' },
    modules: [
      mod('Dart', [['Kirish', 10, true], ['Sintaksis va turlar', 28, true], ['OOP va asinxronlik', 36]]),
      mod('Flutter UI', [['Widget’lar', 34], ['Layout va tema', 30], ['Animatsiyalar', 32]]),
      mod('Arxitektura', [['BLoC', 42], ['API va kesh', 34], ['Firebase', 30], ['Do‘konlarga chiqarish', 26]]),
    ],
  },
  {
    slug: 'ui-ux-design',
    title: 'UI/UX dizayn: Figma’dan portfoliogacha',
    subtitle: 'Foydalanuvchi tadqiqotidan tayyor prototipgacha — dizayner bo‘lib ishlang.',
    category: 'design',
    level: 'Boshlang‘ich',
    months: 4,
    lessons: 86,
    hours: 58,
    projects: 5,
    students: 2310,
    rating: 4.9,
    reviews: 517,
    price: 1890000,
    oldPrice: 2490000,
    bestseller: true,
    accent: 'from-rose-500 via-pink-500 to-orange-400',
    tags: ['Figma', 'UX research', 'Prototyping', 'Design system'],
    outcomes: ['Figma’da professional ishlash', 'UX tadqiqot va user flow', 'Wireframe va interaktiv prototip', 'Design system yaratish', 'Behance/Dribbble uchun portfolio'],
    requirements: ['Kompyuter va internet', 'Chizish qobiliyati shart emas'],
    mentor: { name: 'Madina Yusupova', role: 'Product Designer', years: 7, initials: 'MY' },
    modules: [
      mod('Dizayn asoslari', [['Kirish', 9, true], ['Kompozitsiya va rang', 26, true], ['Tipografika', 22]]),
      mod('Figma', [['Interfeys va asboblar', 28], ['Auto layout', 30], ['Komponentlar', 32]]),
      mod('UX', [['Tadqiqot', 30], ['User flow', 26], ['Prototip', 28], ['Portfolio', 40]]),
    ],
  },
  {
    slug: 'data-analytics',
    title: 'Data Analytics: SQL, Python va BI',
    subtitle: 'Ma’lumotlardan biznes uchun qaror chiqaradigan tahlilchi bo‘ling.',
    category: 'data',
    level: 'Boshlang‘ich',
    months: 5,
    lessons: 104,
    hours: 72,
    projects: 6,
    students: 1450,
    rating: 4.8,
    reviews: 288,
    price: 2190000,
    isNew: true,
    accent: 'from-amber-500 via-orange-500 to-red-500',
    tags: ['SQL', 'Python', 'Pandas', 'Power BI', 'Excel'],
    outcomes: ['SQL so‘rovlarini erkin yozish', 'Pandas bilan ma’lumot tozalash', 'Power BI’da dashboard yaratish', 'Statistika asoslari', 'Biznes uchun insight taqdim etish'],
    requirements: ['Kompyuter', 'Matematikadan maktab darajasi'],
    mentor: { name: 'Nodira Saidova', role: 'Senior Data Analyst', years: 6, initials: 'NS' },
    modules: [
      mod('Excel va SQL', [['Kirish', 10, true], ['Excel tahlil', 30, true], ['SQL asoslari', 36]]),
      mod('Python tahlil', [['Pandas', 40], ['Vizualizatsiya', 32]]),
      mod('BI', [['Power BI', 38], ['Dashboard loyiha', 50]]),
    ],
  },
  {
    slug: 'ai-machine-learning',
    title: 'Sun’iy intellekt va Machine Learning',
    subtitle: 'ML modellar, LLM va AI agentlar bilan amaliy loyihalar.',
    category: 'data',
    level: 'Yuqori',
    months: 6,
    lessons: 120,
    hours: 90,
    projects: 5,
    students: 860,
    rating: 4.9,
    reviews: 142,
    price: 2990000,
    isNew: true,
    accent: 'from-violet-600 via-purple-600 to-indigo-700',
    tags: ['Python', 'scikit-learn', 'PyTorch', 'LLM', 'RAG'],
    outcomes: ['Klassik ML algoritmlari', 'Neyron tarmoqlar va PyTorch', 'LLM API va prompt engineering', 'RAG va AI agentlar yaratish', 'Modelni production’ga chiqarish'],
    requirements: ['Python’ni bilish', 'Matematika asoslari'],
    mentor: { name: 'Bobur Nazarov', role: 'ML Engineer', years: 8, initials: 'BN' },
    modules: [
      mod('ML asoslari', [['Kirish', 12, true], ['Regressiya va klassifikatsiya', 40]]),
      mod('Deep Learning', [['Neyron tarmoqlar', 44], ['PyTorch', 42]]),
      mod('LLM va agentlar', [['LLM API', 34], ['RAG', 40], ['Agentlar', 46]]),
    ],
  },
  {
    slug: 'kompyuter-savodxonligi',
    title: 'Kompyuter savodxonligi va IT asoslari',
    subtitle: 'IT olamiga birinchi qadam: kompyuter, ofis dasturlari va algoritmik fikrlash.',
    category: 'basics',
    level: 'Boshlang‘ich',
    months: 2,
    lessons: 48,
    hours: 30,
    projects: 3,
    students: 4120,
    rating: 4.8,
    reviews: 903,
    price: 590000,
    accent: 'from-slate-600 via-slate-700 to-slate-900',
    tags: ['Windows', 'Word', 'Excel', 'Internet xavfsizligi', 'Algoritmlar'],
    outcomes: ['Kompyuter bilan ishonchli ishlash', 'Word, Excel, PowerPoint', 'Internetda xavfsiz ishlash', 'Algoritmik fikrlash asoslari'],
    requirements: ['Hech qanday tajriba talab qilinmaydi'],
    mentor: { name: 'Shahzoda Ergasheva', role: 'IT o‘qituvchi', years: 6, initials: 'SE' },
    modules: [
      mod('Kompyuter', [['Kirish', 8, true], ['Fayl tizimi', 20, true]]),
      mod('Ofis', [['Word', 26], ['Excel', 32], ['PowerPoint', 22]]),
      mod('Xavfsizlik', [['Parollar va 2FA', 18], ['Firibgarlikdan himoya', 20]]),
    ],
  },
  {
    slug: 'graphic-design',
    title: 'Grafik dizayn va brending',
    subtitle: 'Logotip, brend identika va ijtimoiy tarmoqlar uchun dizayn.',
    category: 'design',
    level: 'Boshlang‘ich',
    months: 3,
    lessons: 70,
    hours: 46,
    projects: 6,
    students: 1730,
    rating: 4.7,
    reviews: 356,
    price: 1490000,
    accent: 'from-yellow-400 via-amber-500 to-orange-600',
    tags: ['Photoshop', 'Illustrator', 'Brending', 'SMM dizayn'],
    outcomes: ['Photoshop va Illustrator', 'Logotip va brend identika', 'SMM uchun kreativlar', 'Frilans buyurtmalar bilan ishlash'],
    requirements: ['Kompyuter', 'Tajriba shart emas'],
    mentor: { name: 'Kamola Ismoilova', role: 'Art Director', years: 9, initials: 'KI' },
    modules: [
      mod('Asoslar', [['Kirish', 8, true], ['Rang va kompozitsiya', 24, true]]),
      mod('Dasturlar', [['Photoshop', 36], ['Illustrator', 36]]),
      mod('Brending', [['Logotip', 30], ['Brendbuk', 32], ['Portfolio', 30]]),
    ],
  },
]

export const getCourse = (slug: string) => courses.find((c) => c.slug === slug)

export const formatPrice = (n: number) =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' so‘m'

export const monthly = (c: Course) => Math.round(c.price / c.months / 1000) * 1000
