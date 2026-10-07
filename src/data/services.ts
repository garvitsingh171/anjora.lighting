import consultancyImage from '../assets/images/service-consultancy.png'
import designImage from '../assets/images/service-design.png'
import sourcingImage from '../assets/images/service-sourcing.png'
import executionImage from '../assets/images/service-execution.png'

export interface Service {
  id: string
  number: string
  title: string
  description: string
  image: string
  imageAlt: string
  capabilities: string[]
}

export const services: Service[] = [
  {
    id: 'lighting-consultancy',
    number: '01',
    title: 'Lighting Consultancy',
    description: 'We read the architecture, programme and atmosphere before defining a lighting strategy that makes every decision feel intentional.',
    image: consultancyImage,
    imageAlt: 'Lighting consultants reviewing architectural drawings and illumination studies',
    capabilities: ['Project discovery', 'Lighting strategy', 'Budget guidance'],
  },
  {
    id: 'lighting-design',
    number: '02',
    title: 'Lighting Design',
    description: 'Concept, calculations and detailed planning are resolved as one system—balancing visual comfort, hierarchy, energy and mood.',
    image: designImage,
    imageAlt: 'Lighting designers working across plans, photometric studies and sample fixtures',
    capabilities: ['Concept design', 'Lux planning', 'Control strategy'],
  },
  {
    id: 'product-specification',
    number: '03',
    title: 'Product Specification & Sourcing',
    description: 'We identify the right optics, output, finish and control compatibility, then coordinate reliable sourcing around the design intent.',
    image: sourcingImage,
    imageAlt: 'Project and site specialists coordinating a lighting handover',
    capabilities: ['Fixture schedules', 'Vendor coordination', 'Mock-ups'],
  },
  {
    id: 'execution-management',
    number: '04',
    title: 'Execution & Lighting Management',
    description: 'From site coordination to focusing, programming and commissioning, we protect the lighting concept through the final switch-on.',
    image: executionImage,
    imageAlt: 'Lighting professionals reviewing measured performance and commissioning data',
    capabilities: ['Site coordination', 'Focusing & scenes', 'Commissioning'],
  },
]
