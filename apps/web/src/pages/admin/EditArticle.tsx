import { useParams, useNavigate } from "react-router-dom";
import { useAdminArticle, useUpdateArticle } from "../../hooks/useArticles";
import ArticleForm from "../../components/admin/ArticleForm";
import type { ArticleFormValues } from "../../components/admin/ArticleForm";
import { Loader2 } from "lucide-react";

export default function EditArticle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading } = useAdminArticle(id || "");
  const updateArticle = useUpdateArticle();

  const onSubmit = async (data: ArticleFormValues) => {
    await updateArticle.mutateAsync({ id: id!, ...data });
    navigate("/admin/articles");
  };

  if (isLoading || !article) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit Article</h1>
      <ArticleForm
        defaultValues={{
          title: article.title,
          slug: article.slug,
          description: article.description,
          body: article.body,
          published: article.published,
        }}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
      />
    </div>
  );
}
