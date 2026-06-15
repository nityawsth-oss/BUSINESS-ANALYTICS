import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ShieldCheck,
  Activity,
  Lock,
  Cpu,
  Send,
  Sparkles,
  BadgeCheck,
  AlertTriangle,
  Gift,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "AI Portal — NexusAI" },
      { name: "description", content: "Interactive AI query portal with safety guardrails and verified responses." },
    ],
  }),
  component: Portal,
});

type Msg = {
  id: string;
  role: "user" | "ai" | "system";
  content: string;
  source?: string;
  typing?: boolean;
};

const ESCALATION_KEYWORDS = ["urgent", "pricing", "quote", "enterprise", "complaint", "bug", "human"];

const SUGGESTIONS = [
  { label: "Request Enterprise Quote", escalate: true },
  { label: "Optimize Operations Workflow", escalate: false },
  { label: "Analyze Marketing Performance", escalate: false },
  { label: "Report System Bug", escalate: true },
];

const AI_KB: Record<string, { answer: string; source: string }> = {
  optimize: {
    answer:
      "I can streamline your operations by auto-routing tickets, flagging SLA risks, and rebalancing workload between AI and human agents. Most teams see a 38% reduction in resolution time within 30 days.",
    source: "KB: Operations Playbook v3.2 §4",
  },
  marketing: {
    answer:
      "Your last 30 days show a 24% lift in qualified leads. Top channel: organic outbound (CAC $42). I recommend reallocating 15% of paid budget to nurture sequences for B-tier leads.",
    source: "KB: Growth Analytics Module",
  },
  default: {
    answer:
      "I've reviewed your request against our verified knowledge base. Here's a grounded summary with the relevant source so you can audit my reasoning.",
    source: "KB: General Knowledge v12",
  },
};

