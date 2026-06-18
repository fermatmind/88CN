export interface PublicScoutedProfilePlaceholder {
  slug: string;
  indexStatus: "noindex";
  followPolicy: "nofollow";
  publicApiExposure: false;
  sitemapExposure: false;
}

export function getPublicScoutedProfilePlaceholder(slug: string): PublicScoutedProfilePlaceholder {
  return {
    slug,
    indexStatus: "noindex",
    followPolicy: "nofollow",
    publicApiExposure: false,
    sitemapExposure: false,
  };
}
