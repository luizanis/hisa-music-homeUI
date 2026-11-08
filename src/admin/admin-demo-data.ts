import type {
  DemoActivity,
  DemoAdministrator,
  DemoInquiry,
  DemoProduct,
  ProductModule,
} from "@/admin/admin-types";

/**
 * Fictional admin prototype data. Product names and prices mirror the real
 * catalog so the layout reads realistically, but no record here is read from or
 * written to the database. Inquiry names, emails and messages are invented.
 */

const academyIncludesPt = [
  "Aulas em vídeo sob demanda",
  "Arquivos de projeto",
  "Certificado de conclusão",
];

const academyIncludesEn = [
  "On-demand video lessons",
  "Project files",
  "Completion certificate",
];

const soundsIncludesPt = [
  "Arquivos WAV 24-bit",
  "Loops e one-shots",
  "Licença para uso comercial",
];

const soundsIncludesEn = [
  "24-bit WAV files",
  "Loops and one-shots",
  "Commercial licence",
];

const courseModulesPt: ProductModule[] = [
  {
    title: "01 · Escuta e referência",
    detail: "Analisar faixas e transformar referências em decisões de produção.",
  },
  {
    title: "02 · Ritmo e harmonia",
    detail: "Programação de bateria, groove e os acordes que sustentam a canção.",
  },
  {
    title: "03 · Arranjo e finalização",
    detail: "Camadas, espaço e entrega para streaming.",
  },
];

const courseModulesEn: ProductModule[] = [
  {
    title: "01 · Listening and reference",
    detail: "Analyse tracks and turn references into production decisions.",
  },
  {
    title: "02 · Rhythm and harmony",
    detail: "Drum programming, groove and the chords that hold the song.",
  },
  {
    title: "03 · Arrangement and finishing",
    detail: "Layers, space and delivery for streaming.",
  },
];

type ProductSeed = Omit<
  DemoProduct,
  | "id"
  | "published"
  | "updatedAt"
  | "includesPt"
  | "includesEn"
  | "modulesPt"
  | "modulesEn"
  | "startsAt"
> & {
  includesPt?: string[];
  includesEn?: string[];
  modulesPt?: ProductModule[];
  modulesEn?: ProductModule[];
  startsAt?: string | null;
  published?: boolean;
  updatedAt?: string;
};

const product = (seed: ProductSeed): DemoProduct => ({
  id: `demo-${seed.slug}`,
  published: seed.published ?? true,
  updatedAt: seed.updatedAt ?? "2026-11-06T12:00:00-03:00",
  startsAt: seed.startsAt ?? null,
  includesPt:
    seed.includesPt ??
    (seed.catalog === "academy" ? academyIncludesPt : soundsIncludesPt),
  includesEn:
    seed.includesEn ??
    (seed.catalog === "academy" ? academyIncludesEn : soundsIncludesEn),
  modulesPt: seed.modulesPt ?? [],
  modulesEn: seed.modulesEn ?? [],
  ...seed,
});

