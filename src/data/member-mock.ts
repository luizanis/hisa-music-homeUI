/**
 * Phase 01 mock data for the member area. Product snapshots mirror the live
 * catalog; orders, curricula, progress and files are invented for UX
 * validation and will be replaced by real records in the backend phase.
 */
import type { LocalizedText } from "@/lib/catalog";
import type { Order, ProductSnapshot } from "@/lib/cart";

const p = (
  slug: string,
  catalog: "academy" | "sounds",
  category: string,
  title_pt: string,
  title_en: string,
  price_cents: number,
): ProductSnapshot => ({ slug, catalog, category, title_pt, title_en, price_cents });

export const catalogSnapshots: ProductSnapshot[] = [
  p("introducao-producao-musical", "academy", "courses", "Introdução a Produção Musical", "Introduction to Music Production", 39900),
  p("producao-musical-intermediaria", "academy", "courses", "Produção Musical Intermediária", "Intermediate Music Production", 49900),
  p("producao-musical-avancada", "academy", "courses", "Produção Musical Avançada", "Advanced Music Production", 59900),
  p("teoria-musical-para-producao", "academy", "lessons", "Teoria Musical para Produção", "Music Theory for Production", 8990),
  p("harmonias-vocais", "academy", "lessons", "Como Criar Harmonias Vocais", "How to Create Vocal Harmonies", 7990),
  p("analisando-britney-spears", "academy", "analyses", "Analisando a Discografia da Britney Spears", "Analyzing Britney Spears' Discography", 5990),
  p("workshop-mixagem-ao-vivo", "academy", "workshops", "Workshop: Mixagem ao Vivo", "Workshop: Live Mixing", 12900),
  p("sessao-mentoria-artistica", "academy", "mentorship", "Sessão de Mentoria Artística", "Artistic Mentorship Session", 24900),
  p("neon-textures", "sounds", "samples", "Neon Textures", "Neon Textures", 5900),
  p("complete-producer-bundle", "sounds", "bundles", "BUNDLE: COMPLETE HISA PACK VOL 1", "BUNDLE: COMPLETE HISA PACK VOL 1", 19900),
  p("midi-progressions-vol-2", "sounds", "midi", "MIDI Progressions Vol. 2", "MIDI Progressions Vol. 2", 3900),
  p("hisa-drum-kit-vol-1", "sounds", "drums", "HISA Drum Kit Vol. 1", "HISA Drum Kit Vol. 1", 8900),
  p("analog-presets", "sounds", "presets", "Analog Presets", "Analog Presets", 4900),
  p("vocal-chops-harmonies", "sounds", "vocals", "Vocal Chops & Harmonies", "Vocal Chops & Harmonies", 6900),
];

export const snapshotBySlug = (slug: string) =>
  catalogSnapshots.find((item) => item.slug === slug);

const pick = (...slugs: string[]) =>
  slugs.map((slug) => snapshotBySlug(slug)).filter((item): item is ProductSnapshot => Boolean(item));

const order = (
  id: string,
  createdAt: string,
  status: Order["status"],
  method: Order["method"],
  slugs: string[],
  coupon: string | null = null,
): Order => {
  const items = pick(...slugs);
  const subtotal = items.reduce((sum, item) => sum + item.price_cents, 0);
  const discount = coupon ? Math.round(subtotal * 0.1) : 0;
  return {
    id,
    createdAt,
    status,
    method,
    items,
    coupon,
    subtotal_cents: subtotal,
    discount_cents: discount,
    total_cents: subtotal - discount,
  };
};

/** Purchase history for the demo account, oldest first. */
export const seedOrders: Order[] = [
  order("HISA-24012", "2026-06-02T14:10:00.000Z", "refunded", "credit", ["workshop-mixagem-ao-vivo"]),
  order("HISA-24017", "2026-06-18T19:42:00.000Z", "paid", "pix", ["teoria-musical-para-producao"]),
  order("HISA-24031", "2026-07-09T12:05:00.000Z", "paid", "credit", ["introducao-producao-musical", "neon-textures"], "HISA10"),
  order("HISA-24045", "2026-08-21T22:18:00.000Z", "failed", "credit", ["producao-musical-avancada"]),
  order("HISA-24058", "2026-09-14T16:30:00.000Z", "paid", "credit", ["hisa-drum-kit-vol-1", "midi-progressions-vol-2"]),
  order("HISA-24066", "2026-10-03T10:12:00.000Z", "paid", "pix", ["producao-musical-intermediaria", "vocal-chops-harmonies", "analisando-britney-spears"]),
  order("HISA-24073", "2026-11-01T20:47:00.000Z", "pending", "pix", ["analog-presets"]),
];

