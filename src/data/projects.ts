const projectAssets = import.meta.glob('../assets/projects/**/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

export const projectCategories = [
  'Clubs',
  'Heritage',
  'Commercial',
  'Facade',
  'Gym',
  'Office',
  'Theatre',
] as const

export type ProjectCategory = (typeof projectCategories)[number]

export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectFact {
  label: string
  value: string
}

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  location?: string
  status?: string
  description?: string[]
  facts?: ProjectFact[]
  sourceUrl: string
  cover: ProjectImage
  gallery: ProjectImage[]
}

function asset(project: string, filename: string) {
  const key = `../assets/projects/${project}/${filename}`
  const source = projectAssets[key]
  if (!source) throw new Error(`Missing project asset: ${key}`)
  return source
}

function image(project: string, filename: string, alt: string): ProjectImage {
  return { src: asset(project, filename), alt }
}

export const projects: Project[] = [
  {
    slug: 'kingsman',
    title: 'Kingsman',
    category: 'Clubs',
    location: 'Malviya Nagar, Jaipur',
    description: [
      'At Kingsman Club in Malviya Nagar, Jaipur, the lighting experience was designed to set the vibe from the moment guests arrive.',
      'Decorative statement lighting and landscape highlights are paired with RGBW lighting and Madrix-controlled programs. Dynamic colour scenes, transitions and beat-synchronised effects let the space move between a relaxed lounge atmosphere and a high-energy club environment.',
    ],
    sourceUrl: 'https://anjora.lighting/',
    cover: image('kingsman', 'cover.jpg', 'Kingsman Club illuminated at night'),
    gallery: [],
  },
  {
    slug: 'city-palace',
    title: 'City Palace',
    category: 'Heritage',
    location: 'Jaipur',
    description: [
      'The heritage lighting consultancy for City Palace, Jaipur, is shaped around a warm, royal and timeless atmosphere.',
      'Careful colour-temperature and fixture selection reveals stone, arches, carvings and artwork without over-lighting the architecture. Considered beam angles, glare-free fixtures and balanced warm-white tones preserve the character of the palace after dark.',
    ],
    sourceUrl: 'https://anjora.lighting/',
    cover: image('city-palace', 'cover.jpg', 'Mubarak Mahal at City Palace illuminated at night'),
    gallery: [],
  },
  {
    slug: 'rosado',
    title: 'Rosado',
    category: 'Clubs',
    location: 'Jaipur',
    description: ['At 135 feet tall, Rosado brings together 35,000 square feet of lounge and dining in Jaipur.'],
    facts: [{ label: 'Designer', value: 'Shubham Khandelwal' }],
    sourceUrl: 'https://anjora.lighting/project/rosado/',
    cover: image('rosado', 'cover.jpeg', 'Rosado lounge and dining interior'),
    gallery: [
      image('rosado', 'gallery-01.jpeg', 'Rosado terrace at night'),
      image('rosado', 'gallery-02.jpg', 'Rosado illuminated exterior'),
      image('rosado', 'gallery-03.jpg', 'Rosado interior lighting detail'),
      image('rosado', 'gallery-04.jpg', 'Rosado bar lighting'),
      image('rosado', 'gallery-05.jpg', 'Rosado lounge lighting view'),
      image('rosado', 'gallery-06.jpg', 'Rosado dining lighting view'),
      image('rosado', 'gallery-07.jpg', 'Rosado interior lighting composition'),
      image('rosado', 'gallery-08.jpg', 'Rosado hospitality interior'),
      image('rosado', 'gallery-09.jpg', 'Rosado lighting feature'),
    ],
  },
  {
    slug: 'office-1',
    title: 'Office 1',
    category: 'Office',
    description: [
      'The Card Design Co. needed an office where the light could change with the colours of the cards, helping clients experience the work in context. The office lighting was designed to create an easy, comfortable setting for client conversations.',
    ],
    sourceUrl: 'https://anjora.lighting/project/office-1/',
    cover: image('office-1', 'cover.jpg', 'Office 1 interior with integrated lighting'),
    gallery: [
      image('office-1', 'gallery-01.jpg', 'Office 1 workspace lighting'),
      image('office-1', 'gallery-02.jpg', 'Office 1 lighting detail'),
    ],
  },
  {
    slug: 'facade-3',
    title: 'Facade 3',
    category: 'Facade',
    sourceUrl: 'https://anjora.lighting/project/facade-3/',
    cover: image('facade-3', 'cover.jpg', 'Facade 3 architectural lighting'),
    gallery: [image('facade-3', 'gallery-01.jpg', 'Facade 3 exterior lighting view')],
  },
  {
    slug: 'turmeric',
    title: 'Turmeric',
    category: 'Commercial',
    description: [
      'A magnetic track system provides flexible lighting without the need for multiple separate systems. Spotlights can be repositioned manually or through a DALI-controlled installation.',
      'The scheme can create accent and drama around products or provide uniform brightness when needed, while a high colour-rendering index helps preserve the true colours of the merchandise.',
    ],
    sourceUrl: 'https://anjora.lighting/project/turmeric/',
    cover: image('turmeric', 'cover.jpg', 'Turmeric retail interior with track lighting'),
    gallery: [],
  },
  {
    slug: 'baramasi',
    title: 'Baramasi',
    category: 'Clubs',
    description: ['A club with a heritage character, designed with chromatic colour that changes when light falls across the surfaces.'],
    sourceUrl: 'https://anjora.lighting/project/baramasi/',
    cover: image('baramasi', 'cover.jpg', 'Peacock-gate lighting feature at Baramasi'),
    gallery: [image('baramasi', 'gallery-01.jpg', 'Baramasi club lighting view')],
  },
  {
    slug: 'gym-ajmer',
    title: 'Gym — Ajmer',
    category: 'Gym',
    location: 'Ajmer',
    sourceUrl: 'https://anjora.lighting/project/gym-ajmer/',
    cover: image('gym-ajmer', 'cover.jpg', 'Gym Ajmer interior lighting'),
    gallery: [
      image('gym-ajmer', 'gallery-01.jpg', 'Gym Ajmer illuminated training area'),
      image('gym-ajmer', 'gallery-02.jpg', 'Gym Ajmer ceiling lighting detail'),
      image('gym-ajmer', 'gallery-03.jpg', 'Gym Ajmer ambient lighting'),
      image('gym-ajmer', 'gallery-04.jpg', 'Gym Ajmer linear lighting view'),
    ],
  },
  {
    slug: 'vr-theme-park',
    title: 'VR Theme Park',
    category: 'Clubs',
    location: 'Jaipur',
    description: ['VR Theme Park brings a new gaming universe and a collection of virtual experiences to Jaipur.'],
    sourceUrl: 'https://anjora.lighting/project/vr-theme-park/',
    cover: image('vr-theme-park', 'cover.jpg', 'VR Theme Park immersive lighting'),
    gallery: [
      image('vr-theme-park', 'gallery-01.jpg', 'VR Theme Park interior lighting'),
      image('vr-theme-park', 'gallery-02.jpg', 'VR Theme Park gaming environment'),
      image('vr-theme-park', 'gallery-03.jpg', 'VR Theme Park colour lighting'),
    ],
  },
  {
    slug: 'code-black',
    title: 'Code Black',
    category: 'Clubs',
    description: ['A rooftop bar and café shaped around hut-like pitched roofs. The lighting design gives the late-night club a vivid, recognisable colour presence against the sky.'],
    sourceUrl: 'https://anjora.lighting/project/code-black/',
    cover: image('code-black', 'cover.jpg', 'Code Black rooftop lighting'),
    gallery: [image('code-black', 'gallery-01.jpg', 'Code Black club lighting view')],
  },
  {
    slug: 'office-2',
    title: 'Office 2',
    category: 'Office',
    status: 'Ongoing',
    sourceUrl: 'https://anjora.lighting/project/office-2/',
    cover: image('office-2', 'cover.jpg', 'Office 2 interior lighting study'),
    gallery: [image('office-2', 'gallery-01.jpg', 'Office 2 workspace lighting')],
  },
  {
    slug: 'facade-2',
    title: 'Facade 2',
    category: 'Facade',
    sourceUrl: 'https://anjora.lighting/project/facade2/',
    cover: image('facade-2', 'cover.jpg', 'Facade 2 architectural lighting'),
    gallery: [image('facade-2', 'gallery-01.jpg', 'Facade 2 exterior lighting view')],
  },
  {
    slug: 'neo',
    title: 'Neo',
    category: 'Clubs',
    sourceUrl: 'https://anjora.lighting/project/neo/',
    cover: image('neo', 'cover.jpeg', 'Neo hospitality interior lighting'),
    gallery: [
      image('neo', 'gallery-01.jpg', 'Neo lighting detail'),
      image('neo', 'gallery-02.jpg', 'Neo interior lighting view'),
    ],
  },
  {
    slug: 'hobs-and-taters',
    title: 'Hobs and Taters',
    category: 'Clubs',
    sourceUrl: 'https://anjora.lighting/project/hobs-and-taters/',
    cover: image('hobs-and-taters', 'cover.jpg', 'Hobs and Taters club lighting'),
    gallery: [
      image('hobs-and-taters', 'gallery-01.jpg', 'Hobs and Taters interior lighting'),
      image('hobs-and-taters', 'gallery-02.jpg', 'Hobs and Taters illuminated interior'),
    ],
  },
  {
    slug: 'ohana',
    title: 'Ohana',
    category: 'Clubs',
    sourceUrl: 'https://anjora.lighting/project/ohana/',
    cover: image('ohana', 'cover.jpg', 'Ohana club lighting'),
    gallery: [
      image('ohana', 'gallery-01.jpg', 'Ohana hospitality lighting detail'),
      image('ohana', 'gallery-02.jpg', 'Ohana interior lighting'),
      image('ohana', 'gallery-03.webp', 'Ohana cocktail bar interior'),
      image('ohana', 'gallery-04.webp', 'Ohana lounge lighting'),
      image('ohana', 'gallery-05.jpg', 'Ohana illuminated seating area'),
    ],
  },
  {
    slug: 'dyore',
    title: 'Dyore',
    category: 'Clubs',
    sourceUrl: 'https://anjora.lighting/project/dyore/',
    cover: image('dyore', 'cover.jpg', 'Dyore club lighting'),
    gallery: [
      image('dyore', 'gallery-01.png', 'Dyore interior lighting view'),
      image('dyore', 'gallery-02.png', 'Dyore hospitality lighting'),
    ],
  },
  {
    slug: 'boozup',
    title: 'Boozup',
    category: 'Clubs',
    sourceUrl: 'https://anjora.lighting/project/boozup/',
    cover: image('boozup', 'cover.webp', 'Boozup bar lighting'),
    gallery: [
      image('boozup', 'gallery-01.png', 'Boozup club interior'),
      image('boozup', 'gallery-02.jpg', 'Boozup lighting detail'),
      image('boozup', 'gallery-03.jpg', 'Boozup bar interior lighting'),
    ],
  },
  {
    slug: 'office-3',
    title: 'Office 3',
    category: 'Office',
    status: 'Ongoing',
    sourceUrl: 'https://anjora.lighting/project/office-3/',
    cover: image('office-3', 'cover.jpg', 'Office 3 interior lighting study'),
    gallery: [image('office-3', 'gallery-01.jpg', 'Office 3 workspace lighting')],
  },
  {
    slug: 'facade-1',
    title: 'Facade 1',
    category: 'Facade',
    sourceUrl: 'https://anjora.lighting/project/facade-1/',
    cover: image('facade-1', 'cover.jpg', 'Facade 1 architectural lighting'),
    gallery: [],
  },
  {
    slug: 'theatre',
    title: 'Theatre',
    category: 'Theatre',
    status: 'Ongoing',
    sourceUrl: 'https://anjora.lighting/project/theatre/',
    cover: image('theatre', 'cover.jpg', 'Theatre interior lighting study'),
    gallery: [image('theatre', 'gallery-01.jpg', 'Theatre lighting view')],
  },
]

export const homeProjects = ['kingsman', 'city-palace', 'office-1', 'turmeric', 'gym-ajmer']
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is Project => Boolean(project))

export function getNextProject(slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length]!
}
