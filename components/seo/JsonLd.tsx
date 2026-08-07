import { allJsonLdGraphs } from "@/lib/seo";

export function JsonLd() {
  const graphs = allJsonLdGraphs();

  return (
    <>
      {graphs.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