export const seedProducts: DemoProduct[] = [
  product({
    slug: "aula-gratuita-primeiros-passos",
    catalog: "academy",
    category: "lessons",
    titlePt: "Aula gratuita: primeiros passos",
    titleEn: "Free lesson: first steps",
    metaPt: "Aula avulsa · 18 min",
    metaEn: "Single lesson · 18 min",
    summaryPt:
      "Uma aula aberta para conhecer o método: ideia, batida e arranjo em dezoito minutos.",
    summaryEn:
      "An open lesson to meet the method: idea, beat and arrangement in eighteen minutes.",
    priceCents: 0,
    position: 0,
    updatedAt: "2026-11-05T09:20:00-03:00",
  }),
  product({
    slug: "introducao-producao-musical",
    catalog: "academy",
    category: "courses",
    titlePt: "Introdução a Produção Musical",
    titleEn: "Introduction to Music Production",
    metaPt: "Curso · 6 aulas · iniciante",
    metaEn: "Course · 6 lessons · beginner",
    summaryPt:
      "Do primeiro som ao master: a base técnica e criativa para produzir suas próprias faixas.",
    summaryEn:
      "From the first sound to the master: the technical and creative base to produce your own tracks.",
    priceCents: 39900,
    position: 1,
    modulesPt: courseModulesPt,
    modulesEn: courseModulesEn,
    updatedAt: "2026-11-06T14:10:00-03:00",
  }),
  product({
    slug: "producao-musical-intermediaria",
    catalog: "academy",
    category: "courses",
    titlePt: "Produção Musical Intermediária",
    titleEn: "Intermediate Music Production",
    metaPt: "Curso · 6 aulas · intermediário",
    metaEn: "Course · 6 lessons · intermediate",
    summaryPt:
      "Para quem já produz e quer som próprio: arranjo, textura e identidade sonora.",
    summaryEn:
      "For those already producing who want their own sound: arrangement, texture and sonic identity.",
    priceCents: 49900,
    position: 2,
    modulesPt: courseModulesPt,
    modulesEn: courseModulesEn,
    updatedAt: "2026-11-04T17:45:00-03:00",
  }),
  product({
    slug: "producao-musical-avancada",
    catalog: "academy",
    category: "courses",
    titlePt: "Produção Musical Avançada",
    titleEn: "Advanced Music Production",
    metaPt: "Curso · 6 aulas · avançado",
    metaEn: "Course · 6 lessons · advanced",
    summaryPt:
      "Produção de alto nível: direção artística, mixagem e master para lançamento.",
    summaryEn:
      "High-level production: artistic direction, mixing and master for release.",
    priceCents: 59900,
    position: 3,
    modulesPt: courseModulesPt,
    modulesEn: courseModulesEn,
    updatedAt: "2026-11-03T11:30:00-03:00",
  }),
  product({
    slug: "analisando-britney-spears",
    catalog: "academy",
    category: "analyses",
    titlePt: "Analisando a Discografia da Britney Spears",
    titleEn: "Analyzing Britney Spears' Discography",
    metaPt: "Análise · 4 aulas",
    metaEn: "Analysis · 4 lessons",
    summaryPt:
      "Uma leitura faixa por faixa da discografia que redefiniu o pop dos anos 2000.",
    summaryEn:
      "A track-by-track reading of the discography that redefined 2000s pop.",
    priceCents: 5990,
    position: 4,
    updatedAt: "2026-10-30T16:00:00-03:00",
  }),
  product({
    slug: "teoria-musical-para-producao",
    catalog: "academy",
    category: "lessons",
    titlePt: "Teoria Musical para Produção",
    titleEn: "Music Theory for Production",
    metaPt: "Aula avulsa · 1h30",
    metaEn: "Single lesson · 1h30",
    summaryPt:
      "A teoria que a produção precisa: acordes, escalas e função harmônica sem academicismo.",
    summaryEn:
      "The theory production needs: chords, scales and harmonic function without academicism.",
    priceCents: 8990,
    position: 5,
    updatedAt: "2026-10-28T10:10:00-03:00",
  }),
  product({
    slug: "harmonias-vocais",
    catalog: "academy",
    category: "lessons",
    titlePt: "Harmonias Vocais",
    titleEn: "Vocal Harmonies",
    metaPt: "Aula avulsa · 1h15",
    metaEn: "Single lesson · 1h15",
    summaryPt:
      "Camadas vocais que soam como um coral: do uníssono à harmonia de quatro vozes.",
    summaryEn:
      "Vocal layers that sound like a choir: from unison to four-part harmony.",
    priceCents: 7990,
    position: 6,
    updatedAt: "2026-10-26T12:25:00-03:00",
  }),
  product({
    slug: "workshop-mixagem-ao-vivo",
    catalog: "academy",
    category: "workshops",
    titlePt: "Workshop: Mixagem ao Vivo",
    titleEn: "Workshop: Live Mixing",
    metaPt: "Ao vivo · 2h",
    metaEn: "Live · 2h",
    summaryPt:
      "Uma faixa aberta ao vivo, do primeiro corte ao master, com perguntas em tempo real.",
    summaryEn:
      "A track opened live, from first cut to master, with real-time questions.",
    priceCents: 12900,
    position: 7,
    startsAt: "2027-01-23T19:00",
    updatedAt: "2026-11-02T18:00:00-03:00",
  }),
  product({
    slug: "sessao-mentoria-artistica",
    catalog: "academy",
    category: "mentorship",
    titlePt: "Sessão de Mentoria Artística",
    titleEn: "Artistic Mentorship Session",
    metaPt: "Individual · 1h",
    metaEn: "One-to-one · 1h",
    summaryPt:
      "Uma hora de escuta dedicada ao seu projeto: direção, repertório e próximos passos.",
    summaryEn:
      "One hour of listening devoted to your project: direction, repertoire and next steps.",
    priceCents: 24900,
    position: 8,
    updatedAt: "2026-10-29T09:40:00-03:00",
  }),
  product({
    slug: "hisa-free-sampler-vol-1",
    catalog: "sounds",
    category: "samples",
    titlePt: "HISA Free Sampler Vol. 1",
    titleEn: "HISA Free Sampler Vol. 1",
    metaPt: "Pacote · 12 samples",
    metaEn: "Pack · 12 samples",
    summaryPt:
      "Doze sons do estúdio HISA para começar uma produção hoje.",
    summaryEn:
      "Twelve sounds from the HISA studio to start a production today.",
    priceCents: 0,
    position: 0,
    updatedAt: "2026-11-05T08:00:00-03:00",
  }),
  product({
    slug: "hisa-drum-kit-vol-1",
    catalog: "sounds",
    category: "drums",
    titlePt: "HISA Drum Kit Vol. 1",
    titleEn: "HISA Drum Kit Vol. 1",
    metaPt: "120 samples · WAV",
    metaEn: "120 samples · WAV",
    summaryPt:
      "Bateria analógica processada por HISA: impacto e textura para faixas que precisam de peso.",
    summaryEn:
      "Analogue drums processed by HISA: impact and texture for tracks that need weight.",
    priceCents: 8900,
    position: 1,
    updatedAt: "2026-10-31T13:15:00-03:00",
  }),
  product({
    slug: "neon-textures",
    catalog: "sounds",
    category: "samples",
    titlePt: "Neon Textures",
    titleEn: "Neon Textures",
    metaPt: "80 loops · 48 kHz",
    metaEn: "80 loops · 48 kHz",
    summaryPt:
      "Texturas noturnas gravadas em sintetizadores e fita, prontas para atmosfera.",
    summaryEn:
      "Night textures recorded to synthesizers and tape, ready for atmosphere.",
    priceCents: 5900,
    position: 2,
    updatedAt: "2026-10-27T15:20:00-03:00",
  }),
  product({
    slug: "midi-progressions-vol-2",
    catalog: "sounds",
    category: "midi",
    titlePt: "MIDI Progressions Vol. 2",
    titleEn: "MIDI Progressions Vol. 2",
    metaPt: "60 progressões MIDI",
    metaEn: "60 MIDI progressions",
    summaryPt:
      "Progressões harmônicas prontas para reescrever com o seu som.",
    summaryEn:
      "Harmonic progressions ready to be rewritten with your sound.",
    priceCents: 3900,
    position: 3,
    updatedAt: "2026-10-25T11:05:00-03:00",
  }),
  product({
    slug: "vocal-chops-harmonies",
    catalog: "sounds",
    category: "vocals",
    titlePt: "Vocal Chops & Harmonies",
    titleEn: "Vocal Chops & Harmonies",
    metaPt: "95 vocais · WAV",
    metaEn: "95 vocals · WAV",
    summaryPt:
      "Vozes processadas e harmonias para abrir o topo da sua produção.",
    summaryEn:
      "Processed voices and harmonies to open the top of your production.",
    priceCents: 6900,
    position: 4,
    updatedAt: "2026-10-24T09:30:00-03:00",
  }),
  product({
    slug: "analog-presets",
    catalog: "sounds",
    category: "presets",
    titlePt: "Analog Presets",
    titleEn: "Analog Presets",
    metaPt: "70 presets · Serum, Vital",
    metaEn: "70 presets · Serum, Vital",
    summaryPt:
      "Presets de inspiração analógica para os sintetizadores que você já usa.",
    summaryEn:
      "Analogue-inspired presets for the synthesizers you already use.",
    priceCents: 4900,
    position: 5,
    updatedAt: "2026-10-22T14:00:00-03:00",
  }),
  product({
    slug: "complete-producer-bundle",
    catalog: "sounds",
    category: "bundles",
    titlePt: "BUNDLE: COMPLETE HISA PACK VOL 1",
    titleEn: "BUNDLE: COMPLETE HISA PACK VOL 1",
    metaPt: "Bundle · 4 packs",
    metaEn: "Bundle · 4 packs",
    summaryPt:
      "Os quatro volumes do catálogo HISA em um único pacote, com economia real.",
    summaryEn:
      "The four volumes of the HISA catalogue in a single pack, with real savings.",
    priceCents: 19900,
    position: 6,
    updatedAt: "2026-10-21T10:45:00-03:00",
  }),
];

