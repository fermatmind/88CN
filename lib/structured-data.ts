export interface StructuredWebPage {
  "@context": "https://schema.org";
  "@type": "WebPage";
  url: string;
  name: string;
  description: string;
}

export interface StructuredListItem {
  "@type": "ListItem";
  position: number;
  item: {
    "@type": "WebPage";
    "@id": string;
    url: string;
    name: string;
  };
}

export interface StructuredItemList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  itemListElement: StructuredListItem[];
}

export interface StructuredCollectionPage {
  "@context": "https://schema.org";
  "@type": "CollectionPage";
  url: string;
  name: string;
  description: string;
  mainEntity: StructuredItemList;
}

export interface StructuredArticle {
  "@context": "https://schema.org";
  "@type": "TechArticle";
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
}

export function webPageJSONLD(
  url: string,
  title: string,
  description: string
): StructuredWebPage {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: title,
    description,
  };
}

export function itemListJSONLD(
  items: { url: string; name: string }[]
): StructuredItemList {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "WebPage",
        "@id": item.url,
        url: item.url,
        name: item.name,
      },
    })),
  };
}

export function collectionPageJSONLD(
  url: string,
  title: string,
  description: string,
  items: { url: string; name: string }[]
): StructuredCollectionPage {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url,
    name: title,
    description,
    mainEntity: itemListJSONLD(items),
  };
}

export function techArticleJSONLD(
  url: string,
  headline: string,
  description: string,
  datePublished: string
): StructuredArticle {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    url,
    headline,
    description,
    datePublished,
    dateModified: datePublished,
  };
}
