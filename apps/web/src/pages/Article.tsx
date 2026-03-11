import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getArticle } from "virtual:articles";

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = getArticle(slug || "");

  useEffect(() => {
    if (article?.title) {
      document.title = `${article.title} - Basically`;
    }
  }, [article?.title]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/articles" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Articles
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <a href="/" className="gap-2">
              Back to Canvas
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 pb-[140px]">
        {article && (
          <article>
            <header className="mb-8 space-y-3">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {article.title}
              </h1>
              {article.published_at && (
                <p className="text-sm text-muted-foreground">
                  {new Date(article.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
              {article.description && (
                <p className="text-muted-foreground text-base leading-relaxed">
                  {article.description}
                </p>
              )}
            </header>

            {article.body && (
              <div
                className="article-prose"
                dangerouslySetInnerHTML={{ __html: article.body }}
              />
            )}
          </article>
        )}

        {!article && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Article not found.</p>
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link to="/articles">Back to Articles</Link>
            </Button>
          </div>
        )}
      </main>
      <AdBanner />
    </div>
  );
}