export const seedInquiries: DemoInquiry[] = [
  {
    id: "inq-1042",
    name: "Camila Rocha",
    email: "camila.rocha@example.com",
    area: "academy",
    locale: "pt",
    message:
      "Olá! Tenho interesse no curso de Produção Musical Intermediária. As aulas são ao vivo ou gravadas? Consigo acesso por quanto tempo?",
    status: "new",
    createdAt: "2026-11-06T14:22:00-03:00",
    readAt: null,
    handledAt: null,
  },
  {
    id: "inq-1041",
    name: "Rafael Lima",
    email: "rafael.lima@example.com",
    area: "sounds",
    locale: "pt",
    message:
      "Queria saber se o HISA Drum Kit Vol. 1 inclui os loops em 90 e 100 BPM e se a licença cobre lançamento comercial.",
    status: "new",
    createdAt: "2026-11-06T11:08:00-03:00",
    readAt: null,
    handledAt: null,
  },
  {
    id: "inq-1040",
    name: "Beatriz Nunes",
    email: "beatriz.nunes@example.com",
    area: "custom",
    locale: "en",
    message:
      "I am working on a short EP and would like to discuss a custom production package. Do you take on mixing projects with a two-week turnaround?",
    status: "new",
    createdAt: "2026-11-05T18:40:00-03:00",
    readAt: null,
    handledAt: null,
  },
  {
    id: "inq-1039",
    name: "Diego Martins",
    email: "diego.martins@example.com",
    area: "music",
    locale: "pt",
    message:
      "Vocês têm previsão de show em São Paulo? Gostaria de acompanhar as datas e o processo de pré-venda.",
    status: "read",
    createdAt: "2026-11-04T09:12:00-03:00",
    readAt: "2026-11-04T10:30:00-03:00",
    handledAt: null,
  },
  {
    id: "inq-1038",
    name: "Luiza Prado",
    email: "luiza.prado@example.com",
    area: "consulting",
    locale: "en",
    message:
      "We are a small label looking for help with artist development and release strategy. Could you share how your consulting sessions work?",
    status: "read",
    createdAt: "2026-11-03T16:05:00-03:00",
    readAt: "2026-11-03T17:22:00-03:00",
    handledAt: null,
  },
  {
    id: "inq-1037",
    name: "André Costa",
    email: "andre.costa@example.com",
    area: "brands",
    locale: "pt",
    message:
      "Represento uma marca de áudio e gostaria de conversar sobre uma possível colaboração para lançamento de produto.",
    status: "handled",
    createdAt: "2026-10-31T13:48:00-03:00",
    readAt: "2026-10-31T14:10:00-03:00",
    handledAt: "2026-11-01T09:30:00-03:00",
  },
];

