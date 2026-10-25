// Video testimonials.
//
// How to add a video:
//  1. Self-hosted (recommended, fastest): put the file in `public/videos/`
//     (e.g. public/videos/ali.mp4, ideally vertical 9:16, H.264, under ~15 MB)
//     and an optional cover image (public/videos/ali.jpg). Then set
//     `src: '/videos/ali.mp4'` and `poster: '/videos/ali.jpg'`.
//  2. YouTube (Shorts or regular): set `youtubeId: 'VIDEO_ID'` — the part after
//     youtube.com/shorts/ or watch?v=.
// Fill in name / age / course / quote. Entries without a video show as
// "tez orada" placeholders, so the layout stays intact until videos arrive.

export interface VideoTestimonial {
  name?: string
  age?: number
  course?: string
  role?: string
  quote?: string
  src?: string
  poster?: string
  youtubeId?: string
}

export const studentVideos: VideoTestimonial[] = [
  { course: 'Fullstack' },
  { course: 'AI' },
  { course: 'Foundation' },
  { course: 'YouTube' },
  { course: 'Fullstack' },
]

export const parentVideos: VideoTestimonial[] = [
  { role: 'Ota-ona' },
  { role: 'Ota-ona' },
  { role: 'Ota-ona' },
  { role: 'Ota-ona' },
]
