import { faqJsonLd, personJsonLd, websiteJsonLd } from "@/lib/seo";

export function JsonLd() {
  const graphs = [personJsonLd(), websiteJsonLd(), faqJsonLd()];

  return (
    <>
      {graphs.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
