/** The four public destinations that sit beside the homepage. */
export const mainNav = [
  { path: "academy", key: "nav.academy" },
  { path: "sounds", key: "nav.sounds" },
  { path: "music", key: "nav.music" },
  { path: "contact", key: "nav.contact" },
] as const;

/** Areas introduced on the homepage, in reading order. */
export const ecosystemAreas = ["academy", "sounds", "music"] as const;

export const serviceItems = [
  "production",
  "songwriting",
  "mentorship",
] as const;

export const manifestoPrinciples = [
  "independence",
  "experimentation",
  "tools",
  "sharing",
] as const;
