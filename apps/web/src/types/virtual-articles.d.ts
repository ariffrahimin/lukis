declare module "virtual:articles" {
  export interface ArticleMeta {
    slug: string;
    title: string;
    description: string;
    published_at: string;
  }

  export interface Article extends ArticleMeta {
    body: string;
  }

  export function getArticles(): ArticleMeta[];
  export function getArticle(slug: string): Article | null;
}
