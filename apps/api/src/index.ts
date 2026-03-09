import { Hono } from "hono";
import { corsMiddleware } from "./middleware/cors.ts";
import articles from "./routes/articles.ts";
import uploads from "./routes/uploads.ts";
import type { Env } from "./types.ts";

const app = new Hono<Env>();

app.use("*", corsMiddleware);

app.get("/", (c) => c.json({ status: "ok" }));

app.route("/articles", articles);
app.route("/uploads", uploads);

export default app;