/* ---------------------------------------------------------------- courses */

export type Material = { name: string; size: string };

export type Lesson = {
  id: string;
  title: LocalizedText;
  duration: string;
  materials: Material[];
};

export type CourseModule = {
  id: string;
  title: LocalizedText;
  lessons: Lesson[];
};

export type Curriculum = {
  slug: string;
  level: "beginner" | "intermediate" | "advanced" | "all";
  modules: CourseModule[];
};

type LessonRow = [pt: string, en: string, duration: string, material?: string];

const mod = (id: string, pt: string, en: string, rows: LessonRow[]): CourseModule => ({
  id,
  title: { pt, en },
  lessons: rows.map(([lessonPt, lessonEn, duration, material], index) => ({
    id: `${id}-${index + 1}`,
    title: { pt: lessonPt, en: lessonEn },
    duration,
    materials: material ? [{ name: material, size: material.endsWith(".pdf") ? "1.2 MB" : "48 MB" }] : [],
  })),
});

export const curricula: Curriculum[] = [
  {
    slug: "introducao-producao-musical",
    level: "beginner",
    modules: [
      mod("m1", "Primeiros passos", "First steps", [
        ["Boas-vindas e como estudar", "Welcome and how to study", "06:12"],
        ["Montando seu home studio", "Setting up your home studio", "14:35", "checklist-home-studio.pdf"],
        ["Conhecendo a DAW", "Getting to know the DAW", "18:04"],
      ]),
      mod("m2", "Ritmo e groove", "Rhythm and groove", [
        ["Programando a primeira batida", "Programming your first beat", "16:48", "projeto-batida.zip"],
        ["Swing, quantização e humanização", "Swing, quantize and humanize", "12:20"],
        ["Construindo um loop de 8 compassos", "Building an 8-bar loop", "15:02"],
      ]),
      mod("m3", "Harmonia e melodia", "Harmony and melody", [
        ["Acordes que funcionam", "Chords that work", "17:40", "mapa-de-acordes.pdf"],
        ["Escrevendo linhas de baixo", "Writing bass lines", "13:55"],
        ["Melodias e ganchos", "Melodies and hooks", "14:18"],
      ]),
      mod("m4", "Arranjo e finalização", "Arrangement and finishing", [
        ["Estrutura de uma faixa", "Structure of a track", "11:26"],
        ["Mixagem básica", "Basic mixing", "19:33", "template-mixagem.zip"],
        ["Exportando e compartilhando", "Exporting and sharing", "08:47"],
      ]),
    ],
  },
  {
    slug: "producao-musical-intermediaria",
    level: "intermediate",
    modules: [
      mod("m1", "Sound design", "Sound design", [
        ["Síntese subtrativa na prática", "Subtractive synthesis in practice", "21:10", "patches-sintese.zip"],
        ["Texturas e ambiências", "Textures and ambiences", "16:42"],
        ["Reamostragem criativa", "Creative resampling", "14:09"],
      ]),
      mod("m2", "Arranjo avançado", "Advanced arrangement", [
        ["Tensão e resolução", "Tension and release", "15:51"],
        ["Transições", "Transitions", "12:37"],
        ["Contraste entre seções", "Contrast between sections", "13:20"],
      ]),
      mod("m3", "Vozes", "Vocals", [
        ["Gravação e edição de voz", "Recording and editing vocals", "18:22", "guia-gravacao.pdf"],
        ["Afinação e timing", "Tuning and timing", "14:05"],
        ["Efeitos de voz", "Vocal effects", "16:14"],
      ]),
      mod("m4", "Mixagem", "Mixing", [
        ["Equalização com intenção", "EQ with intention", "20:48"],
        ["Compressão paralela", "Parallel compression", "15:16"],
        ["Espaço e profundidade", "Space and depth", "17:39", "sessao-mix.zip"],
      ]),
    ],
  },
  {
    slug: "producao-musical-avancada",
    level: "advanced",
    modules: [
      mod("m1", "Identidade sonora", "Sonic identity", [
        ["Referências e assinatura", "References and signature", "17:12"],
        ["Construindo uma paleta", "Building a palette", "19:45", "paleta-sonora.pdf"],
      ]),
      mod("m2", "Produção para lançamento", "Production for release", [
        ["Do demo ao master", "From demo to master", "22:30"],
        ["Trabalhando com artistas", "Working with artists", "16:08"],
      ]),
      mod("m3", "Masterização", "Mastering", [
        ["Loudness e dinâmica", "Loudness and dynamics", "18:55"],
        ["Cadeia de masterização", "Mastering chain", "21:04", "cadeia-master.zip"],
      ]),
    ],
  },
  {
    slug: "teoria-musical-para-producao",
    level: "all",
    modules: [
      mod("m1", "Teoria aplicada", "Applied theory", [
        ["Escalas e modos na DAW", "Scales and modes in the DAW", "15:30", "escalas.pdf"],
        ["Campo harmônico", "Diatonic harmony", "17:12"],
        ["Progressões para produção", "Progressions for production", "14:44"],
      ]),
    ],
  },
  {
    slug: "harmonias-vocais",
    level: "all",
    modules: [
      mod("m1", "Harmonias vocais", "Vocal harmonies", [
        ["Terças, sextas e oitavas", "Thirds, sixths and octaves", "13:18"],
        ["Empilhando vozes", "Stacking voices", "16:02", "sessao-vozes.zip"],
        ["Mixando harmonias", "Mixing harmonies", "12:40"],
      ]),
    ],
  },
  {
    slug: "analisando-britney-spears",
    level: "all",
    modules: [
      mod("m1", "Era Max Martin", "The Max Martin era", [
        ["…Baby One More Time", "…Baby One More Time", "18:20"],
        ["Oops!... I Did It Again", "Oops!... I Did It Again", "16:45"],
      ]),
      mod("m2", "Era eletrônica", "The electronic era", [
        ["Toxic", "Toxic", "19:12", "analise-toxic.pdf"],
        ["Blackout e a produção pop", "Blackout and pop production", "21:36"],
      ]),
    ],
  },
];