function Portal() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "init",
      role: "ai",
      content:
        "Hi — I'm Nexus, your autonomous operations assistant. Ask me anything, or tap a suggestion below.",
      source: "System Prompt",
    },
  ]);
  const [input, setInput] = useState("");
  const [escalated, setEscalated] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState<null | { name: string; offer: string }>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, escalated, leadSubmitted]);

  const detectEscalation = (text: string) =>
    ESCALATION_KEYWORDS.some((k) => text.toLowerCase().includes(k));

  const respond = (userText: string, forceEscalate = false) => {
    const userMsg: Msg = { id: crypto.randomUUID(), role: "user", content: userText };
    setMessages((m) => [...m, userMsg]);

    const escalate = forceEscalate || detectEscalation(userText);
    const lower = userText.toLowerCase();
    const kb = lower.includes("optim") || lower.includes("workflow")
      ? AI_KB.optimize
      : lower.includes("market")
      ? AI_KB.marketing
      : AI_KB.default;

    const typingId = crypto.randomUUID();
    setMessages((m) => [...m, { id: typingId, role: "ai", content: "", typing: true }]);

    setTimeout(() => {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === typingId
            ? { ...msg, content: kb.answer, source: kb.source, typing: false }
            : msg
        )
      );
      if (escalate) {
        setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: crypto.randomUUID(),
              role: "system",
              content:
                "✨ This requires executive priority. I am initializing our Intelligent Escalation Protocol to notify our human operations team immediately.",
            },
          ]);
          setEscalated(true);
        }, 700);
      }
    }, 900);
  };

  const handleSend = () => {
    if (!input.trim() || escalated) return;
    respond(input.trim());
    setInput("");
  };

  return (
    <div className="mx-auto grid h-[calc(100vh-4rem)] max-w-7xl grid-cols-1 gap-6 p-6 lg:grid-cols-[360px_1fr]">
      {/* Left: Safety panel */}
      <aside className="overflow-y-auto rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-success" />
          <h2 className="font-display text-lg font-bold">AI System Status</h2>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">Safety guardrails active</p>

        <div className="mt-6 space-y-4">
          <StatusRow icon={Cpu} label="Model Integrity" value="Verified" tone="success" />
          <StatusRow icon={Activity} label="Confidence Rating" value="98.7%" tone="success" />
          <StatusRow icon={Lock} label="Privacy Compliance" value="Strict" tone="primary" />
        </div>

        <div className="mt-6 rounded-xl border border-border bg-muted/50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Active Guardrails
          </div>
          <ul className="mt-3 space-y-2 text-sm">
            {["Source-cited responses", "PII redaction", "Hallucination filter", "Auto-escalation"].map(
              (g) => (
                <li key={g} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" /> {g}
                </li>
              )
            )}
          </ul>
        </div>

        <div className="mt-6 rounded-xl bg-slate-deep p-4 text-white">
          <div className="flex items-center gap-2 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-success" />
            <span className="uppercase tracking-widest">Live Confidence</span>
          </div>
          <div className="mt-2 font-display text-3xl font-bold">98.7%</div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[98.7%] rounded-full bg-gradient-to-r from-primary to-success" />
          </div>
        </div>
      </aside>

      {/* Right: Chat */}
      <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="font-display text-lg font-bold">Nexus Assistant</h2>
            <p className="text-xs text-muted-foreground">Responsible AI · grounded answers</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-4">
            {messages.map((m) => (
              <Message key={m.id} msg={m} />
            ))}

            {escalated && !leadSubmitted && (
              <LeadForm onSubmit={(d) => setLeadSubmitted(d)} />
            )}

            {leadSubmitted && <OfferCard name={leadSubmitted.name} offer={leadSubmitted.offer} />}
          </div>
        </div>

        {/* Suggestions */}
        {!escalated && (
          <div className="flex flex-wrap gap-2 border-t border-border px-6 py-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s.label}
                onClick={() => respond(s.label, s.escalate)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5"
              >
                {s.escalate && <AlertTriangle className="h-3 w-3 text-warning" />}
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 focus-within:border-primary">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={escalated}
              placeholder={escalated ? "Escalation active — complete the form above" : "Ask Nexus anything…"}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={escalated || !input.trim()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "success" | "primary";
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2.5">
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {label}
      </div>
      <span
        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          tone === "success" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Message({ msg }: { msg: Msg }) {
  if (msg.role === "system") {
    return (
      <div className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-foreground">
        {msg.content}
      </div>
    );
  }
  if (msg.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex max-w-[85%] gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex-1">
        {msg.typing ? (
          <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm bg-muted px-4 py-3">
            <Dot /> <Dot delay="150ms" /> <Dot delay="300ms" />
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm">
            {msg.content}
            {msg.source && (
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
                  <BadgeCheck className="h-3 w-3" /> AI Verified
                </span>
                <span className="text-[11px] text-muted-foreground">Source: {msg.source}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Dot({ delay = "0ms" }: { delay?: string }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground"
      style={{ animationDelay: delay }}
    />
  );
}

function LeadForm({ onSubmit }: { onSubmit: (d: { name: string; offer: string }) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [priority, setPriority] = useState<"Low" | "Medium" | "Critical">("Medium");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) return;
    onSubmit({
      name,
      offer:
        priority === "Critical"
          ? "2026 Enterprise Automation Blueprint + 1:1 strategy session"
          : "2026 Enterprise Automation Blueprint",
    });
  };

  return (
    <form
      onSubmit={submit}
      className="animate-in slide-in-from-bottom-4 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-card p-5 shadow-glow"
    >
      <div className="mb-4 flex items-center gap-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h3 className="font-display text-base font-bold">Priority Escalation</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">
        Securely route this to our human operations team. Encrypted in transit.
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Field label="Full Name" value={name} onChange={setName} />
        <Field label="Work Email" value={email} onChange={setEmail} type="email" />
        <Field label="Company" value={company} onChange={setCompany} className="md:col-span-2" />
        <div className="md:col-span-2">
          <label className="text-xs font-semibold text-muted-foreground">Business Priority</label>
          <div className="mt-1.5 grid grid-cols-3 gap-2">
            {(["Low", "Medium", "Critical"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  priority === p
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:border-primary/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
      >
        Submit & Notify Team <Send className="h-4 w-4" />
      </button>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}

function OfferCard({ name, offer }: { name: string; offer: string }) {
  return (
    <div className="animate-in fade-in zoom-in-95 rounded-2xl border border-success/30 bg-gradient-to-br from-success/10 to-card p-5">
      <div className="flex items-center gap-2">
        <Gift className="h-5 w-5 text-success" />
        <h3 className="font-display text-base font-bold">Personalized for you, {name.split(" ")[0]}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Based on your inquiry, here's a complimentary copy of our{" "}
        <span className="font-semibold text-foreground">{offer}</span>. Check your email — our team will follow up within 1 business hour.
      </p>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
        <CheckCircle2 className="h-3 w-3" /> Escalation queued · Ticket #NX-{Math.floor(Math.random() * 9000 + 1000)}
      </div>
    </div>
  );
}
