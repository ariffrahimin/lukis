export interface Article {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type ArticleSummary = Omit<Article, "body">;

export interface CreateArticlePayload {
  title: string;
  slug: string;
  description?: string;
  body?: string;
  published?: boolean;
}

export interface UpdateArticlePayload {
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
  published?: boolean;
}
