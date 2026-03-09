import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Loader2 } from "lucide-react";
import TipTapEditor from "./TipTapEditor";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().default(""),
  body: z.string().optional().default(""),
  published: z.boolean().optional().default(false),
});

export type ArticleFormValues = z.infer<typeof articleSchema>;

interface ArticleFormProps {
  defaultValues?: Partial<ArticleFormValues>;
  onSubmit: (data: ArticleFormValues) => Promise<void>;
  submitLabel: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function ArticleForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: ArticleFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      body: "",
      published: false,
      ...defaultValues,
    },
  });

  const title = watch("title");
  const isEdit = !!defaultValues?.slug;

  // Auto-generate slug from title only for new articles
  useEffect(() => {
    if (!isEdit && title) {
      setValue("slug", slugify(title));
    }
  }, [title, isEdit, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...register("title")} />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register("slug")} />
          {errors.slug && (
            <p className="text-sm text-destructive">{errors.slug.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" {...register("description")} />
      </div>

      <div className="space-y-2">
        <Label>Body</Label>
        <Controller
          name="body"
          control={control}
          render={({ field }) => (
            <TipTapEditor content={field.value} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="flex items-center gap-3">
        <Controller
          name="published"
          control={control}
          render={({ field }) => (
            <Switch
              id="published"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="published">Published</Label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
