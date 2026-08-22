import { CreateWorldData } from '@/types/create';

export const CREATE_DATA: CreateWorldData = {
  themeStatement: 'Not everything I create has code in it.',
  overview:
    'Beyond software and mathematics exists a rich spectrum of acoustic, tactile, and visual artistic practices. These disciplines ground analytical thinking in organic rhythm, deliberate craftsmanship, and creative experimentation.',
  categories: {
    music: [
      {
        id: 'piano',
        category: 'music',
        name: 'Piano & Keyboards',
        medium: 'Polyphonic Counterpoint & Harmonic Architecture',
        description:
          'Navigating layered polyphonic voices, dynamic touch sensitivity, and classical phrasing alongside contemporary minimalism.',
        creativePhilosophy:
          'Translating intricate mathematical structures into real-time physical coordination and emotional contour.',
        visualMetaphor: 'Architectural resonance in black & white',
        studioNotes: ['Touch Sensitivity', 'Polyphonic Independence', 'Sight Reading & Phrasing'],
      },
      {
        id: 'flute',
        category: 'music',
        name: 'Flute & Wind Acoustics',
        medium: 'Breath Pressure & Pure Embouchure Intonation',
        description:
          'Acoustic resonance shaped directly by embouchure and breath cadence. Expressing fluid modal melodies and microtonal nuances.',
        creativePhilosophy:
          'Direct mind-to-instrument airflow; teaches subtle listening and breath discipline.',
        visualMetaphor: 'Acoustic waveform suspended in space',
        studioNotes: ['Microtone Control', 'Breath Discipline', 'Acoustic Resonance'],
      },
      {
        id: 'singing',
        category: 'music',
        name: 'Vocal Phrasing & Pitch Intonation',
        medium: 'Acoustic Resonance & Breath Support',
        description:
          'Exploring pitch accuracy, harmonic overtones, and expressive vocal dynamics.',
        creativePhilosophy:
          'Direct, unmediated vocal expression anchoring mental state in somatic resonance.',
        visualMetaphor: 'The human instrument as natural harmonic resonator',
        studioNotes: ['Pitch Precision', 'Vocal Resonance', 'Dynamic Range'],
      },
    ],
    art: [
      {
        id: 'drawing',
        category: 'art',
        name: 'Drawing & Spatial Composition',
        medium: 'Graphite & Ink Linework',
        description:
          'Observational sketching, contour line drawing, and study of light, shade, and spatial perspective.',
        creativePhilosophy:
          'Learning to see raw geometric forms and negative space before applying detail.',
        visualMetaphor: 'The single continuous line capturing perspective',
        studioNotes: ['Negative Space', 'Value Contrast', 'Spatial Perspective'],
      },
      {
        id: 'quilling',
        category: 'art',
        name: 'Paper Quilling & Filigree Relief',
        medium: 'Coiled Paper Strips & Concentric Relief Geometries',
        description:
          'Manipulating delicate paper strips into intricate coiled patterns, concentric geometries, and tactile reliefs.',
        creativePhilosophy:
          'Millimeter-scale patience and deliberate assembly of fragile components into structural permanence.',
        visualMetaphor: 'Concentric spirals interlocking under light and shadow',
        studioNotes: ['Micron Precision', 'Geometric Symmetry', 'Tactile Patience'],
      },
      {
        id: 'visual-creation',
        category: 'art',
        name: 'Visual & Graphic Design',
        medium: 'Digital Spatial Design & Typography Systems',
        description:
          'Experimenting with high-contrast typography, asymmetrical grids, and editorial composition.',
        creativePhilosophy:
          'Visual hierarchy is visual logic: clarity of form directs human attention.',
        visualMetaphor: 'Minimalist editorial composition in deep contrast',
        studioNotes: ['Typographic Rhythm', 'Grid Alignment', 'Asymmetry'],
      },
    ],
  },
};
