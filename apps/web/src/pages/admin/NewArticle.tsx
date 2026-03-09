import { useNavigate } from "react-router-dom";
import { useCreateArticle } from "../../hooks/useArticles";
import ArticleForm from "../../components/admin/ArticleForm";
import type { ArticleFormValues } from "../../components/admin/ArticleForm";

export default function NewArticle() {
  const navigate = useNavigate();
  const createArticle = useCreateArticle();

  const onSubmit = async (data: ArticleFormValues) => {
    await createArticle.mutateAsync(data);
    navigate("/admin/articles");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">New Article</h1>
      <ArticleForm onSubmit={onSubmit} submitLabel="Create Article" />
    </div>
  );
}
