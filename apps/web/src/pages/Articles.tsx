import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AdBanner } from "../components/AdBanner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useArticles } from "../hooks/useArticles";

export default function Articles() {
  const { data: articles, isLoading, error } = useArticles();

  useEffect(() => {
    document.title = "Articles - Basically";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
          <span className="text-lg font-bold tracking-tight">
            <span className="text-primary">Basically</span>{" "}
            <span className="text-muted-foreground font-normal text-sm">Articles</span>
          </span>
          <Button variant="ghost" size="sm" asChild>
            <a href="/" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Canvas
            </a>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        {/* Hero */}
        <section className="text-center space-y-3 pb-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="text-primary">Articles</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Insights on cloud architecture, system design, and diagramming.
          </p>
        </section>

        {/* Article list */}
        {isLoading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-muted-foreground">
            <p>Failed to load articles. Please try again later.</p>
          </div>
        )}

        {articles && articles.length === 0 && (
          <div className="text-center py-20 text-muted-foreground space-y-2">
            <FileText className="h-10 w-10 mx-auto opacity-40" />
            <p>No articles yet. Check back soon!</p>
          </div>
        )}

        {articles && articles.length > 0 && (
          <div className="grid gap-4">
            {articles.map((article) => (
              <Link key={article.slug} to={`/articles/${article.slug}`}>
                <Card className="border-muted/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    {article.published_at && (
                      <p className="text-xs text-muted-foreground">
                        {new Date(article.published_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </CardHeader>
                  {article.description && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {article.description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Bottom nav */}
        <section className="text-center py-8 pb-[106px] space-y-4">
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/guide">Read the Guide</Link>
            </Button>
            <Button size="sm" asChild>
              <a href="/">Open Canvas</a>
            </Button>
          </div>
        </section>
      </main>
      <AdBanner />
    </div>
  );
}
