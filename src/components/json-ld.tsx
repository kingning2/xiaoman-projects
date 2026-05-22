import type { Project, Tool } from "@/lib/types/asset";
import { siteConfig } from "@/lib/site";

type HomeJsonLdProps = {
  projects: Project[];
  tools: Tool[];
};

function buildItemList(
  name: string,
  items: { name: string; description: string; githubUrl: string }[],
) {
  return {
    "@type": "ItemList",
    name,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: item.name,
        description: item.description,
        codeRepository: item.githubUrl,
        url: item.githubUrl,
      },
    })),
  };
}

export function HomeJsonLd({ projects, tools }: HomeJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: siteConfig.name,
        description: siteConfig.description,
        url: siteConfig.url,
        inLanguage: "zh-CN",
      },
      buildItemList("开源项目", projects),
      buildItemList("开发工具", tools),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
