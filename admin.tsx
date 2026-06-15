import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Inbox,
  BarChart3,
  Megaphone,
  Bot,
  AlertTriangle,
  CheckCircle2,
  Clock,
  DollarSign,
  Gauge,
  Sparkles,
  TrendingUp,
  Mail,
  Send,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — NexusAI" },
      { name: "description", content: "Internal operations, analytics, and growth hub for NexusAI teams." },
    ],
  }),
  component: Admin,
});

type Tab = "inbox" | "analytics" | "growth";

function Admin() {
  const [tab, setTab] = useState<Tab>("inbox");

  const tabs: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "inbox", label: "Operations Inbox", icon: Inbox },
    { id: "analytics", label: "Business Analytics", icon: BarChart3 },
    { id: "growth", label: "Marketing & Growth", icon: Megaphone },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-8">
        <div className="text-xs font-semibold uppercase tracking-widest text-primary">
          Admin Operations Suite
        </div>
        <h1 className="mt-1 font-display text-3xl font-bold">Internal Organization Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor AI activity, escalations, and growth in real time.
        </p>
      </div>

      <div className="mb-6 inline-flex rounded-xl border border-border bg-card p-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              tab === t.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inbox" && <InboxTab />}
      {tab === "analytics" && <AnalyticsTab />}
      {tab === "growth" && <GrowthTab />}
    </div>
  );
}

/* ------------------- INBOX ------------------- */

type Ticket = {
  id: string;
  title: string;
  customer: string;
  email: string;
  priority: "CRITICAL" | "HIGH";
  intent: string;
  transcript: { role: "user" | "ai"; text: string }[];
  resolved: boolean;
};

const AI_HANDLED = [
  { id: "a1", title: "FAQ on API Rate Limits", customer: "Alex Reeve", time: "2m" },
  { id: "a2", title: "Reset Password Steps", customer: "Mira Chen", time: "11m" },
  { id: "a3", title: "Feature Documentation Request", customer: "Dev Kapoor", time: "24m" },
];

const INITIAL_ESCALATED: Ticket[] = [
  {
    id: "e1",
    title: "Enterprise pricing for 500 seats",
    customer: "Sarah Mitchell",
    email: "sarah.m@acme-corp.com",
    priority: "CRITICAL",
    intent: "User is evaluating enterprise tier for 500+ seats, mentioned competing vendors and Q1 budget cycle. High-intent buyer.",
    transcript: [
      { role: "user", text: "We need pricing for an enterprise rollout — 500 seats." },
      { role: "ai", text: "Connecting you with our enterprise team for a tailored quote." },
    ],
    resolved: false,
  },
  {
    id: "e2",
    title: "Production bug on webhook delivery",
    customer: "Jordan Hayes",
    email: "jordan@northstack.io",
    priority: "HIGH",
    intent: "Production webhook delivery failing intermittently. Customer reports impact on critical billing pipeline.",
    transcript: [
      { role: "user", text: "We have a bug — webhooks failing in production." },
      { role: "ai", text: "Escalating immediately to engineering on-call." },
    ],
    resolved: false,
  },
];

function InboxTab() {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_ESCALATED);
  const [selected, setSelected] = useState<string | null>("e1");
  const current = tickets.find((t) => t.id === selected);

  const resolve = (id: string) => {
    setTickets((ts) => ts.map((t) => (t.id === id ? { ...t, resolved: true } : t)));
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <Bot className="h-4 w-4 text-success" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Handled by AI</h3>
            <span className="ml-auto rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
              {AI_HANDLED.length} resolved
            </span>
          </div>
          <ul className="space-y-2">
            {AI_HANDLED.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.customer} · {t.time} ago</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-warning/30 bg-card p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <h3 className="text-sm font-bold uppercase tracking-wider">Action Required</h3>
            <span className="ml-auto rounded-full bg-warning/10 px-2 py-0.5 text-xs font-semibold text-warning">
              {tickets.filter((t) => !t.resolved).length} urgent
            </span>
          </div>
          <ul className="space-y-2">
            {tickets.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelected(t.id)}
                  className={`w-full rounded-lg border px-3 py-2.5 text-left transition-all ${
                    selected === t.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <PriorityBadge p={t.priority} />
                    {t.resolved && (
                      <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">
                        RESOLVED
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-sm font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.customer}</div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {current ? <TicketDetail ticket={current} onResolve={() => resolve(current.id)} /> : null}
    </div>
  );
}

function PriorityBadge({ p }: { p: "CRITICAL" | "HIGH" }) {
  const cls =
    p === "CRITICAL"
      ? "bg-destructive/10 text-destructive"
      : "bg-warning/10 text-warning";
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider ${cls}`}>
      {p} · Enterprise Quote
    </span>
  );
}

