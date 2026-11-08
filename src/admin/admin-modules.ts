export type AdminPlannedModule = {
  id: string;
  descriptionKey: string;
  scopeKeys: [string, string];
};

/**
 * Copy for modules that are intentionally not implemented in the wireframe.
 * Each page uses the same structural shell and states what the module will
 * cover without inventing operational data.
 */
export const adminPlannedModules: Record<string, AdminPlannedModule> = {
  "academy-courses": {
    id: "academy-courses",
    descriptionKey: "admin.module.academy-courses.description",
    scopeKeys: [
      "admin.module.academy-courses.scope.1",
      "admin.module.academy-courses.scope.2",
    ],
  },
  "academy-students": {
    id: "academy-students",
    descriptionKey: "admin.module.academy-students.description",
    scopeKeys: [
      "admin.module.academy-students.scope.1",
      "admin.module.academy-students.scope.2",
    ],
  },
  "academy-certificates": {
    id: "academy-certificates",
    descriptionKey: "admin.module.academy-certificates.description",
    scopeKeys: [
      "admin.module.academy-certificates.scope.1",
      "admin.module.academy-certificates.scope.2",
    ],
  },
  "academy-community": {
    id: "academy-community",
    descriptionKey: "admin.module.academy-community.description",
    scopeKeys: [
      "admin.module.academy-community.scope.1",
      "admin.module.academy-community.scope.2",
    ],
  },
  "business-sales": {
    id: "business-sales",
    descriptionKey: "admin.module.business-sales.description",
    scopeKeys: [
      "admin.module.business-sales.scope.1",
      "admin.module.business-sales.scope.2",
    ],
  },
  "business-marketing": {
    id: "business-marketing",
    descriptionKey: "admin.module.business-marketing.description",
    scopeKeys: [
      "admin.module.business-marketing.scope.1",
      "admin.module.business-marketing.scope.2",
    ],
  },
  "business-analytics": {
    id: "business-analytics",
    descriptionKey: "admin.module.business-analytics.description",
    scopeKeys: [
      "admin.module.business-analytics.scope.1",
      "admin.module.business-analytics.scope.2",
    ],
  },
  "content-website": {
    id: "content-website",
    descriptionKey: "admin.module.content-website.description",
    scopeKeys: [
      "admin.module.content-website.scope.1",
      "admin.module.content-website.scope.2",
    ],
  },
  "content-music": {
    id: "content-music",
    descriptionKey: "admin.module.content-music.description",
    scopeKeys: [
      "admin.module.content-music.scope.1",
      "admin.module.content-music.scope.2",
    ],
  },
  "content-announcements": {
    id: "content-announcements",
    descriptionKey: "admin.module.content-announcements.description",
    scopeKeys: [
      "admin.module.content-announcements.scope.1",
      "admin.module.content-announcements.scope.2",
    ],
  },
};
