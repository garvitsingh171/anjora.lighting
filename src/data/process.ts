export interface ProcessStage {
  number: string
  title: string
  description: string
}

export const processStages: ProcessStage[] = [
  {
    number: '01',
    title: 'Concept',
    description: 'We read the architecture, movement, material palette and intended atmosphere to establish a clear lighting concept.',
  },
  {
    number: '02',
    title: 'Consultation',
    description: 'We understand the architecture, function, mood, constraints and project goals before defining the lighting strategy.',
  },
  {
    number: '03',
    title: 'Detail Design & Planning',
    description: 'Layouts, calculations, controls, fixture schedules and technical details turn the concept into a coordinated project plan.',
  },
  {
    number: '04',
    title: 'Execution',
    description: 'Site coordination, focusing, programming, testing and commissioning protect the design intent through handover.',
  },
]
