import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Pen,
  BookOpen,
  FileText,
  Boxes,
  Cable,
  Download,
  Sparkles,
} from "lucide-react";

function useInView() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.15 }
    );

    const children = el.querySelectorAll(".reveal");
    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, []);

  return ref;
}

function GridBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Gradient mesh */}
      <div
        className="absolute -top-[40%] -left-[20%] h-[80%] w-[60%] rounded-full opacity-[0.07]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(187 72% 50%), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[10%] h-[70%] w-[50%] rounded-full opacity-[0.05]"
        style={{
          background:
            "radial-gradient(ellipse at center, hsl(262 83% 58%), transparent 70%)",
        }}
      />
      {/* Grid lines */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.04]">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  to,
  label,
  accent,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  label: string;
  accent: string;
  delay: number;
}) {
  return (
    <Link
      to={to}
      className="reveal group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-500 hover:border-border/80 hover:bg-card/50"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Accent line */}
      <div className={`h-[2px] w-full ${accent}`} />

      <div className="flex flex-1 flex-col p-6 sm:p-8">
        {/* Icon */}
        <div
          className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl ${accent} bg-opacity-10 transition-transform duration-300 group-hover:scale-110`}
          style={{ background: `hsl(var(--card))` }}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>

        {/* Content */}
        <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* CTA */}
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-all duration-300 group-hover:gap-3">
          {label}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export default function Home() {
  const sectionRef = useInView();

  useEffect(() => {
    document.title = "Basically - Visual Diagram Editor";
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <GridBackground />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Pen className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Basically</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm sm:flex">
            <Link to="/canvas" className="text-muted-foreground transition-colors hover:text-foreground">
              Canvas
            </Link>
            <Link to="/guide" className="text-muted-foreground transition-colors hover:text-foreground">
              Guide
            </Link>
            <Link to="/articles" className="text-muted-foreground transition-colors hover:text-foreground">
              Articles
            </Link>
          </nav>
          <Link
            to="/canvas"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all duration-200 hover:brightness-110"
          >
            Open Canvas
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main ref={sectionRef}>
        {/* Hero */}
        <section className="relative px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="reveal mb-6 inline-flex items-center gap-2 rounded-full border border-border/50 bg-card/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-primary" />
              Free &middot; No sign-up &middot; Browser-based
            </div>

            <h1 className="reveal mb-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              Diagram your<br />
              <span className="text-primary">cloud architecture</span>
            </h1>

            <p className="reveal mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Drag cloud services onto a canvas, connect them, and export.
              Beautiful architecture diagrams in minutes — no design skills needed.
            </p>

            <div className="reveal flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/canvas"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
              >
                Start Building
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/guide"
                className="inline-flex items-center gap-2 rounded-xl border border-border/50 bg-card/30 px-7 py-3 text-sm font-medium text-foreground backdrop-blur-sm transition-all duration-200 hover:bg-card/60"
              >
                Read the Guide
              </Link>
            </div>
          </div>

          {/* Stats strip */}
          <div className="reveal mx-auto mt-16 flex max-w-lg items-center justify-center gap-8 sm:gap-14">
            <StatBadge value="130+" label="Components" />
            <div className="h-8 w-px bg-border/40" />
            <StatBadge value="5" label="Cloud Providers" />
            <div className="h-8 w-px bg-border/40" />
            <StatBadge value="3" label="Export Formats" />
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        {/* Three Modules */}
        <section className="relative px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Everything you need
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Three modules that work together — draw, learn, and read.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <FeatureCard
                icon={Pen}
                title="The Canvas"
                description="A full diagram editor with 130+ cloud service nodes, smart connectors, sub-flows, layers, and export to PNG, JSON, or GIF. Drag, drop, and build."
                to="/canvas"
                label="Open Editor"
                accent="bg-primary"
                delay={0}
              />
              <FeatureCard
                icon={BookOpen}
                title="The Guide"
                description="Step-by-step walkthrough of every tool, shortcut, and feature. From adding your first node to exporting a polished diagram."
                to="/guide"
                label="Read Guide"
                accent="bg-primary"
                delay={100}
              />
              <FeatureCard
                icon={FileText}
                title="The Articles"
                description="Insights on cloud architecture, system design patterns, and diagramming best practices from real-world experience."
                to="/articles"
                label="Browse Articles"
                accent="bg-primary"
                delay={200}
              />
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        </div>

        {/* Capabilities */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="reveal mb-12 text-center">
              <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
                Built for architects
              </h2>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Professional diagramming tools, right in your browser.
              </p>
            </div>

            <div className="reveal grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Boxes,
                  title: "Multi-Cloud",
                  desc: "AWS, GCP, Azure, Oracle Cloud, plus databases, languages, and shapes.",
                },
                {
                  icon: Cable,
                  title: "Smart Edges",
                  desc: "Bezier, straight, and step connectors with customizable markers.",
                },
                {
                  icon: Download,
                  title: "Export Anywhere",
                  desc: "Save as PNG for docs, JSON for version control, or GIF for animated previews.",
                },
                {
                  icon: Sparkles,
                  title: "Animated Nodes",
                  desc: "13 animated icons that bring your architecture diagrams to life.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-border/30 bg-card/20 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-border/50 hover:bg-card/40"
                >
                  <item.icon className="mb-3 h-5 w-5 text-primary" />
                  <h4 className="mb-1 text-sm font-semibold text-foreground">
                    {item.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 pb-32 pt-8">
          <div className="reveal mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:text-3xl">
              Start diagramming now
            </h2>
            <p className="mb-8 text-sm text-muted-foreground">
              No account needed. Open the canvas and build something.
            </p>
            <Link
              to="/canvas"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:brightness-110"
            >
              Open Canvas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
