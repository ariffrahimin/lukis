import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "../lib/api";
import { useAuth } from "./useAuth";
import type {
  Article,
  ArticleSummary,
  CreateArticlePayload,
  UpdateArticlePayload,
} from "../types/articles";

// --- Public hooks ---

export function useArticles() {
  return useQuery<ArticleSummary[]>({
    queryKey: ["articles"],
    queryFn: () => apiFetch("/articles"),
  });
}

export function useArticle(slug: string) {
  return useQuery<Article>({
    queryKey: ["article", slug],
    queryFn: () => apiFetch(`/articles/${slug}`),
    enabled: !!slug,
  });
}

// --- Admin hooks ---

export function useAdminArticles() {
  const { getAccessToken } = useAuth();
  return useQuery<ArticleSummary[]>({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const token = await getAccessToken();
      return apiFetch("/articles?all=true", { token: token ?? undefined });
    },
  });
}

export function useAdminArticle(id: string) {
  const { getAccessToken } = useAuth();
  return useQuery<Article>({
    queryKey: ["admin-article", id],
    queryFn: async () => {
      const token = await getAccessToken();
      return apiFetch(`/articles/${id}?admin=true`, {
        token: token ?? undefined,
      });
    },
    enabled: !!id,
  });
}

// --- Mutations ---

export function useCreateArticle() {
  const { getAccessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateArticlePayload) => {
      const token = await getAccessToken();
      return apiFetch<Article>("/articles", {
        method: "POST",
        body: payload,
        token: token ?? undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}

export function useUpdateArticle() {
  const { getAccessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: UpdateArticlePayload & { id: string }) => {
      const token = await getAccessToken();
      return apiFetch<Article>(`/articles/${id}`, {
        method: "PUT",
        body: payload,
        token: token ?? undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      qc.invalidateQueries({ queryKey: ["admin-article"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
      qc.invalidateQueries({ queryKey: ["article"] });
    },
  });
}

export function useDeleteArticle() {
  const { getAccessToken } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getAccessToken();
      return apiFetch(`/articles/${id}`, {
        method: "DELETE",
        token: token ?? undefined,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-articles"] });
      qc.invalidateQueries({ queryKey: ["articles"] });
    },
  });
}
