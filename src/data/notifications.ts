import type { LocalizedText } from "@/lib/catalog";

export type NotificationCategory =
  | "community"
  | "learning"
  | "orders"
  | "academy";

export type MockNotification = {
  id: string;
  category: NotificationCategory;
  title: LocalizedText;
  description: LocalizedText;
  createdAt: string;
  /** Locale-less in-site path, built with useLocale().to() at render time. */
  link: string;
  /** Older items start as read so the demo opens with a realistic inbox. */
  readByDefault: boolean;
};

export const notificationCategories: NotificationCategory[] = [
  "community",
  "learning",
  "orders",
  "academy",
];

/**
 * Prototype inbox. In production these rows would be created by backend
 * events: verified payments, real replies and mentions, enrollment progress,
 * and published catalog changes. Read state is already modelled per user.
 */
export const seedNotifications: MockNotification[] = [
  {
    id: "community-reply-camila",
    category: "community",
    title: {
      pt: "Camila respondeu à sua pergunta",
      en: "Camila replied to your question",
    },
    description: {
      pt: "Em “Swing e microtiming”, na aula de Introdução a Produção Musical.",
      en: "In “Swing and microtiming”, from Introduction to Music Production.",
    },
    createdAt: "2026-11-03T12:41:00-03:00",
    link: "courses/introducao-producao-musical/learn?lesson=c1-l4#discussion-disc-c1l4-1",
    readByDefault: false,
  },
  {
    id: "community-hisa-reply",
    category: "community",
    title: {
      pt: "HISA respondeu na discussão",
      en: "HISA replied in the discussion",
    },
    description: {
      pt: "Sobre referências de microtiming. Continue a conversa com a turma.",
      en: "About microtiming references. Keep the conversation going with the class.",
    },
    createdAt: "2026-11-02T17:06:00-03:00",
    link: "courses/introducao-producao-musical/learn?lesson=c1-l4#discussion-disc-c1l4-2",
    readByDefault: false,
  },
  {
    id: "learning-reminder",
    category: "learning",
    title: {
      pt: "Continue de onde parou",
      en: "Pick up where you left off",
    },
    description: {
      pt: "Sentimos sua falta! Que tal continuar de onde você parou? Você está em 50% de Introdução a Produção Musical.",
      en: "We miss having you around! Ready to pick up where you left off? You're 50% through Introduction to Music Production.",
    },
    createdAt: "2026-11-05T09:00:00-03:00",
    link: "courses/introducao-producao-musical/learn?lesson=c1-l4",
    readByDefault: false,
  },
  {
    id: "learning-milestone-50",
    category: "learning",
    title: {
      pt: "Você chegou a 50% do curso",
      en: "You reached 50% of the course",
    },
    description: {
      pt: "Introdução a Produção Musical · 3 de 6 aulas concluídas.",
      en: "Introduction to Music Production · 3 of 6 lessons completed.",
    },
    createdAt: "2026-11-03T21:40:00-03:00",
    link: "courses/introducao-producao-musical/learn?lesson=c1-l4",
    readByDefault: true,
  },
  {
    id: "learning-certificate",
    category: "learning",
    title: {
      pt: "Parabéns! Você concluiu seu curso.",
      en: "Congratulations! You completed your course.",
    },
    description: {
      pt: "Seu certificado de Analisando a Discografia da Britney Spears está disponível.",
      en: "Your certificate for Analyzing Britney Spears' Discography is ready.",
    },
    createdAt: "2026-09-12T10:20:00-03:00",
    link: "certificate/analisando-britney-spears",
    readByDefault: true,
  },
  {
    id: "learning-new-material",
    category: "learning",
    title: {
      pt: "Novo material disponível",
      en: "New material available",
    },
    description: {
      pt: "Produção Musical Intermediária ganhou um projeto de exemplo em Texturas e resampling.",
      en: "Intermediate Music Production has a new sample project in Textures and resampling.",
    },
    createdAt: "2026-10-30T08:30:00-03:00",
    link: "courses/producao-musical-intermediaria/learn?lesson=c2-l2",
    readByDefault: false,
  },
  {
    id: "order-paid-1042",
    category: "orders",
    title: {
      pt: "Pagamento confirmado",
      en: "Payment confirmed",
    },
    description: {
      pt: "Pedido HISA-2026-1042 · BUNDLE: COMPLETE HISA PACK VOL 1 já está na sua biblioteca.",
      en: "Order HISA-2026-1042 · COMPLETE HISA PACK VOL 1 is now in your library.",
    },
    createdAt: "2026-10-30T10:01:00-03:00",
    link: "my-orders?order=HISA-2026-1042#order-detail-HISA-2026-1042",
    readByDefault: true,
  },
  {
    id: "order-pending-1019",
    category: "orders",
    title: {
      pt: "Pagamento pendente",
      en: "Payment pending",
    },
    description: {
      pt: "Pedido HISA-2026-1019 aguarda a confirmação do Pix. Confira os detalhes.",
      en: "Order HISA-2026-1019 is waiting for Pix confirmation. Check the details.",
    },
    createdAt: "2026-09-18T09:31:00-03:00",
    link: "my-orders?order=HISA-2026-1019#order-detail-HISA-2026-1019",
    readByDefault: false,
  },
  {
    id: "library-product",
    category: "orders",
    title: {
      pt: "Seu produto está na biblioteca",
      en: "Your product is in the library",
    },
    description: {
      pt: "Vocal Chops & Harmonies foi liberado em Minha biblioteca.",
      en: "Vocal Chops & Harmonies is now available in My library.",
    },
    createdAt: "2026-10-03T20:06:00-03:00",
    link: "my-library",
    readByDefault: true,
  },
  {
    id: "academy-new-course",
    category: "academy",
    title: {
      pt: "Novo curso na Academy",
      en: "New course in Academy",
    },
    description: {
      pt: "Produção Musical Avançada já está disponível no catálogo.",
      en: "Advanced Music Production is now available in the catalog.",
    },
    createdAt: "2026-10-24T10:00:00-03:00",
    link: "product/producao-musical-avancada",
    readByDefault: true,
  },
  {
    id: "academy-free-pack",
    category: "academy",
    title: {
      pt: "Novo pack gratuito",
      en: "New free pack",
    },
    description: {
      pt: "HISA Free Sampler Vol. 1 liberado para contas HISA.",
      en: "HISA Free Sampler Vol. 1 is available for HISA accounts.",
    },
    createdAt: "2026-11-04T15:00:00-03:00",
    link: "product/hisa-free-sampler-vol-1",
    readByDefault: false,
  },
  {
    id: "academy-certificates",
    category: "academy",
    title: {
      pt: "Certificados já estão disponíveis",
      en: "Certificates are now available",
    },
    description: {
      pt: "Conclua um curso e baixe seu certificado na área do aluno.",
      en: "Complete a course and download your certificate in the student area.",
    },
    createdAt: "2026-10-15T12:00:00-03:00",
    link: "my-courses",
    readByDefault: true,
  },
];
