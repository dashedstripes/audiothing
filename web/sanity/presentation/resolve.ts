import {
  defineLocations,
  PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    news: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/en/news/${doc?.slug}`,
          },
          { title: "Home", href: "/en" },
        ],
      }),
    }),
    tutorial: defineLocations({
      select: { title: "title", slug: "slug.current" },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/en/tutorials/${doc?.slug}`,
          },
          { title: "Home", href: "/en" },
        ],
      }),
    }),
    banner: defineLocations({
      select: { title: "title" },
      resolve: (doc) => ({
        locations: [{ title: doc?.title || "Banner", href: "/en" }],
      }),
    }),
  },
};
