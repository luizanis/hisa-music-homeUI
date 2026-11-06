export type SocialLink = {
  id: string;
  /** Translation key for the channel label. */
  key: string;
  handle: string;
  href: string;
};

/**
 * Handles are provisional: they follow the hisamusic.com domain and can be
 * swapped here once the official profiles are confirmed.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "instagram",
    key: "contact.social.instagram",
    handle: "@hisa.wav",
    href: "https://www.instagram.com/hisa.wav",
  },
  {
    id: "youtube-art",
    key: "contact.social.youtubeArt",
    handle: "@hisa.wav",
    href: "https://www.youtube.com/@hisa.wav",
  },
  {
    id: "youtube-creator",
    key: "contact.social.youtubeCreator",
    handle: "@hisaoficial",
    href: "https://www.youtube.com/@hisaoficial",
  },
  {
    id: "tiktok",
    key: "contact.social.tiktok",
    handle: "@hisa.wav",
    href: "https://www.tiktok.com/@hisa.wav",
  },
];
