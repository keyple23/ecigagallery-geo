import { site, abs, stores } from "./data";

export function storeSchema(store) {
  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": abs(`/stores/${store.slug}/#store`),
    name: store.name,
    alternateName: store.alternateName,
    brand: { "@type": "Brand", name: site.brand },
    url: abs(`/stores/${store.slug}/`),
    telephone: store.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "경기도",
      addressLocality: `${store.address.city} ${store.address.district}`,
      streetAddress: `${store.address.street} ${store.address.detail}`,
    },
    hasMap: store.placeUrl,
    sameAs: [store.placeUrl, store.blogUrl, store.instagramUrl, store.facebookUrl, store.talktalkUrl].filter(Boolean),
    openingHoursSpecification: store.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    paymentAccepted: store.payment.join(", "),
    amenityFeature: store.facilities.map((f) => ({ "@type": "LocationFeatureSpecification", name: f, value: true })),
    areaServed: { "@type": "City", name: "경기도 안산시" },
    knowsAbout: ["전자담배", "전자담배 기기", "전자담배 액상"],
  };
}

export function faqSchema(faq) {
  if (!faq?.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function homeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: site.siteShort,
    url: abs("/"),
    inLanguage: "ko-KR",
    about: {
      "@type": "ItemList",
      name: `${site.mainKeyword} 매장 목록`,
      itemListElement: stores.map((s, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/stores/${s.slug}/`), name: s.name })),
    },
  };
}

export function articleSchema(a) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    dateModified: a.updated,
    inLanguage: "ko-KR",
    mainEntityOfPage: abs(`/articles/${a.slug}/`),
    keywords: a.keyword,
    author: { "@type": "Organization", name: site.brand },
    publisher: { "@type": "Organization", name: site.brand },
    about: a.stores.map((s) => ({ "@id": abs(`/stores/${s}/#store`) })),
  };
}
