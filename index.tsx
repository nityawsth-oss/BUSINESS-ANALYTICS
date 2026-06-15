import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Workflow,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Lock,
  Zap,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexusAI — Autonomous AI Engine for Enterprise" },
      { name: "description", content: "Unify customer engagement, automate business workflows, and scale marketing pipelines with responsible, guardrailed AI." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main>
      {/* Hero */}
      <section className="gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,oklch(0.55_0.22_264/0.3),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            AI Models Online · 98.7% confidence
          </div>

          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
            The Autonomous AI Engine for{" "}
            <span className="text-gradient">Enterprise Operations & Growth</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/70">
            Unify customer engagement, automate business workflows, and scale marketing pipelines
            with responsible, guardrailed AI.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/portal"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Launch AI Portal
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              Request Enterprise Demo
            </a>
          </div>

          {/* Trust ribbon */}
          <div className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { label: "Automation Rate", value: "94%", icon: Zap },
              { label: "Hours Saved", value: "12k+", icon: Workflow },
              { label: "Pipeline Generated", value: "$2.4M", icon: TrendingUp },
            ].map((s) => (
              <div
                key={s.label}
                className="glass-dark rounded-2xl p-6 text-left"
              >
                <s.icon className="h-5 w-5 text-success" />
                <div className="mt-3 font-display text-3xl font-bold text-white">{s.value}</div>
                <div className="mt-1 text-sm text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Bento */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-14 text-center">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">
            Capabilities
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
            One platform. Three intelligent engines.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-2">
          <FeatureCard
            className="md:col-span-2 md:row-span-2"
            icon={ShieldCheck}
            tag="Customer Engagement"
            title="Responsible AI with 99.9% accuracy"
            desc="Every response is grounded in your verified knowledge base. Strict safety guardrails, transparent citations, and zero-hallucination architecture protect your brand."
            highlight
          >
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                "Source-cited responses",
                "PII redaction by default",
                "Tone & policy enforcement",
                "Human handoff triggers",
              ].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {t}
                </div>
              ))}
            </div>
          </FeatureCard>

          <FeatureCard
            icon={Workflow}
            tag="Business Ops"
            title="Workflow Automation"
            desc="Auto-route tickets, manage operations, and escalate to human teams the moment context demands it."
          />

          <FeatureCard
            icon={TrendingUp}
            tag="Growth"
            title="Hyper-Targeted Marketing"
            desc="AI-driven lead qualification, dynamic offers, and end-to-end campaign generation."
          />
        </div>
      </section>

      {/* Trust */}
      <section id="demo" className="border-t border-border bg-muted/40 py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Lock className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl font-bold md:text-4xl">
            Trusted with the world's most sensitive data
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Built from the ground up for compliance, accountability, and ethical AI handling.
          </p>

          <div className="mx-auto mt-10 flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "SOC 2 Type II", sub: "Audited" },
              { name: "GDPR", sub: "Compliant" },
              { name: "CCPA", sub: "Ready" },
              { name: "ISO 27001", sub: "Certified" },
              { name: "HIPAA", sub: "Available" },
            ].map((b) => (
              <div
                key={b.name}
                className="flex items-center gap-3 rounded-xl border border-border bg-card px-5 py-3 shadow-sm"
              >
                <ShieldCheck className="h-5 w-5 text-success" />
                <div className="text-left">
                  <div className="text-sm font-semibold">{b.name}</div>
                  <div className="text-xs text-muted-foreground">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/portal"
            className="mt-12 inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" /> Try the AI Portal
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 NexusAI · Autonomous AI Operations Hub
      </footer>
    </main>
  );
}

function FeatureCard({
  icon: Icon,
  tag,
  title,
  desc,
  className = "",
  highlight = false,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  title: string;
  desc: string;
  className?: string;
  highlight?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border border-border p-8 transition-all hover:-translate-y-1 hover:shadow-xl ${
        highlight ? "bg-gradient-to-br from-primary/5 via-card to-success/5" : "bg-card"
      } ${className}`}
    >
      <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {tag}
      </div>
      <h3 className="mt-2 font-display text-2xl font-bold">{title}</h3>
      <p className="mt-3 text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}
