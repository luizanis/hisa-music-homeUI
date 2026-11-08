import type { LocalizedText } from "@/lib/catalog";

/**
 * Mock customer data for the wireframe stage. Nothing here is persisted in the
 * backend: purchases, progress and orders are simulated in the browser so the
 * authenticated experience can be validated before the real integration.
 */

export type MockLesson = {
  id: string;
  title: LocalizedText;
  duration: string;
  description: LocalizedText;
};

export type MockModule = {
  id: string;
  title: LocalizedText;
  lessons: MockLesson[];
};

export type MockCourse = {
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  instructor: string;
  level: LocalizedText;
  purchasedAt: string;
  lastAccessed: string;
  variant: number;
  modules: MockModule[];
};

export type MockOrderItem = {
  slug: string;
  catalog: "academy" | "sounds";
  category: string;
  title: LocalizedText;
  price_cents: number;
  variant: number;
};

export type MockOrder = {
  id: string;
  createdAt: string;
  method: "credit" | "pix";
  status: "paid" | "pending" | "failed" | "refunded";
  discount_cents: number;
  items: MockOrderItem[];
};

export type MockLibraryItem = {
  slug: string;
  title: LocalizedText;
  category: string;
  purchasedAt: string;
  variant: number;
  formats: string[];
  files: number;
  size: string;
  contents: LocalizedText[];
};

export type MockRecommendation = {
  slug: string;
  kind: "course" | "product";
  title: LocalizedText;
  meta: LocalizedText;
  price_cents: number;
};

export const demoProfile = {
  name: "Marina Alves",
  email: "marina.alves@email.com",
  phone: "+55 11 98888 4021",
  city: "São Paulo",
  country: { pt: "Brasil", en: "Brazil" } as LocalizedText,
  birthdate: "1996-04-18",
  memberSince: "2025-03-09",
  lastLogin: "2026-11-04T18:12:00-03:00",
  userId: "HISA-USR-8842",
  plan: { pt: "Acesso digital", en: "Digital access" } as LocalizedText,
  avatarUrl: null as string | null,
};

