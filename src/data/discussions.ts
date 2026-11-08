import type { LocalizedText } from "@/lib/catalog";

export type SeedReply = {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: LocalizedText;
  replyTo?: LocalizedText;
};

export type SeedThread = {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: LocalizedText;
  replies: SeedReply[];
};

export type DiscussionReply = {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: string;
  replyTo?: string;
  editedAt?: string;
};

export type DiscussionThread = {
  id: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  body: string;
  editedAt?: string;
  replies: DiscussionReply[];
};

/**
 * Mock classroom threads for the demo lessons. Everything is client-side for
 * the wireframe stage; a real classroom would read and write these server-side.
 */
export const seedDiscussions: Record<string, SeedThread[]> = {
  "c1-l4": [
    {
      id: "disc-c1l4-1",
      authorId: "self",
      authorName: "Marina Alves",
      createdAt: "2026-11-03T10:15:00-03:00",
      body: {
        pt: "Alguém mais sentiu diferença ao reduzir o swing no kick e manter só no hi-hat?",
        en: "Did anyone else notice a difference by reducing the swing on the kick and keeping it only on the hi-hat?",
      },
      replies: [
        {
          id: "disc-c1l4-1-r1",
          authorId: "u-camila",
          authorName: "Camila Rocha",
          createdAt: "2026-11-03T12:40:00-03:00",
          replyTo: { pt: "Marina Alves", en: "Marina Alves" },
          body: {
            pt: "Sim, deixou a levada mais firme sem perder o balanço. Vou usar assim no próximo beat.",
            en: "Yes, it made the groove firmer without losing the bounce. I'll use that on my next beat.",
          },
        },
      ],
    },
    {
      id: "disc-c1l4-2",
      authorId: "u-camila",
      authorName: "Camila Rocha",
      createdAt: "2026-11-02T14:20:00-03:00",
      body: {
        pt: "Vocês aplicam o swing direto no piano roll ou preferem tocar no teclado e ajustar depois?",
        en: "Do you apply swing directly in the piano roll, or play it on the keyboard and adjust afterwards?",
      },
      replies: [
        {
          id: "disc-c1l4-2-r1",
          authorId: "hisa",
          authorName: "HISA",
          createdAt: "2026-11-02T17:05:00-03:00",
          replyTo: { pt: "Camila Rocha", en: "Camila Rocha" },
          body: {
            pt: "Começo tocando no teclado e depois empurro algumas notas no piano roll. O importante é preservar a intenção do groove, não a grade perfeita.",
            en: "I start by playing on the keyboard and then nudge a few notes in the piano roll. The important thing is preserving the groove's intention, not a perfect grid.",
          },
        },
        {
          id: "disc-c1l4-2-r2",
          authorId: "self",
          authorName: "Marina Alves",
          createdAt: "2026-11-03T09:30:00-03:00",
          replyTo: { pt: "Camila Rocha", en: "Camila Rocha" },
          body: {
            pt: "Fiz o exercício em 90 BPM e a diferença no hi-hat ficou bem clara. Obrigada por abrir a discussão!",
            en: "I tried the exercise at 90 BPM and the difference in the hi-hat was really clear. Thanks for starting this thread!",
          },
        },
      ],
    },
    {
      id: "disc-c1l4-3",
      authorId: "u-rafael",
      authorName: "Rafael Lima",
      createdAt: "2026-11-01T11:10:00-03:00",
      body: {
        pt: "Qual referência vocês usam para treinar microtiming sem perder a levada?",
        en: "Which reference do you use to practice microtiming without losing the groove?",
      },
      replies: [],
    },
  ],
  "c2-l2": [
    {
      id: "disc-c2l2-1",
      authorId: "u-camila",
      authorName: "Camila Rocha",
      createdAt: "2026-10-29T16:45:00-03:00",
      body: {
        pt: "Como vocês decidem o que vale a pena samplear? Eu acabo guardando tudo e não uso nada.",
        en: "How do you decide what's worth sampling? I end up saving everything and using none of it.",
      },
      replies: [
        {
          id: "disc-c2l2-1-r1",
          authorId: "hisa",
          authorName: "HISA",
          createdAt: "2026-10-30T08:20:00-03:00",
          replyTo: { pt: "Camila Rocha", en: "Camila Rocha" },
          body: {
            pt: "Eu parto de uma necessidade: se a textura não resolve um problema da faixa, não entra. Grave pouco e com intenção.",
            en: "I start from a need: if the texture doesn't solve a problem in the track, it doesn't go in. Record little, but with intention.",
          },
        },
      ],
    },
  ],
  "c3-l1": [
    {
      id: "disc-c3l1-1",
      authorId: "u-rafael",
      authorName: "Rafael Lima",
      createdAt: "2026-10-21T19:05:00-03:00",
      body: {
        pt: "A estrutura de …Baby One More Time ainda funciona no pop de hoje?",
        en: "Does the structure of …Baby One More Time still work in today's pop?",
      },
      replies: [
        {
          id: "disc-c3l1-1-r1",
          authorId: "hisa",
          authorName: "HISA",
          createdAt: "2026-10-22T10:15:00-03:00",
          replyTo: { pt: "Rafael Lima", en: "Rafael Lima" },
          body: {
            pt: "Funciona, mas o contexto mudou. O refrão continua sendo o evento principal; o que muda é a produção ao redor dele.",
            en: "It does, but the context has changed. The chorus is still the main event; what changes is the production around it.",
          },
        },
      ],
    },
  ],
  "c4-l1": [
    {
      id: "disc-c4l1-1",
      authorId: "u-camila",
      authorName: "Camila Rocha",
      createdAt: "2026-10-27T09:00:00-03:00",
      body: {
        pt: "Como vocês treinam ouvido para escalas sem depender do piano roll?",
        en: "How do you train your ear for scales without relying on the piano roll?",
      },
      replies: [
        {
          id: "disc-c4l1-1-r1",
          authorId: "hisa",
          authorName: "HISA",
          createdAt: "2026-10-27T13:30:00-03:00",
          replyTo: { pt: "Camila Rocha", en: "Camila Rocha" },
          body: {
            pt: "Cante a escala antes de tocar e confira depois. Poucos minutos por dia valem mais que uma sessão longa.",
            en: "Sing the scale before playing it, then check. A few minutes a day are worth more than one long session.",
          },
        },
      ],
    },
  ],
};
