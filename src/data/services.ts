import consultancyImage from '../assets/services/consultancy.webp'
import designImage from '../assets/services/design.webp'
import sourcingImage from '../assets/images/service-sourcing.png'
import executionImage from '../assets/images/service-execution.png'
import turnKeyImage from '../assets/services/turn-key.webp'
import managementImage from '../assets/services/management.webp'
import liaisonImage from '../assets/services/liaison.webp'

export interface Service {
  id: string
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
  objectPosition?: string
  capabilities: string[]
}

export const services: Service[] = [
  {
    id: 'lighting-consultancy',
    number: '01',
    title: 'Lighting Consultancy',
    description: 'We read the architecture, programme and atmosphere before defining a lighting strategy that makes every decision feel intentional.',
    image: consultancyImage,
    imageAlt: 'Design team reviewing architectural drawings together',
    objectPosition: 'center 54%',
    capabilities: ['Project discovery', 'Lighting strategy', 'Budget guidance'],
  },
  {
    id: 'lighting-procurement',
    number: '02',
    title: 'Lighting Procurement',
    description: 'We align luminaire selection, optics, output and finish with the approved design, then coordinate sourcing and delivery with the project team.',
    image: sourcingImage,
    imageAlt: 'Project specialists discussing technical lighting specifications and sourcing',
    capabilities: ['Fixture schedules', 'Sample review', 'Vendor coordination'],
  },
  {
    id: 'lighting-design',
    number: '03',
    title: 'Lighting Design',
    description: 'Concept, calculations and detailed planning are resolved as one system—balancing visual comfort, hierarchy, energy use and atmosphere.',
    image: designImage,
    imageAlt: 'Architectural plans and laptop used for a design review',
    objectPosition: 'center 58%',
    capabilities: ['Concept design', 'Lux planning', 'Control strategy'],
  },
  {
    id: 'turn-key-projects',
    number: '04',
    title: 'Turn-Key Projects',
    description: 'We coordinate the lighting work from approved design through on-site integration, testing and final commissioning.',
    image: turnKeyImage,
    imageAlt: 'Completed commercial interior with integrated architectural lighting',
    capabilities: ['Site coordination', 'Installation oversight', 'Commissioning'],
  },
  {
    id: 'lighting-audit',
    number: '05',
    title: 'Lighting Audit',
    description: 'We assess existing light levels, distribution and fixture performance to identify practical improvements to comfort, efficiency and visual quality.',
    image: executionImage,
    imageAlt: 'Lighting specialists reviewing measured illumination and project documentation',
    capabilities: ['Site assessment', 'Performance review', 'Upgrade guidance'],
  },
  {
    id: 'light-management',
    number: '06',
    title: 'Light Management',
    description: 'Control scenes, programming and ongoing system attention help the installed lighting continue to perform as intended.',
    image: managementImage,
    imageAlt: 'Lighting control software in use during a live lighting setup',
    objectPosition: '30% center',
    capabilities: ['Scene programming', 'Controls', 'System support'],
  },
  {
    id: 'international-liaison',
    number: '07',
    title: 'International Liaison',
    description: 'We connect project teams with specialist lighting expertise and coordinate technical information across locations and collaborators.',
    image: liaisonImage,
    imageAlt: 'Design and construction professionals coordinating over project plans',
    capabilities: ['Technical coordination', 'Specialist network', 'Project communication'],
  },
]