export const courses: MockCourse[] = [
  {
    slug: "introducao-producao-musical",
    title: {
      pt: "Introdução a Produção Musical",
      en: "Introduction to Music Production",
    },
    description: {
      pt: "Do primeiro beat à exportação: o método completo para produzir com intenção.",
      en: "From the first beat to export: the complete method for producing with intention.",
    },
    instructor: "HISA",
    level: { pt: "Iniciante", en: "Beginner" },
    purchasedAt: "2026-08-14T14:20:00-03:00",
    lastAccessed: "2026-11-03T21:40:00-03:00",
    variant: 1,
    modules: [
      {
        id: "c1-m1",
        title: { pt: "Fundamentos", en: "Foundations" },
        lessons: [
          {
            id: "c1-l1",
            title: { pt: "O que é produção musical", en: "What music production is" },
            duration: "14:20",
            description: {
              pt: "O papel do produtor entre a ideia, o arranjo e a entrega final.",
              en: "The producer's role between the idea, the arrangement and the final delivery.",
            },
          },
          {
            id: "c1-l2",
            title: { pt: "Configurando o DAW", en: "Setting up the DAW" },
            duration: "18:05",
            description: {
              pt: "Template, atalhos e organização de sessão para começar rápido.",
              en: "Template, shortcuts and session organization to start fast.",
            },
          },
        ],
      },
      {
        id: "c1-m2",
        title: { pt: "Ritmo e groove", en: "Rhythm and groove" },
        lessons: [
          {
            id: "c1-l3",
            title: { pt: "Programando bateria", en: "Programming drums" },
            duration: "22:40",
            description: {
              pt: "Kick, snare e hats: construção de levadas no grid.",
              en: "Kick, snare and hats: building patterns on the grid.",
            },
          },
          {
            id: "c1-l4",
            title: { pt: "Swing e microtiming", en: "Swing and microtiming" },
            duration: "16:10",
            description: {
              pt: "Deslocamentos sutis que tiram o groove do lugar-comum.",
              en: "Subtle offsets that pull the groove away from the obvious.",
            },
          },
        ],
      },
      {
        id: "c1-m3",
        title: { pt: "Harmonia e arranjo", en: "Harmony and arrangement" },
        lessons: [
          {
            id: "c1-l5",
            title: { pt: "Acordes essenciais", en: "Essential chords" },
            duration: "19:30",
            description: {
              pt: "Tríades, sétimas e inversões aplicadas ao pop.",
              en: "Triads, sevenths and inversions applied to pop.",
            },
          },
          {
            id: "c1-l6",
            title: { pt: "Camadas e arranjo", en: "Layers and arrangement" },
            duration: "21:15",
            description: {
              pt: "Distribuição de frequências e densidade ao longo da faixa.",
              en: "Frequency spread and density across the track.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "producao-musical-intermediaria",
    title: {
      pt: "Produção Musical Intermediária",
      en: "Intermediate Music Production",
    },
    description: {
      pt: "Aprofunde arranjo, sound design e finalização em projetos autorais.",
      en: "Go deeper into arrangement, sound design and finishing original projects.",
    },
    instructor: "HISA",
    level: { pt: "Intermediário", en: "Intermediate" },
    purchasedAt: "2026-09-02T11:05:00-03:00",
    lastAccessed: "2026-10-27T19:05:00-03:00",
    variant: 2,
    modules: [
      {
        id: "c2-m1",
        title: { pt: "Sound design", en: "Sound design" },
        lessons: [
          {
            id: "c2-l1",
            title: { pt: "Síntese aplicada", en: "Applied synthesis" },
            duration: "20:05",
            description: {
              pt: "Osciladores, filtros e envelopes a serviço da música.",
              en: "Oscillators, filters and envelopes in service of the music.",
            },
          },
          {
            id: "c2-l2",
            title: { pt: "Texturas e resampling", en: "Textures and resampling" },
            duration: "17:30",
            description: {
              pt: "Como transformar gravações em camadas sonoras próprias.",
              en: "How to turn recordings into your own sonic layers.",
            },
          },
        ],
      },
      {
        id: "c2-m2",
        title: { pt: "Voz e produção", en: "Vocals and production" },
        lessons: [
          {
            id: "c2-l3",
            title: { pt: "Comping vocal", en: "Vocal comping" },
            duration: "19:50",
            description: {
              pt: "Seleção de takes e edição invisível.",
              en: "Take selection and invisible editing.",
            },
          },
          {
            id: "c2-l4",
            title: { pt: "Harmonias e dobras", en: "Harmonies and doubles" },
            duration: "15:45",
            description: {
              pt: "Construção de coros amplos sem perder a naturalidade.",
              en: "Building wide choruses without losing naturalness.",
            },
          },
        ],
      },
      {
        id: "c2-m3",
        title: { pt: "Finalização", en: "Finishing" },
        lessons: [
          {
            id: "c2-l5",
            title: { pt: "Pré-mix e balanço", en: "Pre-mix and balance" },
            duration: "18:20",
            description: {
              pt: "Níveis, panorama e hierarquia antes dos processadores.",
              en: "Levels, panning and hierarchy before processors.",
            },
          },
          {
            id: "c2-l6",
            title: { pt: "Masterização para streaming", en: "Mastering for streaming" },
            duration: "22:10",
            description: {
              pt: "Volume, dinâmica e tradução em fones e caixas.",
              en: "Loudness, dynamics and translation on headphones and speakers.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "analisando-britney-spears",
    title: {
      pt: "Analisando a Discografia da Britney Spears",
      en: "Analyzing Britney Spears' Discography",
    },
    description: {
      pt: "Quatro aulas sobre produção, voz e identidade em cada era da artista.",
      en: "Four lessons on production, voice and identity across the artist's eras.",
    },
    instructor: "HISA",
    level: { pt: "Análise musical", en: "Music analysis" },
    purchasedAt: "2026-06-21T16:30:00-03:00",
    lastAccessed: "2026-09-12T10:15:00-03:00",
    variant: 3,
    modules: [
      {
        id: "c3-m1",
        title: { pt: "Era pop", en: "Pop era" },
        lessons: [
          {
            id: "c3-l1",
            title: { pt: "…Baby One More Time", en: "…Baby One More Time" },
            duration: "12:40",
            description: {
              pt: "Estrutura, ganchos e a produção que definiu o pop de 1999.",
              en: "Structure, hooks and the production that defined pop in 1999.",
            },
          },
          {
            id: "c3-l2",
            title: { pt: "Oops!… I Did It Again", en: "Oops!… I Did It Again" },
            duration: "13:25",
            description: {
              pt: "Camadas vocais e refrão como evento sonoro.",
              en: "Vocal layers and a chorus built as a sonic event.",
            },
          },
        ],
      },
      {
        id: "c3-m2",
        title: { pt: "Reinvenção", en: "Reinvention" },
        lessons: [
          {
            id: "c3-l3",
            title: { pt: "In the Zone", en: "In the Zone" },
            duration: "15:10",
            description: {
              pt: "Experimentação, grooves e a virada de maturidade.",
              en: "Experimentation, grooves and the turn toward maturity.",
            },
          },
          {
            id: "c3-l4",
            title: { pt: "Blackout", en: "Blackout" },
            duration: "16:05",
            description: {
              pt: "Texturas digitais e o pop que antecipou a próxima década.",
              en: "Digital textures and the pop that anticipated the next decade.",
            },
          },
        ],
      },
    ],
  },
  {
    slug: "teoria-musical-para-producao",
    title: {
      pt: "Teoria Musical para Produção",
      en: "Music Theory for Production",
    },
    description: {
      pt: "Notas, escalas e campo harmônico aplicados à produção no DAW.",
      en: "Notes, scales and harmonic fields applied to production in the DAW.",
    },
    instructor: "HISA",
    level: { pt: "Iniciante", en: "Beginner" },
    purchasedAt: "2026-10-19T09:45:00-03:00",
    lastAccessed: "2026-10-19T09:45:00-03:00",
    variant: 0,
    modules: [
      {
        id: "c4-m1",
        title: { pt: "Fundamentos teóricos", en: "Theory foundations" },
        lessons: [
          {
            id: "c4-l1",
            title: { pt: "Notas e intervalos", en: "Notes and intervals" },
            duration: "11:20",
            description: {
              pt: "A distância entre notas e o efeito de cada intervalo.",
              en: "The distance between notes and the effect of each interval.",
            },
          },
          {
            id: "c4-l2",
            title: { pt: "Escalas maiores e menores", en: "Major and minor scales" },
            duration: "13:15",
            description: {
              pt: "Como escalas definem o clima de uma faixa.",
              en: "How scales define the mood of a track.",
            },
          },
          {
            id: "c4-l3",
            title: { pt: "Campo harmônico", en: "Harmonic field" },
            duration: "14:45",
            description: {
              pt: "Graus, funções e progressões que sustentam a música.",
              en: "Degrees, functions and progressions that hold the music up.",
            },
          },
        ],
      },
    ],
  },
];

/** Completion dates already issued in the demo account, per course slug. */
export const seedCompletionDates: Record<string, string> = {
  "analisando-britney-spears": "2026-09-12T10:15:00-03:00",
};

/** Lessons already watched in the demo account, per course slug. */
export const initialLessonProgress: Record<string, string[]> = {
  "introducao-producao-musical": ["c1-l1", "c1-l2", "c1-l3"],
  "producao-musical-intermediaria": ["c2-l1"],
  "analisando-britney-spears": ["c3-l1", "c3-l2", "c3-l3", "c3-l4"],
  "teoria-musical-para-producao": [],
};

export const libraryItems: MockLibraryItem[] = [
  {
    slug: "hisa-drum-kit-vol-1",
    title: { pt: "HISA Drum Kit Vol. 1", en: "HISA Drum Kit Vol. 1" },
    category: "drums",
    purchasedAt: "2026-07-08T15:10:00-03:00",
    variant: 1,
    formats: ["WAV 24-bit", "MIDI"],
    files: 120,
    size: "480 MB",
    contents: [
      { pt: "Kicks, snares e claps processados", en: "Processed kicks, snares and claps" },
      {
        pt: "Loops de bateria em 90, 100 e 120 BPM",
        en: "Drum loops at 90, 100 and 120 BPM",
      },
      {
        pt: "One-shots organizados por tipo",
        en: "One-shots organized by type",
      },
    ],
  },
  {
    slug: "neon-textures",
    title: { pt: "Neon Textures", en: "Neon Textures" },
    category: "samples",
    purchasedAt: "2026-08-21T18:40:00-03:00",
    variant: 2,
    formats: ["WAV 24-bit"],
    files: 60,
    size: "310 MB",
    contents: [
      { pt: "Texturas ambientes e drones", en: "Ambient textures and drones" },
      { pt: "Ruídos e foley processados", en: "Processed noise and foley" },
      { pt: "Loops de 8 e 16 compassos", en: "8 and 16-bar loops" },
    ],
  },
  {
    slug: "analog-presets",
    title: { pt: "Analog Presets", en: "Analog Presets" },
    category: "presets",
    purchasedAt: "2026-09-14T12:25:00-03:00",
    variant: 3,
    formats: ["FXP", "ADG"],
    files: 40,
    size: "12 MB",
    contents: [
      {
        pt: "40 presets para sintetizadores analógicos",
        en: "40 presets for analog synthesizers",
      },
      { pt: "Basses, leads, pads e plucks", en: "Basses, leads, pads and plucks" },
      {
        pt: "Macros mapeadas para performance",
        en: "Macros mapped for performance",
      },
    ],
  },
  {
    slug: "vocal-chops-harmonies",
    title: { pt: "Vocal Chops & Harmonies", en: "Vocal Chops & Harmonies" },
    category: "vocals",
    purchasedAt: "2026-10-03T20:05:00-03:00",
    variant: 0,
    formats: ["WAV 24-bit"],
    files: 85,
    size: "220 MB",
    contents: [
      { pt: "Chops vocais secos e processados", en: "Dry and processed vocal chops" },
      { pt: "Harmonias em terças e quintas", en: "Harmonies in thirds and fifths" },
      { pt: "Ad-libs e vocalizações", en: "Ad-libs and vocalizations" },
    ],
  },
  {
    slug: "complete-producer-bundle",
    title: {
      pt: "BUNDLE: COMPLETE HISA PACK VOL 1",
      en: "BUNDLE: COMPLETE HISA PACK VOL 1",
    },
    category: "bundles",
    purchasedAt: "2026-10-30T10:00:00-03:00",
    variant: 2,
    formats: ["WAV 24-bit", "MIDI", "FXP"],
    files: 320,
    size: "1.4 GB",
    contents: [
      { pt: "Todos os packs HISA Vol. 1", en: "Every HISA Vol. 1 pack" },
      { pt: "WAV 24-bit e MIDI", en: "24-bit WAV and MIDI" },
      { pt: "Presets e kits de bateria", en: "Presets and drum kits" },
    ],
  },
];

export const seedOrders: MockOrder[] = [
  {
    id: "HISA-2026-1042",
    createdAt: "2026-10-30T10:00:00-03:00",
    method: "credit",
    status: "paid",
    discount_cents: 0,
    items: [
      {
        slug: "complete-producer-bundle",
        catalog: "sounds",
        category: "bundles",
        title: {
          pt: "BUNDLE: COMPLETE HISA PACK VOL 1",
          en: "BUNDLE: COMPLETE HISA PACK VOL 1",
        },
        price_cents: 19900,
        variant: 2,
      },
    ],
  },
  {
    id: "HISA-2026-1031",
    createdAt: "2026-10-03T20:05:00-03:00",
    method: "pix",
    status: "paid",
    discount_cents: 0,
    items: [
      {
        slug: "vocal-chops-harmonies",
        catalog: "sounds",
        category: "vocals",
        title: { pt: "Vocal Chops & Harmonies", en: "Vocal Chops & Harmonies" },
        price_cents: 6900,
        variant: 0,
      },
    ],
  },
  {
    id: "HISA-2026-1024",
    createdAt: "2026-09-14T12:25:00-03:00",
    method: "credit",
    status: "refunded",
    discount_cents: 1000,
    items: [
      {
        slug: "analog-presets",
        catalog: "sounds",
        category: "presets",
        title: { pt: "Analog Presets", en: "Analog Presets" },
        price_cents: 4900,
        variant: 3,
      },
      {
        slug: "teoria-musical-para-producao",
        catalog: "academy",
        category: "lessons",
        title: {
          pt: "Teoria Musical para Produção",
          en: "Music Theory for Production",
        },
        price_cents: 8900,
        variant: 0,
      },
    ],
  },
  {
    id: "HISA-2026-1019",
    createdAt: "2026-09-18T09:30:00-03:00",
    method: "pix",
    status: "pending",
    discount_cents: 0,
    items: [
      {
        slug: "midi-progressions-vol-2",
        catalog: "sounds",
        category: "midi",
        title: { pt: "MIDI Progressions Vol. 2", en: "MIDI Progressions Vol. 2" },
        price_cents: 3900,
        variant: 1,
      },
    ],
  },
  {
    id: "HISA-2026-1007",
    createdAt: "2026-08-30T17:55:00-03:00",
    method: "credit",
    status: "failed",
    discount_cents: 0,
    items: [
      {
        slug: "neon-textures",
        catalog: "sounds",
        category: "samples",
        title: { pt: "Neon Textures", en: "Neon Textures" },
        price_cents: 5900,
        variant: 2,
      },
    ],
  },
];

export const recommendations: MockRecommendation[] = [
  {
    slug: "producao-musical-avancada",
    kind: "product",
    title: {
      pt: "Produção Musical Avançada",
      en: "Advanced Music Production",
    },
    meta: { pt: "Curso completo", en: "Full course" },
    price_cents: 59900,
  },
  {
    slug: "complete-producer-bundle",
    kind: "product",
    title: {
      pt: "BUNDLE: COMPLETE HISA PACK VOL 1",
      en: "BUNDLE: COMPLETE HISA PACK VOL 1",
    },
    meta: { pt: "Bundle", en: "Bundle" },
    price_cents: 19900,
  },
  {
    slug: "workshop-mixagem-ao-vivo",
    kind: "product",
    title: { pt: "Workshop: Mixagem ao Vivo", en: "Workshop: Live Mixing" },
    meta: { pt: "Workshop ao vivo", en: "Live workshop" },
    price_cents: 12900,
  },
];

export const totalLessons = (modules: MockModule[]) =>
  modules.reduce((total, module) => total + module.lessons.length, 0);