export const seedAdministrators: DemoAdministrator[] = [
  {
    id: "adm-owner",
    name: "HISA Owner",
    email: "owner@hisa.demo",
    role: "owner",
    status: "active",
    createdAt: "2026-01-12T10:00:00-03:00",
  },
  {
    id: "adm-admin",
    name: "HISA Admin",
    email: "admin@hisa.demo",
    role: "admin",
    status: "active",
    createdAt: "2026-02-03T09:30:00-03:00",
  },
  {
    id: "adm-ops",
    name: "Studio Operations",
    email: "ops@hisa.demo",
    role: "admin",
    status: "active",
    createdAt: "2026-03-18T15:45:00-03:00",
  },
  {
    id: "adm-archive",
    name: "Former Collaborator",
    email: "collaborator@hisa.demo",
    role: "admin",
    status: "inactive",
    createdAt: "2026-04-02T11:20:00-03:00",
  },
];

export const seedActivity: DemoActivity[] = [
  {
    id: "act-01",
    createdAt: "2026-11-06T14:20:00-03:00",
    actor: "HISA Owner",
    actorRole: "owner",
    actionKey: "admin.activity.action.productUpdated",
    target: "introducao-producao-musical",
  },
  {
    id: "act-02",
    createdAt: "2026-11-06T11:35:00-03:00",
    actor: "HISA Admin",
    actorRole: "admin",
    actionKey: "admin.activity.action.productPublished",
    target: "workshop-mixagem-ao-vivo",
  },
  {
    id: "act-03",
    createdAt: "2026-11-05T17:10:00-03:00",
    actor: "HISA Admin",
    actorRole: "admin",
    actionKey: "admin.activity.action.inquiryRead",
    target: "inq-1039",
  },
  {
    id: "act-04",
    createdAt: "2026-11-05T09:45:00-03:00",
    actor: "HISA Owner",
    actorRole: "owner",
    actionKey: "admin.activity.action.administratorAdded",
    target: "ops@hisa.demo",
  },
  {
    id: "act-05",
    createdAt: "2026-11-04T16:30:00-03:00",
    actor: "HISA Owner",
    actorRole: "owner",
    actionKey: "admin.activity.action.roleChanged",
    target: "studio.operations@hisa.demo",
  },
  {
    id: "act-06",
    createdAt: "2026-11-04T10:20:00-03:00",
    actor: "HISA Admin",
    actorRole: "admin",
    actionKey: "admin.activity.action.inquiryHandled",
    target: "inq-1037",
  },
  {
    id: "act-07",
    createdAt: "2026-11-03T15:05:00-03:00",
    actor: "HISA Admin",
    actorRole: "admin",
    actionKey: "admin.activity.action.productReordered",
    target: "sounds",
  },
  {
    id: "act-08",
    createdAt: "2026-11-02T12:15:00-03:00",
    actor: "HISA Owner",
    actorRole: "owner",
    actionKey: "admin.activity.action.productCreated",
    target: "sessao-mentoria-artistica",
  },
  {
    id: "act-09",
    createdAt: "2026-10-31T18:40:00-03:00",
    actor: "HISA Admin",
    actorRole: "admin",
    actionKey: "admin.activity.action.productUnpublished",
    target: "harmonias-vocais",
  },
  {
    id: "act-10",
    createdAt: "2026-10-30T09:00:00-03:00",
    actor: "HISA Owner",
    actorRole: "owner",
    actionKey: "admin.activity.action.administratorAdded",
    target: "admin@hisa.demo",
  },
];
