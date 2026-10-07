import clubsImage from '../assets/images/project-kingsman.jpg'
import heritageImage from '../assets/images/project-city-palace.jpg'
import officesImage from '../assets/images/project-offices.jpg'
import hospitalityImage from '../assets/images/project-hotels.jpg'
import institutionsImage from '../assets/images/project-institutions.jpg'

export type ProjectCategory = 'Clubs' | 'Heritage' | 'Offices' | 'Hotels' | 'Institutions'

export interface Project {
  slug: string
  title: string
  category: ProjectCategory
  location?: string
  year?: string
  image: string
  imageAlt: string
  summary: string
}

export const projects: Project[] = [
  {
    slug: 'kingsman',
    title: 'Kingsman',
    category: 'Clubs',
    location: 'Malviya Nagar, Jaipur',
    image: clubsImage,
    imageAlt: 'Kingsman rooftop lounge illuminated at dusk',
    summary: 'A responsive, scene-led lighting experience balancing the lounge’s energy with clear architectural rhythm.',
  },
  {
    slug: 'city-palace',
    title: 'City Palace',
    category: 'Heritage',
    location: 'Jaipur',
    image: heritageImage,
    imageAlt: 'The illuminated Mubarak Mahal at City Palace in Jaipur at night',
    summary: 'Warm, glare-controlled light reveals the palace’s carved surfaces while respecting its historic character.',
  },
  {
    slug: 'office-three',
    title: 'Office 03',
    category: 'Offices',
    image: officesImage,
    imageAlt: 'Contemporary office and fitness environment with integrated linear lighting',
    summary: 'Layered task and ambient light brings clarity, visual comfort and identity to a contemporary workplace.',
  },
  {
    slug: 'hospitality-study',
    title: 'Hospitality Study',
    category: 'Hotels',
    image: hospitalityImage,
    imageAlt: 'Warm contemporary hospitality interior articulated by integrated lighting',
    summary: 'A warm architectural lighting study where concealed lines, decorative elements and surfaces work as one composition.',
  },
  {
    slug: 'gym-ajmer',
    title: 'Gym — Ajmer',
    category: 'Institutions',
    location: 'Ajmer',
    image: institutionsImage,
    imageAlt: 'Modern training facility with circular and linear ceiling lighting',
    summary: 'High-performance illumination shaped for orientation, comfort and a confident spatial identity.',
  },
]