function TicketDetail({ ticket, onResolve }: { ticket: Ticket; onResolve: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <div className="flex items-center gap-2">
            <PriorityBadge p={ticket.priority} />
            {ticket.resolved && (
              <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold tracking-wider text-success">
                RESOLVED
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-xl font-bold">{ticket.title}</h3>
          <div className="text-sm text-muted-foreground">
            {ticket.customer} · {ticket.email}
          </div>
        </div>
        <button
          onClick={onResolve}
          disabled={ticket.resolved}
          className="inline-flex items-center gap-2 rounded-xl bg-success px-4 py-2.5 text-sm font-semibold text-success-foreground hover:opacity-90 disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          {ticket.resolved ? "Resolved" : "Mark as Resolved"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-[1fr_280px]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Chat Transcript
          </h4>
          <div className="mt-3 space-y-3">
            {ticket.transcript.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-muted"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 to-card p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Summary of Intent
            </div>
            <p className="mt-2 text-sm text-foreground">{ticket.intent}</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Contact Info
            </div>
            <div className="mt-2 space-y-1.5 text-sm">
              <div>{ticket.customer}</div>
              <div className="text-muted-foreground">{ticket.email}</div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------- ANALYTICS ------------------- */

function AnalyticsTab() {
  const kpis = [
    { label: "Avg Human Resolution Time", value: "12 mins", trend: "-18%", icon: Clock, tone: "success" },
    { label: "AI Cost Savings This Month", value: "$42,150", trend: "+24%", icon: DollarSign, tone: "success" },
    { label: "Resource Optimization Score", value: "92%", trend: "+6%", icon: Gauge, tone: "primary" },
  ] as const;

  const workload = [
    { label: "AI Resolved", value: 78, color: "bg-primary" },
    { label: "Human Resolved", value: 18, color: "bg-success" },
    { label: "Pending", value: 4, color: "bg-warning" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                k.tone === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
              }`}>
                <k.icon className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-xs font-semibold text-success">
                {k.trend}
              </span>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">{k.label}</div>
            <div className="mt-1 font-display text-3xl font-bold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Workload Distribution</h3>
          <p className="text-xs text-muted-foreground">AI vs human staff allocation, last 30 days</p>

          <div className="mt-6 space-y-4">
            {workload.map((w) => (
              <div key={w.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{w.label}</span>
                  <span className="font-bold tabular-nums">{w.value}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${w.color} transition-all`}
                    style={{ width: `${w.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-success/5 p-3 text-xs">
            <TrendingUp className="h-4 w-4 text-success" />
            AI is handling <strong>78%</strong> of tickets autonomously this month.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold">Resolution Throughput</h3>
          <p className="text-xs text-muted-foreground">Tickets per day, this week</p>
          <div className="mt-6 flex h-44 items-end gap-3">
            {[42, 58, 51, 67, 73, 49, 81].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-primary to-success transition-all hover:opacity-80"
                  style={{ height: `${(v / 90) * 100}%` }}
                />
                <span className="text-[10px] font-medium text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------- GROWTH ------------------- */

type Lead = {
  name: string;
  company: string;
  cac: string;
  score: "A+" | "A" | "B" | "C";
  campaign: string;
  status: "Active" | "Nurturing" | "Converted";
};

const LEADS: Lead[] = [
  { name: "Sarah Mitchell", company: "Acme Corp", cac: "$42", score: "A+", campaign: "Enterprise Onboarding", status: "Active" },
  { name: "Jordan Hayes", company: "Northstack", cac: "$58", score: "A", campaign: "Technical Deep-dive", status: "Nurturing" },
  { name: "Priya Raman", company: "Lattice Labs", cac: "$71", score: "B", campaign: "Q1 Automation Series", status: "Nurturing" },
  { name: "Marcus Webb", company: "Helix Health", cac: "$38", score: "A+", campaign: "Healthcare Compliance", status: "Converted" },
  { name: "Elena Voss", company: "Brightline", cac: "$92", score: "B", campaign: "SMB Welcome Flow", status: "Active" },
];

function GrowthTab() {
  const [objective, setObjective] = useState("");
  const [generated, setGenerated] = useState<null | { title: string; body: string; cta: string }>(null);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    if (!objective.trim()) return;
    setGenerating(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerated({
        title: `Unlock ${objective} with NexusAI`,
        body: `Built for teams who care about ${objective.toLowerCase()}. Our autonomous engine activates within minutes — no migration required. Limited to enterprise pilots in Q1.`,
        cta: "Claim Early Access",
      });
      setGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border p-5">
          <h3 className="font-display text-lg font-bold">Lead Pipeline Matrix</h3>
          <p className="text-xs text-muted-foreground">Captured by the AI Portal · auto-scored & nurtured</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left">Lead</th>
                <th className="px-5 py-3 text-left">Company</th>
                <th className="px-5 py-3 text-left">CAC Impact</th>
                <th className="px-5 py-3 text-left">Lead Score</th>
                <th className="px-5 py-3 text-left">Nurture Campaign</th>
                <th className="px-5 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {LEADS.map((l) => (
                <tr key={l.name} className="border-t border-border hover:bg-muted/30">
                  <td className="px-5 py-3 font-medium">{l.name}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.company}</td>
                  <td className="px-5 py-3 tabular-nums">{l.cac}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                        l.score === "A+" || l.score === "A"
                          ? "bg-success/15 text-success"
                          : l.score === "B"
                          ? "bg-primary/15 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {l.score}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5" /> {l.campaign}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        l.status === "Converted"
                          ? "bg-success/15 text-success"
                          : l.status === "Active"
                          ? "bg-primary/15 text-primary"
                          : "bg-warning/15 text-warning"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-bold">AI Campaign Generator</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Describe an objective. NexusAI drafts a deployable promo.
          </p>

          <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Product Objective
          </label>
          <input
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            placeholder="e.g. faster onboarding for fintech teams"
            className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />

          <button
            onClick={generate}
            disabled={!objective.trim() || generating}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {generating ? "Generating…" : (
              <>
                Generate Campaign <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-card to-success/5 p-6">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Campaign Preview
          </div>
          {generated ? (
            <div className="mt-3">
              <h4 className="font-display text-xl font-bold">{generated.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{generated.body}</p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background">
                {generated.cta} <Send className="h-3.5 w-3.5" />
              </button>
              <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                <CheckCircle2 className="h-3 w-3" /> Ready to deploy
              </div>
            </div>
          ) : (
            <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
              {generating ? "AI is drafting your campaign…" : "Generated promo will appear here"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