export const curriculumFor = (slug: string) => curricula.find((course) => course.slug === slug);

export const lessonsOf = (course: Curriculum) => course.modules.flatMap((module) => module.lessons);

export type CourseProgress = {
  completed: string[];
  lastLesson: string | null;
  lastAccessed: string | null;
};

export const seedProgress: Record<string, CourseProgress> = {
  "introducao-producao-musical": {
    completed: ["m1-1", "m1-2", "m1-3", "m2-1", "m2-2"],
    lastLesson: "m2-3",
    lastAccessed: "2026-11-05T21:14:00.000Z",
  },
  "teoria-musical-para-producao": {
    completed: ["m1-1", "m1-2", "m1-3"],
    lastLesson: "m1-3",
    lastAccessed: "2026-10-12T18:02:00.000Z",
  },
  "analisando-britney-spears": {
    completed: ["m1-1"],
    lastLesson: "m1-2",
    lastAccessed: "2026-10-28T23:40:00.000Z",
  },
};

/* ---------------------------------------------------------------- library */

export const libraryFormats: Record<string, string[]> = {
  samples: ["WAV 24-bit", "Loops", "One-shots"],
  bundles: ["WAV", "MIDI", "Serum", "Vital"],
  midi: ["MIDI"],
  drums: ["WAV 24-bit", "One-shots"],
  presets: ["Serum (.fxp)", "Vital (.vital)"],
  vocals: ["WAV 24-bit", "Stems"],
};

/** Mock file list per product: the package plus extras where they apply. */
export const libraryFiles = (slug: string, category: string): Material[] => {
  const base = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("_");
  const files: Material[] = [{ name: `${base}.zip`, size: category === "bundles" ? "2.4 GB" : category === "midi" ? "4 MB" : "640 MB" }];
  if (category === "bundles" || category === "samples" || category === "vocals") {
    files.push({ name: `${base}_Demo_Project.zip`, size: "180 MB" });
  }
  files.push({ name: `${base}_License.pdf`, size: "220 KB" });
  return files;
};
