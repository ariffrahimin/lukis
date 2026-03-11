import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import matter from "gray-matter";
import { marked } from "marked";

const VIRTUAL_MODULE_ID = "virtual:articles";
const RESOLVED_ID = "\0" + VIRTUAL_MODULE_ID;

interface ArticleFrontmatter {
  title: string;
  description?: string;
  published_at?: string;
}

interface ArticleData {
  slug: string;
  title: string;
  description: string;
  published_at: string;
  body: string;
}

function loadArticles(contentDir: string): ArticleData[] {
  if (!fs.existsSync(contentDir)) return [];

  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
  const articles: ArticleData[] = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const frontmatter = data as ArticleFrontmatter;

    if (!frontmatter.title) continue;

    const slug = file.replace(/\.md$/, "");
    const body = marked(content) as string;

    articles.push({
      slug,
      title: frontmatter.title,
      description: frontmatter.description ?? "",
      published_at: frontmatter.published_at ?? "",
      body,
    });
  }

  // Sort by date descending
  articles.sort((a, b) => {
    if (!a.published_at) return 1;
    if (!b.published_at) return -1;
    return b.published_at.localeCompare(a.published_at);
  });

  return articles;
}

export default function articlesPlugin(): Plugin {
  let contentDir: string;

  return {
    name: "vite-plugin-articles",

    configResolved(config) {
      contentDir = path.resolve(config.root, "content/articles");
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) return RESOLVED_ID;
    },

    load(id) {
      if (id !== RESOLVED_ID) return;

      const articles = loadArticles(contentDir);

      const code = `
const articles = ${JSON.stringify(articles)};

export function getArticles() {
  return articles.map(({ body, ...meta }) => meta);
}

export function getArticle(slug) {
  return articles.find((a) => a.slug === slug) || null;
}
`;
      return code;
    },

    configureServer(server) {
      server.watcher.add(contentDir);
      server.watcher.on("change", (file) => {
        if (file.startsWith(contentDir)) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: "full-reload" });
          }
        }
      });
      server.watcher.on("add", (file) => {
        if (file.startsWith(contentDir) && file.endsWith(".md")) {
          const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
            server.ws.send({ type: "full-reload" });
          }
        }
      });
    },
  };
}
