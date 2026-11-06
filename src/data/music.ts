export type LocalizedText = { pt: string; en: string };

export type StreamingLink = { label: string; href: string };

export type CoverLayout = "stacked" | "centered" | "bottom" | "split";

export type Album = {
  id: string;
  code: string;
  title: string;
  /** Empty when the project has no release date yet. */
  year: string;
  type: LocalizedText;
  status: "released" | "soon";
  description: LocalizedText;
  links: StreamingLink[];
  layout: CoverLayout;
};

export type Video = {
  id: string;
  title: LocalizedText;
  year: string;
  href: string;
  /** Fill with the YouTube video ID to enable in-site playback. */
  youtubeId: string;
};

export type Show = {
  id: string;
  date: string;
  city: LocalizedText;
  venue: string;
  ticketsHref: string;
};

export type PressPhoto = {
  id: string;
  src: string;
  filename: string;
  label: string;
};

/**
 * Streaming links point at real search pages so nothing 404s while the
 * official release links are not connected yet.
 */
const searchLinks = (query: string, extra?: StreamingLink[]) => {
  const q = encodeURIComponent(query);
  return [
    { label: "Spotify", href: `https://open.spotify.com/search/${q}` },
    { label: "Apple Music", href: `https://music.apple.com/search?term=${q}` },
    { label: "YouTube", href: `https://www.youtube.com/results?search_query=${q}` },
    { label: "Deezer", href: `https://www.deezer.com/search/${q}` },
    ...(extra ?? []),
  ];
};

const youtubeSearch = (query: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

export const albums: Album[] = [
  {
    id: "parnasia",
    code: "HS-001",
    title: "PARNASIA",
    year: "2017",
    type: { pt: "álbum", en: "album" },
    status: "released",
    layout: "bottom",
    description: {
      pt: "Um retrato inaugural de uma artista em formação, entre a introspecção, a inquietação e a busca por liberdade. Com quatro composições autorais e uma produção que aproxima o pop alternativo de texturas eletrônicas, Parnasia apresenta um universo de contrastes: delicado, melancólico e inconformado. É o começo de uma linguagem que já procurava escapar do óbvio.",
      en: "An inaugural portrait of an artist in formation, between introspection, restlessness and the search for freedom. With four original compositions and a production that brings alternative pop close to electronic textures, Parnasia presents a universe of contrasts: delicate, melancholic and nonconformist. It is the beginning of a language that was already trying to escape the obvious.",
    },
    links: searchLinks("HISA Parnasia"),
  },
  {
    id: "levels",
    code: "HS-002",
    title: "LEVELS, THE MIXTAPE",
    year: "2021",
    type: { pt: "mixtape", en: "mixtape" },
    status: "released",
    layout: "bottom",
    description: {
      pt: "Uma mixtape sobre altitude e queda. Beats densos, samples de vozes quebradas e letras escritas em primeira pessoa. LEVELS organiza a carreira em camadas, do chão ao topo.",
      en: "A mixtape about altitude and falling. Dense beats, chopped vocal samples and first-person writing. LEVELS stacks a career in layers, from the ground to the top.",
    },
    links: searchLinks("HISA Levels The Mixtape"),
  },
  {
    id: "a-noite-me-lava",
    code: "HS-003",
    title: "A NOITE ME LAVA",
    year: "2026",
    type: { pt: "álbum", en: "album" },
    status: "released",
    layout: "bottom",
    description: {
      pt: "Um mergulho nas contradições do afeto, nas fantasias que construímos para suportar a realidade e nos sentimentos que sobrevivem ao fim de uma noite. Entre o pop e o R&B, o projeto percorre diferentes formas de desejo, vulnerabilidade, intuição e despedida. A noite aparece como um espaço de transformação: lugar de excessos, revelações e, finalmente, de reinvenção.",
      en: "A dive into the contradictions of affection, the fantasies we build to endure reality and the feelings that survive the end of a night. Between pop and R&B, the project travels through different forms of desire, vulnerability, intuition and farewell. The night appears as a space of transformation: a place of excess, revelation and, finally, reinvention.",
    },
    links: searchLinks("HISA A Noite Me Lava"),
  },
  {
    id: "amador",
    code: "HS-004",
    title: "AMADOR",
    year: "",
    type: { pt: "álbum", en: "album" },
    status: "soon",
    layout: "bottom",
    description: {
      pt: "Em construção. Um retorno ao gesto amador: gravações cruas, erros mantidos e canções sem acabamento. AMADOR é o próximo capítulo e ainda não tem data.",
      en: "In progress. A return to the amateur gesture: raw recordings, kept mistakes and unfinished songs. AMADOR is the next chapter and has no date yet.",
    },
    links: searchLinks("HISA Amador"),
  },
];

export const latestRelease = albums.find(
  (album) => album.id === "a-noite-me-lava",
) as Album;

export const videos: Video[] = [
  {
    id: "a-noite-me-lava-video",
    title: { pt: "A Noite Me Lava · vídeo oficial", en: "A Noite Me Lava · official video" },
    year: "2026",
    href: youtubeSearch("HISA A Noite Me Lava video oficial"),
    youtubeId: "",
  },
  {
    id: "levels-visualizer",
    title: { pt: "Levels · visualizer", en: "Levels · visualizer" },
    year: "2021",
    href: youtubeSearch("HISA Levels visualizer"),
    youtubeId: "",
  },
  {
    id: "parnasia-live",
    title: { pt: "Parnasia · live session", en: "Parnasia · live session" },
    year: "2019",
    href: youtubeSearch("HISA Parnasia live session"),
    youtubeId: "",
  },
  {
    id: "vozes-de-hotel",
    title: { pt: "Vozes de Hotel · clipe", en: "Vozes de Hotel · music video" },
    year: "2018",
    href: youtubeSearch("HISA Vozes de Hotel clipe"),
    youtubeId: "",
  },
];

export const shows: Show[] = [
  {
    id: "sp-2027",
    date: "2027-02-14",
    city: { pt: "São Paulo, BR", en: "São Paulo, BR" },
    venue: "Cine Joia",
    ticketsHref: "https://www.sympla.com.br",
  },
  {
    id: "rj-2027",
    date: "2027-03-07",
    city: { pt: "Rio de Janeiro, BR", en: "Rio de Janeiro, BR" },
    venue: "Circo Voador",
    ticketsHref: "https://www.sympla.com.br",
  },
  {
    id: "bh-2027",
    date: "2027-04-18",
    city: { pt: "Belo Horizonte, BR", en: "Belo Horizonte, BR" },
    venue: "Autêntica",
    ticketsHref: "https://www.sympla.com.br",
  },
  {
    id: "poa-2027",
    date: "2027-05-09",
    city: { pt: "Porto Alegre, BR", en: "Porto Alegre, BR" },
    venue: "Opinião",
    ticketsHref: "https://www.sympla.com.br",
  },
];

export const pressPhotos: PressPhoto[] = [
  {
    id: "01",
    src: "/press/hisa-press-01.jpg",
    filename: "hisa-press-01.jpg",
    label: "Press 01 · retrato",
  },
  {
    id: "02",
    src: "/press/hisa-press-02.jpg",
    filename: "hisa-press-02.jpg",
    label: "Press 02 · palco",
  },
  {
    id: "03",
    src: "/press/hisa-press-03.jpg",
    filename: "hisa-press-03.jpg",
    label: "Press 03 · estúdio",
  },
];

export const epkHref = "/downloads/hisa-epk.pdf";

/** Drop the final hero film URL here to replace the video placeholder. */
export const heroVideoUrl = "";
