import { Hono } from "hono";
import { createSupabaseClient } from "../lib/supabase.ts";
import { authMiddleware } from "../middleware/auth.ts";
import type { Env } from "../types.ts";

const uploads = new Hono<Env>();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

uploads.post("/image", authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return c.json({ error: "No file provided" }, 400);
    }

    const blob = file as unknown as Blob;
    const fileType = blob.type;
    const fileSize = blob.size;

    if (!ALLOWED_TYPES.includes(fileType)) {
      return c.json({ error: "Only JPEG, PNG, and WebP images are allowed" }, 400);
    }

    if (fileSize > MAX_SIZE) {
      return c.json({ error: "File must be less than 10 MB" }, 400);
    }

    // Compress with TinyPNG
    const rawBytes = await blob.arrayBuffer();
    const shrinkRes = await fetch("https://api.tinify.com/shrink", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`api:${c.env.TINYPNG_API_KEY}`)}`,
      },
      body: rawBytes,
    });

    if (!shrinkRes.ok) {
      const errBody = await shrinkRes.text();
      return c.json({ error: `TinyPNG compression failed: ${errBody}` }, 502);
    }

    const shrinkResult = (await shrinkRes.json()) as { output: { url: string } };

    // Download compressed image (TinyPNG output URL requires auth)
    const compressedRes = await fetch(shrinkResult.output.url, {
      headers: {
        Authorization: `Basic ${btoa(`api:${c.env.TINYPNG_API_KEY}`)}`,
      },
    });
    if (!compressedRes.ok) {
      return c.json({ error: "Failed to download compressed image" }, 502);
    }

    const compressedBuffer = new Uint8Array(await compressedRes.arrayBuffer());

    // Upload to Supabase Storage
    const userId = c.get("userId");
    const ext = EXT_MAP[fileType] || "png";
    const path = `${userId}/${Date.now()}.${ext}`;

    const db = createSupabaseClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY);
    const { error: uploadError } = await db.storage
      .from("article-images")
      .upload(path, compressedBuffer, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      return c.json({ error: `Storage upload failed: ${uploadError.message}` }, 500);
    }

    const url = `${c.env.SUPABASE_URL}/storage/v1/object/public/article-images/${path}`;

    return c.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: message }, 500);
  }
});

export default uploads;
