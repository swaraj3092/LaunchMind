import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, Brain, AlertTriangle, Rocket, ChevronDown, ChevronUp,
  Check, Download, Link, ArrowRight, ArrowLeft, X, Sparkles,
  RefreshCw, ExternalLink, TrendingUp, Calendar, Target, Users,
  MessageSquare, Trophy, DollarSign, BarChart2, Menu, Presentation
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import confetti from "canvas-confetti";
import { Toaster, toast } from "sonner";

// ── Sakura Noir palette ────────────────────────────────────────────────────────
const V   = "#FF2D78";   // neon rose (primary)
const V2  = "#C084FC";   // soft violet (secondary)
const T   = "#FF8FB1";   // blush (accent)
const A   = "#FCD34D";   // gold (warning)
const M   = "#F9A8D4";   // sakura (success)
const TP  = "#FFF0F5";   // text primary
const TS  = "#9B7EA0";   // text secondary
const BG  = "#0C080D";   // deep plum
const SURF = "#140A11";  // surface
const CARD = "#1A0D18";  // card
const BD  = "rgba(255,255,255,0.07)";
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

type Screen = "landing" | "input" | "questions" | "results" | "demo" | "how-it-works" | "about" | "pitch-room";
type Tab = "assumptions" | "roadmap" | "week1" | "market" | "venture" | "pitchdeck";

// ── Demo / Offline Baked Data ─────────────────────────────────────────────────
const DEMO_ANALYSIS = {
  clarity_score: 78,
  feasibility: "High",
  idea_summary: "A mobile-first platform that helps freelancers automatically track, escalate, and get micro-financed against unpaid invoices using AI-powered client risk scoring.",
  clarifying_questions: [
    "Who owes money most — agencies, direct clients, or gig platforms?",
    "Do freelancers currently have a tracking system, or are they winging it?",
    "What would make a freelancer pay $10/month for this tool?",
    "How would you handle international currency and payment disputes?",
    "What's your unfair advantage over existing tools like Wave or FreshBooks?",
  ],
};

const DEMO_PLAN = {
  assumptions: [
    { id: 1, statement: "Freelancers will pay for automated follow-up rather than manual tracking.", risk_level: "High", why_it_matters: "If freelancers prefer free tools like spreadsheets, your entire monetization model collapses on Day 1." },
    { id: 2, statement: "Clients will actually pay faster when chased by automated AI reminders.", risk_level: "High", why_it_matters: "If client behavior doesn't change with automation, the core value proposition is broken." },
    { id: 3, statement: "Micro-lending partners will accept AI-generated invoice risk scores as collateral.", risk_level: "Medium", why_it_matters: "Without lending partners, your financial product arm is dead before launch." },
  ],
  roadmap: {
    day_30: ["[Validate] Interview 20 freelancers about invoice pain points", "[Validate] Build a no-code landing page and collect 100 waitlist emails", "[Build] Spreadsheet-based MVP for 5 beta users", "[Validate] Confirm at least 3 clients pay faster with reminder emails"],
    day_60: ["[Build] Launch core invoice tracking web app with Stripe integration", "[Build] Build AI reminder escalation engine (email + WhatsApp)", "[Build] Integrate with Razorpay / PayPal for payment tracking", "[Validate] Reach 50 paying beta users at $9/month"],
    day_90: ["[Launch] Public launch on Product Hunt and IndieHackers", "[Build] Integrate first micro-lending partner API", "[Launch] LinkedIn / Twitter content marketing for freelancer communities", "[Scale] Target 500 users and $4,500 MRR"],
  },
  week1: [
    { day: 1, tasks: ["Post in 5 freelancer communities (Reddit, Slack, Discord) asking about invoice pain"], time_estimate: "3 hours" },
    { day: 2, tasks: ["Set up Notion waitlist tracker, start collecting emails via Typeform"], time_estimate: "2 hours" },
    { day: 3, tasks: ["Build a Google Sheets invoice tracker template and share it free"], time_estimate: "4 hours" },
    { day: 4, tasks: ["Interview 5 freelancers via Calendly — focus on their worst invoice story"], time_estimate: "3 hours" },
    { day: 5, tasks: ["Analyse interview insights, identify the #1 pain point to solve first"], time_estimate: "2 hours" },
    { day: 6, tasks: ["Sketch wireframes for core MVP screen (invoice list + status tracker)"], time_estimate: "3 hours" },
    { day: 7, tasks: ["Share your learnings publicly on LinkedIn — build in public from Day 1"], time_estimate: "1 hour" },
  ],
  day1_action: { action: "Post in 3 freelancer Slack communities today asking: 'What's your most painful invoice experience?'", note: "You don't need code. You need 1 brutal user insight. Go get it today." },
  competitors: [
    { name: "FreshBooks", description: "Full-featured accounting software with invoicing for SMBs. Costs $17-55/month.", differentiator: "LaunchMind targets solo freelancers with a frictionless mobile-first experience and AI-powered escalation — not complex accounting bloat." },
    { name: "Wave", description: "Free invoicing tool for freelancers but lacks automation, reminders, and financing.", differentiator: "LaunchMind's AI reminder engine and embedded micro-lending transforms passive invoicing into active cash flow management." },
    { name: "Contra", description: "Freelancer platform that handles contracts and payments but only for jobs sourced through Contra.", differentiator: "LaunchMind works for ALL existing client relationships — not locked to a single platform ecosystem." },
  ],
  market_size: { tam: 25000, sam: 3200, som: 120, tam_label: "$25B global SMB invoicing market", sam_label: "$3.2B freelancer fintech segment", som_label: "$120M reachable in 3 years", market_narrative: "The global freelancer economy is projected to reach 90M workers by 2028. Less than 12% use dedicated invoicing tools, representing a massive untapped greenfield market." },
  venture_score: 74,
  venture_score_breakdown: { market_opportunity: 21, execution_clarity: 19, innovation_factor: 18, team_fit: 16 },
};


// ── VC Personas ───────────────────────────────────────────────────────────────
const VC_PERSONAS = [
  {
    id: "marcus",
    name: "Marcus Vance",
    title: "Lead Partner",
    firm: "Vance Capital",
    archetype: "The Skeptical Lead VC",
    focus: "Unit economics, customer acquisition costs, competitive defensibility, and revenue model clarity",
    color: "#FF2D78",
    emoji: "💼",
    avatar: "MV",
    personality: "Brutally analytical, cuts through fluff, demands specific numbers",
  },
  {
    id: "elena",
    name: "Elena Rostova",
    title: "Growth Partner",
    firm: "Vertex Ventures",
    archetype: "The Growth Angel",
    focus: "Viral loops, go-to-market strategy, product-led growth, and international scalability",
    color: "#C084FC",
    emoji: "🚀",
    avatar: "ER",
    personality: "Optimistic but sharp, obsessed with distribution and network effects",
  },
  {
    id: "aris",
    name: "Dr. Aris Thorne",
    title: "Deep Tech Partner",
    firm: "Sigma Ventures",
    archetype: "The Technical Deep-Dive Partner",
    focus: "Technical feasibility, AI/ML stack defensibility, data moats, and scalability architecture",
    color: "#FCD34D",
    emoji: "🧠",
    avatar: "AT",
    personality: "Methodical and precise, finds technical risks others miss",
  },
];

// ── Cherry Blossom Canvas ─────────────────────────────────────────────────────

function CherryBlossomCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const PETAL_COLORS = [
      "#FF2D78", "#FF6B9D", "#FF8FB1", "#C084FC",
      "#FFDAE8", "#E879F9", "#FFC0CB", "#D946EF",
    ];

    interface Petal {
      x: number; y: number;
      vx: number; vy: number;
      rotation: number; rotSpeed: number;
      size: number; opacity: number;
      color: string; phase: number; phaseSpeed: number;
      life: number; maxLife: number;
    }

    const makePetal = (burst = false, cx = 0, cy = 0): Petal => {
      const angle = burst ? Math.random() * Math.PI * 2 : 0;
      const speed = burst ? 1.5 + Math.random() * 5 : 0;
      return {
        x: burst ? cx : Math.random() * W,
        y: burst ? cy : -20 - Math.random() * 200,
        vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 1.2,
        vy: burst ? Math.sin(angle) * speed - 3 : 0.6 + Math.random() * 1.4,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.07,
        size: burst ? 3 + Math.random() * 7 : 1.5 + Math.random() * 5,
        opacity: burst ? 0.95 : 0.1 + Math.random() * 0.3,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: 0.008 + Math.random() * 0.025,
        life: 0,
        maxLife: burst ? 120 + Math.random() * 80 : Infinity,
      };
    };

    const petals: Petal[] = Array.from({ length: 50 }, () => {
      const p = makePetal();
      p.y = Math.random() * H;
      p.opacity = 0.05 + Math.random() * 0.25;
      return p;
    });

    let animId = 0;
    let t = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.75, -s * 0.55, s * 0.55, s * 0.75, 0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.55, s * 0.75, -s * 0.75, -s * 0.55, 0, -s);
      ctx.fill();
      ctx.globalAlpha = p.opacity * 0.4;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.25, s * 0.18, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const tick = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(12,8,13,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      const windX = Math.sin(t * 0.0025) * 0.5 + Math.sin(t * 0.007) * 0.2;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.life++;
        p.vx += windX * 0.025;
        p.vy += 0.012;
        p.phase += p.phaseSpeed;
        p.vx += Math.sin(p.phase) * 0.04;
        p.vx *= 0.979;
        p.vy *= 0.988;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (p.y > H - 100) p.opacity -= 0.012;
        if (p.maxLife !== Infinity && p.life > p.maxLife * 0.7) {
          p.opacity -= 0.015;
        }
        if (p.y > H + 30 || p.opacity <= 0 || p.x < -120 || p.x > W + 120) {
          if (p.maxLife === Infinity) {
            Object.assign(p, makePetal());
          } else {
            petals.splice(i, 1);
            continue;
          }
        }
        drawPetal(p);
      }

      animId = requestAnimationFrame(tick);
    };

    tick();

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0, width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

// ── Typewriter Hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, speed = 14, enabled = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!enabled || !text) { setDisplayed(text); setDone(true); return; }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, enabled]);
  return { displayed, done };
}

// ── Animated Counter Hook ─────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      obs.disconnect();
      const start = Date.now();
      const tick = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { count, ref };
}

// ── localStorage Persistence ─────────────────────────────────────────────────
const LS_KEY = "launchmind_session_v2";
function loadSession() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "null"); }
  catch { return null; }
}
function saveSession(data: any) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch {}
}
function clearSession() {
  try { localStorage.removeItem(LS_KEY); } catch {}
}

// ── Onboarding Modal ──────────────────────────────────────────────────────────
function OnboardingModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "🧠", title: "Cure the Builder's Blindspot", desc: "Stop building products nobody wants. LaunchMind interrogates your idea before you write a single line of code.", color: V },
    { icon: "🦈", title: "Face Real VC Questions", desc: "Enter the Pitch Room and defend your idea against 3 AI venture capitalists with unique personalities and investment focus areas.", color: V2 },
    { icon: "🚀", title: "Get Your Battle Plan", desc: "Walk away with a 90-day roadmap, market sizing, assumption risk map, and a Venture Readiness Score — all in under 5 minutes.", color: "#06B6D4" },
  ];
  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: "rgba(12,8,13,0.85)", backdropFilter: "blur(8px)" }}>
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md rounded-3xl p-8 relative"
          style={{ background: CARD, border: `1px solid rgba(255,45,120,0.2)`, boxShadow: "0 0 80px rgba(255,45,120,0.15)" }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ color: TS, background: SURF }}><X size={14} /></button>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4" style={{ lineHeight: 1 }}>{steps[step].icon}</div>
            <h3 className="font-bold text-xl mb-3" style={{ color: TP, letterSpacing: "-0.025em" }}>{steps[step].title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: TS }}>{steps[step].desc}</p>
          </div>
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, i) => (
              <div key={i} className="rounded-full transition-all duration-300"
                style={{ width: i === step ? 24 : 8, height: 8, background: i === step ? steps[step].color : BD }} />
            ))}
          </div>
          {step < steps.length - 1 ? (
            <BtnViolet fullWidth onClick={() => setStep(s => s + 1)}>Next <ArrowRight size={14} /></BtnViolet>
          ) : (
            <BtnViolet fullWidth onClick={onClose}>Let's Build 🚀</BtnViolet>
          )}
          <button onClick={onClose} className="w-full text-center text-xs mt-3" style={{ color: TS }}>Skip intro</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


// ── Atoms ─────────────────────────────────────────────────────────────────────

function GlassCard({
  children, className = "", style, onClick, hoverable,
}: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
  onClick?: () => void; hoverable?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hoverable && setH(true)}
      onMouseLeave={() => hoverable && setH(false)}
      className={`rounded-2xl transition-all duration-300 ${className}`}
      style={{
        background: CARD, backdropFilter: "blur(18px)",
        border: `1px solid ${h ? "rgba(255,45,120,0.25)" : BD}`,
        transform: h ? "translateY(-4px) scale(1.005)" : undefined,
        boxShadow: h
          ? "0 12px 40px rgba(255,45,120,0.12), 0 0 0 1px rgba(255,45,120,0.1), inset 0 1px 0 rgba(255,255,255,0.04)"
          : "inset 0 1px 0 rgba(255,255,255,0.02)",
        cursor: onClick ? "pointer" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function BtnViolet({
  children, onClick, fullWidth, size = "md", disabled,
}: {
  children: React.ReactNode; onClick?: () => void; fullWidth?: boolean;
  size?: "sm" | "md" | "lg"; disabled?: boolean;
}) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const pad = size === "sm" ? "px-5 py-2.5 text-sm" : size === "lg" ? "px-8 py-[14px] text-base" : "px-6 py-3 text-sm";
  return (
    <button
      onClick={onClick} disabled={disabled}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => { setH(false); setP(false); }}
      onMouseDown={() => setP(true)}
      onMouseUp={() => setP(false)}
      className={`${fullWidth ? "w-full" : ""} rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${pad}`}
      style={{
        background: `linear-gradient(135deg, ${V} 0%, ${V2} 100%)`,
        color: TP,
        transform: p ? "scale(0.97)" : h ? "scale(1.03)" : undefined,
        boxShadow: h
          ? `0 0 40px rgba(255,45,120,0.5), 0 4px 20px rgba(192,132,252,0.25), inset 0 1px 0 rgba(255,255,255,0.2)`
          : "0 0 20px rgba(255,45,120,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        letterSpacing: "0.01em",
      }}
    >
      {children}
    </button>
  );
}

function BtnGhost({
  children, onClick, fullWidth,
}: {
  children: React.ReactNode; onClick?: () => void; fullWidth?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className={`${fullWidth ? "w-full" : ""} rounded-full font-semibold flex items-center justify-center gap-2 px-6 py-3 text-sm transition-all duration-250`}
      style={{
        background: h ? "rgba(255,45,120,0.08)" : "transparent",
        border: `1px solid ${h ? V : BD}`,
        color: h ? TP : TS,
        transform: h ? "scale(1.02)" : undefined,
        boxShadow: h ? "0 0 24px rgba(255,45,120,0.12), inset 0 1px 0 rgba(255,255,255,0.05)" : "none",
      }}
    >
      {children}
    </button>
  );
}

function Pill({ label, color = V }: { label: string; color?: string }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide"
      style={{ background: `${color}18`, color, border: `1px solid ${color}30`, boxShadow: `0 0 12px ${color}15`, letterSpacing: "0.03em" }}>
      {label}
    </span>
  );
}

function PillToggleGroup({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
          style={{
            background: value === opt ? `linear-gradient(135deg, ${V} 0%, ${V2} 100%)` : "transparent",
            border: `1px solid ${value === opt ? V : BD}`,
            color: value === opt ? TP : TS,
            boxShadow: value === opt ? "0 0 12px rgba(255,45,120,0.3)" : "none",
          }}>
          {opt}
        </button>
      ))}
    </div>
  );
}

function StepDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center">
          {i > 0 && (
            <div className="w-10 h-px transition-colors duration-500"
              style={{ background: n <= step ? V : BD }} />
          )}
          <div className="flex items-center justify-center rounded-full font-bold transition-all duration-300"
            style={{
              width: n === step ? 34 : 26, height: n === step ? 34 : 26, fontSize: 12,
              background: n <= step ? `linear-gradient(135deg, ${V}, ${V2})` : "transparent",
              border: `2px solid ${n <= step ? V : BD}`,
              color: n <= step ? TP : TS,
              boxShadow: n === step ? "0 0 16px rgba(255,45,120,0.4)" : "none",
            }}>
            {n < step ? <Check size={12} /> : n}
          </div>
        </div>
      ))}
    </div>
  );
}

function RingProgress({ value, size = 128, color = V }: { value: number; size?: number; color?: string }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(value), 180);
    return () => clearTimeout(t);
  }, [value]);
  const r = (size - 22) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ position: "absolute", transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={V2} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={11} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={11} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.2,0.64,1)", filter: `drop-shadow(0 0 6px ${color}99)` }} />
      </svg>
      <div className="relative text-center">
        <div className="font-bold leading-none" style={{ ...MONO, fontSize: 30, color: TP }}>
          {Math.round(animated)}
        </div>
        <div style={{ fontSize: 11, color: TS, marginTop: 3 }}>/ 100</div>
      </div>
    </div>
  );
}

function ScreenWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}
    >
      {children}
    </motion.div>
  );
}

// ── Navbar ─────────────────────────────────────────────────────────────────────

function Navbar({ onHome, onDemo, onHowItWorks, onAbout, onLaunch }: { onHome?: () => void; onDemo?: () => void; onHowItWorks?: () => void; onAbout?: () => void; onLaunch: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { label: "How it works", icon: Brain, onClick: onHowItWorks },
    { label: "Examples", icon: Rocket, onClick: onDemo },
    { label: "About", icon: Zap, onClick: onAbout },
  ];
  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex flex-col w-full max-w-5xl">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl"
          style={{
            background: "rgba(20,10,17,0.88)",
            border: `1px solid rgba(255,45,120,0.12)`,
            backdropFilter: "blur(24px) saturate(1.4)",
            boxShadow: "0 0 40px rgba(255,45,120,0.06), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}>
          <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
            <img src="/favicon.png" alt="LaunchMind Logo" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold" style={{ color: TP, letterSpacing: "-0.02em" }}>LaunchMind</span>
          </button>
          <div className="hidden md:flex items-center gap-2">
            {links.map(({ label, icon: Icon, onClick }) => (
              <button key={label} onClick={onClick}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-200"
                style={{ color: TS }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.color = TP; el.style.background = "rgba(255,255,255,0.05)"; el.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.color = TS; el.style.background = "transparent"; el.style.transform = "scale(1)"; }}>
                <Icon size={14} />{label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <BtnViolet onClick={onLaunch} size="sm">Start Building <ArrowRight size={13} /></BtnViolet>
            <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all"
              onClick={() => setMenuOpen(o => !o)}
              style={{ background: menuOpen ? `${V}20` : SURF, border: `1px solid ${menuOpen ? V : BD}`, color: menuOpen ? V : TS }}>
              <Menu size={16} />
            </button>
          </div>
        </div>
        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, y: -8, scaleY: 0.9 }} animate={{ opacity: 1, y: 0, scaleY: 1 }} exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-1 rounded-2xl overflow-hidden md:hidden"
              style={{ background: CARD, border: `1px solid rgba(255,45,120,0.15)`, transformOrigin: "top" }}>
              {links.map(({ label, icon: Icon, onClick }) => (
                <button key={label} onClick={() => { onClick?.(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all"
                  style={{ color: TS, borderBottom: `1px solid ${BD}` }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = TP; (e.currentTarget as HTMLButtonElement).style.background = `${V}10`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = TS; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                  <Icon size={14} color={V} />{label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

// ── Stats Counter ─────────────────────────────────────────────────────────────

function StatCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const { count, ref } = useCountUp(target);
  return (
    <div ref={ref} className="text-center">
      <div className="font-bold mb-1" style={{ fontSize: 36, color: TP, letterSpacing: "-0.04em", ...MONO }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm" style={{ color: TS }}>{label}</div>
    </div>
  );
}

// ── Landing ───────────────────────────────────────────────────────────────────

function LandingScreen({ onHome, onStart, onDemo, onHowItWorks, onAbout }: { onHome: () => void; onStart: () => void; onDemo: () => void; onHowItWorks: () => void; onAbout: () => void }) {
  return (
    <ScreenWrap>
      <Navbar onHome={onHome} onDemo={onDemo} onHowItWorks={onHowItWorks} onAbout={onAbout} onLaunch={onStart} />

      <section className="flex flex-col items-center text-center pt-40 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full text-xs font-medium"
            style={{
              background: `${V}14`, color: TS,
              borderTop: `1px solid ${BD}`, borderRight: `1px solid ${BD}`,
              borderBottom: `1px solid ${BD}`, borderLeft: `3px solid ${V}`,
            }}>
            <Sparkles size={11} color={V} />
            AI-Powered Startup Validation Engine · Powered by Gemini 2.5
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="font-bold mb-6"
            style={{ fontSize: "clamp(38px,5.5vw,66px)", color: TP, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
            Stop dreaming.{" "}
            <span style={{
              background: `linear-gradient(130deg, ${V} 0%, ${V2} 100%)`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 24px rgba(255,45,120,0.4))",
            }}>
              Start building.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="mb-10 max-w-lg mx-auto"
            style={{ fontSize: 18, color: TS, lineHeight: 1.65 }}>
            Turn your vague idea into a battle-tested execution plan — with AI that interrogates your thinking, interrogates real competitors, and simulates a live VC pitch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <BtnViolet onClick={onStart} size="lg">Launch Your Idea <ArrowRight size={17} /></BtnViolet>
            <BtnGhost onClick={onDemo}>See an Example</BtnGhost>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex items-center justify-center gap-2 text-xs"
            style={{ color: TS }}>
            {["Free · No account needed", "Gemini 2.5 Flash", "Live competitor search", "VC Pitch Simulator"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span style={{ opacity: 0.35 }}>·</span>}
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Grid — 6 cards */}
      <section className="max-w-5xl mx-auto px-4 pb-16 grid md:grid-cols-3 gap-5">
        {[
          { Icon: Brain, title: "Idea Interrogation", desc: "AI asks the tough questions you forgot to ask yourself — before you write a single line of code.", color: V, delay: 0.6, num: "01" },
          { Icon: AlertTriangle, title: "Assumption Kill-Check", desc: "Surface the 3 beliefs that could kill your idea. Mark them as validated as you go.", color: V2, delay: 0.7, num: "02" },
          { Icon: Rocket, title: "90-Day Execution Roadmap", desc: "30/60/90-day plan with a concrete Day 1 action — built around your exact context.", color: T, delay: 0.8, num: "03" },
          { Icon: Target, title: "Live Competitor Analysis", desc: "We scrape the live web to identify real competitors and show exactly how you beat them.", color: A, delay: 0.9, num: "04" },
          { Icon: BarChart2, title: "Market Intelligence", desc: "TAM/SAM/SOM market sizing with animated charts. Know your market before you build.", color: M, delay: 1.0, num: "05" },
          { Icon: MessageSquare, title: "VC Pitch Room", desc: "Face 3 AI venture capitalists in a live pitch simulation. Get a real Venture Readiness Score.", color: "#06B6D4", delay: 1.1, num: "06" },
        ].map(({ Icon, title, desc, color, delay, num }) => (
          <motion.div key={title}
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            <GlassCard hoverable className="p-6 h-full relative overflow-hidden">
              <div className="absolute top-3 right-4 text-xs font-bold" style={{ ...MONO, color: `${color}30`, fontSize: 40, lineHeight: 1 }}>{num}</div>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${color}15`, border: `1px solid ${color}25`, boxShadow: `0 0 20px ${color}15` }}>
                <Icon size={19} color={color} />
              </div>
              <h3 className="font-bold mb-2 text-base" style={{ color: TP }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: TS }}>{desc}</p>
            </GlassCard>
          </motion.div>
        ))}
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-4 pb-28">
        <GlassCard className="p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter target={2400} suffix="+" label="Ideas Validated" />
            <StatCounter target={94} suffix="%" label="Founders Saved Months" />
            <StatCounter target={3} suffix=" VCs" label="AI Pitch Personas" />
            <StatCounter target={60} suffix="s" label="Time to First Insight" />
          </div>
        </GlassCard>
      </section>
    </ScreenWrap>
  );
}

// ── Idea Input ────────────────────────────────────────────────────────────────

function IdeaInputScreen({ idea, setIdea, role, setRole, timeline, setTimeline, team, setTeam, isRoastMode, setIsRoastMode, isAnalyzing, onNext, onBack }: {
  idea: string; setIdea: (v: string) => void;
  role: string; setRole: (v: string) => void;
  timeline: string; setTimeline: (v: string) => void;
  team: string; setTeam: (v: string) => void;
  isRoastMode: boolean; setIsRoastMode: (v: boolean) => void;
  onNext: () => void;
  onBack?: () => void;
  isAnalyzing?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <ScreenWrap>
      <div className="min-h-screen flex items-center justify-center px-4 py-24">
        <motion.div className="w-full max-w-xl relative"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
          {onBack && (
            <button onClick={onBack} className="absolute -top-12 left-0 flex items-center gap-2 text-sm hover:opacity-80 transition-all duration-200" style={{ color: TS }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <StepDots step={1} />
          <h2 className="font-bold mb-2" style={{ fontSize: 32, color: TP, letterSpacing: "-0.025em" }}>
            {"What's your idea?"}
          </h2>
          <p className="mb-7 text-sm" style={{ color: TS }}>{"Don't overthink it. One rough sentence is enough."}</p>

          <div className="mb-6 rounded-2xl transition-all duration-200"
            style={{
              background: CARD, border: `1px solid ${focused ? V : BD}`,
              boxShadow: focused ? "0 0 0 3px rgba(255,45,120,0.14), 0 0 24px rgba(255,45,120,0.1)" : "none",
            }}>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value.slice(0, 500))}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. I want to build an app that helps students find study partners near them..."
              rows={4}
              className="w-full p-4 bg-transparent resize-none text-sm leading-relaxed outline-none"
              style={{ minHeight: 128, color: TP, caretColor: V }}
            />
            <div className="px-4 pb-3 text-right text-xs"
              style={{ color: idea.length > 420 ? A : TS }}>
              {idea.length} / 500
            </div>
          </div>

          <div className="space-y-5 mb-8">
            {[
              { label: "Your role", opts: ["Student", "Founder", "Creator", "Professional"], val: role, set: setRole },
              { label: "Timeline", opts: ["1 week", "1 month", "3 months", "6 months"], val: timeline, set: setTimeline },
              { label: "Team size", opts: ["Solo", "2–3 people", "4–5 people"], val: team, set: setTeam },
            ].map(({ label, opts, val, set }) => (
              <div key={label}>
                <p className="text-xs font-medium mb-2" style={{ color: TS }}>{label}</p>
                <PillToggleGroup options={opts} value={val} onChange={set} />
              </div>
            ))}
            
            <div className="pt-2">
              <button 
                onClick={() => setIsRoastMode(!isRoastMode)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full md:w-auto"
                style={{ 
                  background: isRoastMode ? "rgba(255, 60, 60, 0.15)" : SURF,
                  border: `1px solid ${isRoastMode ? "rgba(255, 60, 60, 0.4)" : BD}`
                }}
              >
                <div className="w-5 h-5 rounded flex items-center justify-center transition-colors" 
                  style={{ background: isRoastMode ? "#FF3C3C" : "transparent", border: `1px solid ${isRoastMode ? "#FF3C3C" : BD}` }}>
                  {isRoastMode && <Check size={12} color={BG} />}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold" style={{ color: isRoastMode ? "#FF3C3C" : TP }}>Roast Mode 🔥</p>
                  <p className="text-xs" style={{ color: TS }}>AI acts as a ruthless Silicon Valley VC</p>
                </div>
              </button>
            </div>
          </div>

          <BtnViolet onClick={onNext} fullWidth size="lg" disabled={idea.trim().length < 8 || isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : <>Analyze My Idea <ArrowRight size={16} /></>}
          </BtnViolet>
        </motion.div>
      </div>
    </ScreenWrap>
  );
}

// ── Questions ─────────────────────────────────────────────────────────────────

const LOADING_TEXTS = ["Mapping assumptions...", "Building your plan...", "Scoring your idea...", "Almost ready..."];

function QuestionsScreen({ idea, analysis, isPlanning, onDone, onBack }: { idea: string; analysis: any; isPlanning: boolean; onDone: (answers: string[]) => void; onBack?: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const [input, setInput] = useState("");
  const [loadIdx, setLoadIdx] = useState(0);

  useEffect(() => {
    if (!isPlanning) return;
    const tick = setInterval(() => setLoadIdx(i => (i + 1) % LOADING_TEXTS.length), 1100);
    return () => clearInterval(tick);
  }, [isPlanning]);

  if (!analysis) {
    return (
      <ScreenWrap>
        <div className="min-h-screen flex flex-col md:flex-row gap-6 px-4 md:px-8 py-16 max-w-5xl mx-auto animate-[lmPulse_1.5s_ease-in-out_infinite]">
          <div className="hidden md:flex flex-col gap-4 w-64 shrink-0 pt-4">
            <div className="h-32 rounded-2xl" style={{ background: CARD }} />
            <div className="h-24 rounded-2xl" style={{ background: CARD }} />
          </div>
          <div className="flex-1 pt-4 relative">
            <div className="h-1 rounded-full mb-6 w-full" style={{ background: BD }} />
            <div className="h-40 rounded-2xl w-full" style={{ background: CARD }} />
            <div className="h-40 rounded-2xl w-full mt-4 opacity-50" style={{ background: CARD }} />
          </div>
        </div>
      </ScreenWrap>
    );
  }

  if (isPlanning) {
    return (
      <ScreenWrap>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <svg width="80" height="80" style={{ animation: "lmSpin 1.4s linear infinite" }}>
                <circle cx="40" cy="40" r="32" fill="none" stroke={BD} strokeWidth="5" />
                <circle cx="40" cy="40" r="32" fill="none" stroke={V} strokeWidth="5"
                  strokeLinecap="round" strokeDasharray="100 101"
                  style={{ filter: "drop-shadow(0 0 8px rgba(255,45,120,0.8))" }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={18} color={V} />
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={loadIdx}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-lg mb-4" style={{ color: TP }}>
                {LOADING_TEXTS[loadIdx]}
              </motion.p>
            </AnimatePresence>
            <div className="flex justify-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: V, animation: `lmPulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        </div>
      </ScreenWrap>
    );
  }

  const handleAnswer = (ans: string) => {
    const next = [...answers];
    next[current] = ans;
    setAnswers(next);
    if (current < 4) { setCurrent(c => c + 1); setInput(""); }
    else onDone(next);
  };

  const displayIdea = analysis.idea_summary || idea;

  return (
    <ScreenWrap>
      <div className="min-h-screen flex flex-col md:flex-row gap-6 px-4 md:px-8 py-16 max-w-5xl mx-auto">
        <div className="hidden md:flex flex-col gap-4 w-64 shrink-0 pt-4">
          <GlassCard className="p-4" style={{ borderLeft: `3px solid ${T}` }}>
            <p className="text-xs font-semibold mb-2" style={{ color: T }}>Your idea</p>
            <p className="text-sm leading-relaxed" style={{
              color: TP, display: "-webkit-box",
              WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {displayIdea}
            </p>
          </GlassCard>
          <GlassCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: `${M}20`, border: `1px solid ${M}40` }}>
                <Check size={11} color={M} />
              </div>
              <span className="text-sm font-medium" style={{ color: M }}>Idea received</span>
            </div>
            <p className="text-xs" style={{ color: TS }}>Generating personalized questions based on your context...</p>
          </GlassCard>
        </div>

        <div className="flex-1 pt-4 relative">
          {onBack && (
            <button onClick={onBack} className="absolute -top-10 left-0 flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: TS }}>
              <ArrowLeft size={16} /> Back
            </button>
          )}
          <StepDots step={2} />
          <div className="mb-6 h-1 rounded-full overflow-hidden" style={{ background: BD }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(current / 5) * 100}%`, background: `linear-gradient(90deg, ${V}, ${V2})`, boxShadow: `0 0 8px rgba(255,45,120,0.5)` }} />
          </div>

          <div className="space-y-4">
            {analysis.clarifying_questions.slice(0, current + 1).map((q: string, idx: number) => (
              <motion.div key={idx}
                initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, delay: idx === current ? 0.1 : 0, ease: [0.16, 1, 0.3, 1] }}>
                <GlassCard className="p-5"
                  style={{ borderLeft: `3px solid ${idx < current ? M : V}` }}>
                  <p className="font-semibold mb-4 text-sm leading-relaxed" style={{ color: TP }}>{q}</p>
                  {idx === current ? (
                    <div>
                      <textarea
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your answer..."
                        rows={2}
                        className="w-full p-3 rounded-xl text-sm leading-relaxed outline-none resize-none mb-3"
                        style={{ background: SURF, border: `1px solid ${BD}`, color: TP, caretColor: V }}
                      />
                      <BtnViolet onClick={() => handleAnswer(input)} disabled={input.trim().length < 3}>
                        Next <ArrowRight size={14} />
                      </BtnViolet>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Check size={13} color={M} />
                      <span className="text-sm" style={{ color: TS }}>{answers[idx]}</span>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </ScreenWrap>
  );
}

// ── Export Drawer ─────────────────────────────────────────────────────────────

function ExportDrawer({ open, onClose, onRestart, plan, idea, analysis }: { 
  open: boolean; onClose: () => void; onRestart: () => void;
  plan?: any; idea?: string; analysis?: any;
}) {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    const printContent = `
      <html><head><title>LaunchMind Plan — ${idea}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        h1 { color: #FF2D78; font-size: 28px; margin-bottom: 8px; }
        h2 { color: #333; font-size: 18px; margin-top: 32px; border-bottom: 2px solid #FF2D78; padding-bottom: 4px; }
        .score { background: #fff0f5; border: 2px solid #FF2D78; display: inline-block; padding: 8px 20px; border-radius: 50px; font-size: 22px; font-weight: bold; color: #FF2D78; }
        .badge { background: #f3e8ff; color: #7c3aed; padding: 4px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; }
        ul { padding-left: 20px; } li { margin-bottom: 8px; }
        .assumption { background: #fffbeb; border-left: 4px solid #FCD34D; padding: 12px; margin-bottom: 12px; border-radius: 4px; }
        .milestone { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 12px; margin-bottom: 8px; border-radius: 4px; }
        .day1 { background: #fff0f5; border: 2px solid #FF2D78; padding: 16px; border-radius: 8px; margin-top: 16px; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <h1>🚀 LaunchMind Execution Plan</h1>
      <p style="color:#666;margin-bottom:16px;"><strong>Idea:</strong> ${idea || "Your idea"}</p>
      <div><span class="score">${analysis?.clarity_score ?? '--'} / 100</span> <span style="margin-left:12px;font-size:14px;color:#666;">Clarity Score</span></div>
      ${plan?.venture_score ? `<div style="margin-top:8px;"><span class="score" style="color:#C084FC;border-color:#C084FC;">${plan.venture_score} / 100</span> <span style="margin-left:12px;font-size:14px;color:#666;">Venture Readiness Score</span></div>` : ''}
      <h2>Critical Assumptions to Validate</h2>
      ${(plan?.assumptions || []).map((a: any) => `<div class="assumption"><strong>[${a.risk_level || a.risk}]</strong> ${a.statement}<br/><small style="color:#666;">${a.why_it_matters || a.why}</small></div>`).join('')}
      <h2>90-Day Execution Roadmap</h2>
      ${plan?.roadmap ? `
        <h3>Days 1-30 (Validate)</h3><ul>${(plan.roadmap.day_30||[]).map((m:string)=>`<li>${m}</li>`).join('')}</ul>
        <h3>Days 31-60 (Build)</h3><ul>${(plan.roadmap.day_60||[]).map((m:string)=>`<li>${m}</li>`).join('')}</ul>
        <h3>Days 61-90 (Scale)</h3><ul>${(plan.roadmap.day_90||[]).map((m:string)=>`<li>${m}</li>`).join('')}</ul>
      ` : ''}
      ${plan?.day1_action ? `<div class="day1"><strong>⚡ Your Day 1 Action:</strong><br/>${plan.day1_action.action}<br/><em style="color:#666;">${plan.day1_action.note}</em></div>` : ''}
      <h2>Top Competitors</h2>
      ${(plan?.competitors || []).map((c: any) => `<div class="milestone"><strong>${c.name}:</strong> ${c.description}<br/><em>Your edge: ${c.differentiator}</em></div>`).join('')}
      <hr/><p style="color:#999;font-size:12px;margin-top:20px;">Generated by LaunchMind · Powered by Gemini 2.5 Flash · launchmind.app</p>
      </body></html>
    `;
    const w = window.open('', '_blank');
    if (w) { w.document.write(printContent); w.document.close(); w.print(); }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40" style={{ background: "rgba(12,8,13,0.6)" }}
            onClick={onClose} />
          <motion.aside
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{
              width: 380, background: SURF,
              borderLeft: `1px solid rgba(255,45,120,0.15)`,
              boxShadow: "-8px 0 40px rgba(255,45,120,0.07)",
            }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: BD }}>
              <h3 className="font-bold text-lg" style={{ color: TP }}>Export Your Plan</h3>
              <button onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{ color: TS, border: `1px solid transparent` }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = BD}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent"}>
                <X size={16} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {[
                { Icon: Download, label: "Download PDF", sub: "Print a formatted PDF of your complete plan", action: "Download PDF", available: true, fn: handlePrint },
                { Icon: ExternalLink, label: "Copy to Notion", sub: "Push directly to your Notion workspace", action: "Coming soon", available: false, fn: undefined },
                { Icon: Link, label: "Share Link", sub: "Generate a unique, shareable URL", action: copied ? "Copied!" : "Copy Link", available: true, fn: () => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 2000); } },
              ].map(({ Icon, label, sub, action, available, fn }) => (
                <GlassCard key={label} className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${V}18`, border: `1px solid ${V}35` }}>
                      <Icon size={18} color={V} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm mb-1" style={{ color: TP }}>{label}</p>
                      <p className="text-xs mb-3" style={{ color: TS }}>{sub}</p>
                      {available ? (
                        <BtnViolet size="sm" onClick={fn}>{action}</BtnViolet>
                      ) : (
                        <Pill label={action} color={TS} />
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
            <div className="p-6 border-t" style={{ borderColor: BD }}>
              <button onClick={onRestart}
                className="w-full text-center text-sm transition-colors flex items-center justify-center gap-2"
                style={{ color: TS }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = TP}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = TS}>
                <RefreshCw size={13} />
                Start Over with New Idea
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Market Intelligence Charts ─────────────────────────────────────────────────

function MarketIntelligenceTab({ plan }: { plan: any }) {
  const ms = plan?.market_size;
  const competitors = plan?.competitors || [];

  const pieData = ms ? [
    { name: "SOM", value: ms.som, color: V },
    { name: "SAM", value: ms.sam - ms.som, color: V2 },
    { name: "TAM", value: ms.tam - ms.sam, color: `${V}40` },
  ] : [];

  const barData = competitors.map((c: any, i: number) => ({
    name: c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name,
    score: 60 + i * 8,
    yours: 78,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12, padding: "8px 14px" }}>
        <p style={{ color: TP, fontWeight: 600, fontSize: 13 }}>{payload[0].name}</p>
        <p style={{ color: V, fontSize: 13 }}>${payload[0].value.toLocaleString()}M</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}>
      <div className="mb-6">
        <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Market Intelligence</h2>
        <p className="text-sm" style={{ color: TS }}>AI-generated market sizing and competitive landscape analysis.</p>
      </div>

      {/* Market Size */}
      {ms && (
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          <GlassCard className="p-6">
            <p className="text-xs font-bold mb-4" style={{ color: TS, letterSpacing: "0.08em", textTransform: "uppercase" }}>TAM / SAM / SOM</p>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: "TAM", value: ms.tam_label, color: `${V}40` },
                { label: "SAM", value: ms.sam_label, color: V2 },
                { label: "SOM", value: ms.som_label, color: V },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-2 rounded-xl" style={{ background: `${color}20`, border: `1px solid ${color}40` }}>
                  <div className="text-xs font-bold mb-0.5" style={{ color }}>{label}</div>
                  <div className="text-xs leading-tight" style={{ color: TS }}>{value}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="text-xs font-bold mb-1" style={{ color: TS, letterSpacing: "0.08em", textTransform: "uppercase" }}>Market Opportunity</p>
            <p className="text-sm leading-relaxed mb-4" style={{ color: TP }}>{ms.market_narrative}</p>
            {plan?.venture_score_breakdown && (
              <div className="space-y-3">
                <p className="text-xs font-bold" style={{ color: TS, letterSpacing: "0.06em", textTransform: "uppercase" }}>Venture Score Breakdown</p>
                {[
                  { label: "Market Opportunity", value: plan.venture_score_breakdown.market_opportunity, max: 25, color: V },
                  { label: "Execution Clarity", value: plan.venture_score_breakdown.execution_clarity, max: 25, color: V2 },
                  { label: "Innovation Factor", value: plan.venture_score_breakdown.innovation_factor, max: 25, color: T },
                  { label: "Team Fit", value: plan.venture_score_breakdown.team_fit, max: 25, color: A },
                ].map(({ label, value, max, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs" style={{ color: TS }}>{label}</span>
                      <span className="text-xs font-bold" style={{ color }}>{value}/{max}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: BD }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
                        transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)`, boxShadow: `0 0 8px ${color}50` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      )}

      {/* Competitors */}
      <div className="mb-5">
        <p className="text-xs font-bold mb-4" style={{ color: TS, letterSpacing: "0.08em", textTransform: "uppercase" }}>Competitor Landscape</p>
        {barData.length > 0 && (
          <GlassCard className="p-5 mb-5">
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={BD} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: TS, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: TS, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                  <Bar dataKey="score" fill={`${V2}60`} radius={[4, 4, 0, 0]} name="Competitor Score" />
                  <Bar dataKey="yours" fill={V} radius={[4, 4, 0, 0]} name="Your Score" />
                  <Tooltip
                    contentStyle={{ background: CARD, border: `1px solid ${BD}`, borderRadius: 12 }}
                    labelStyle={{ color: TP }}
                    itemStyle={{ color: V }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs mt-2 text-center" style={{ color: TS }}>AI-estimated product-market fit scores (higher is better). <span style={{ color: V }}>Pink = Your projected score</span></p>
          </GlassCard>
        )}
      </div>

      <div className="space-y-4">
        {competitors.map((comp: any, idx: number) => (
          <GlassCard key={idx} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${T}20`, border: `1px solid ${T}40` }}>
                <Target size={18} color={T} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1" style={{ color: TP }}>{comp.name}</h3>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: TS }}>{comp.description}</p>
                <div className="p-3 rounded-xl text-sm" style={{ background: `${V}15`, border: `1px solid ${V}30`, color: TP }}>
                  <span className="font-bold" style={{ color: V }}>Your Differentiator: </span>
                  {comp.differentiator}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

// ── Results Dashboard ─────────────────────────────────────────────────────────

function ResultsDashboard({ idea, analysis, plan, isPlanning, onAdjust, onRestart, onPitchRoom }: { 
  idea: string; analysis: any; plan: any; isPlanning?: boolean; 
  onAdjust?: (item: string) => void; onRestart: () => void;
  onPitchRoom: () => void;
}) {
  const [tab, setTab] = useState<Tab>("assumptions");
  const [validated, setValidated] = useState(new Set<number>());
  const [expanded, setExpanded] = useState(new Set<number>());
  const [checked, setChecked] = useState(new Set<string>());
  const [showExport, setShowExport] = useState(false);
  const confettiFired = useRef(false);

  const displayIdea = analysis?.idea_summary || idea;

  // Fire confetti when plan loads
  useEffect(() => {
    if (plan && !isPlanning && !confettiFired.current) {
      confettiFired.current = true;
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 }, colors: ["#FF2D78", "#C084FC", "#FF8FB1", "#FCD34D", "#F9A8D4"] });
      }, 400);
      toast.success("🚀 Your execution plan is ready!", { description: "Scroll through your roadmap, assumptions, and market map." });
    }
  }, [plan, isPlanning]);

  const toggle = (s: Set<number>, n: number) => {
    const ns = new Set(s); ns.has(n) ? ns.delete(n) : ns.add(n); return ns;
  };
  const toggleStr = (s: Set<string>, k: string) => {
    const ns = new Set(s); ns.has(k) ? ns.delete(k) : ns.add(k); return ns;
  };

  const SIDEBAR_NAV = [
    { id: "assumptions" as Tab, label: "Assumptions", Icon: AlertTriangle },
    { id: "roadmap" as Tab, label: "Roadmap", Icon: TrendingUp },
    { id: "week1" as Tab, label: "Week 1 Plan", Icon: Calendar },
    { id: "market" as Tab, label: "Market Intel", Icon: BarChart2 },
    { id: "venture" as Tab, label: "Venture Score", Icon: Trophy },
    { id: "pitchdeck" as Tab, label: "Pitch Deck", Icon: Presentation },
  ];


  if (!plan) {
    return (
      <ScreenWrap>
        <div className="flex min-h-screen animate-[lmPulse_1.5s_ease-in-out_infinite]">
          <aside className="hidden md:flex flex-col shrink-0 border-r sticky top-0 h-screen"
            style={{ width: 280, background: SURF, borderColor: "rgba(255,45,120,0.1)" }}>
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="h-8 rounded-lg w-1/2" style={{ background: CARD }} />
              <div className="h-24 rounded-xl mt-4" style={{ background: CARD }} />
              <div className="flex flex-col items-center py-2">
                <div className="w-24 h-24 rounded-full" style={{ background: CARD }} />
                <div className="h-4 w-20 rounded mt-3" style={{ background: CARD }} />
              </div>
              <div className="space-y-2 mt-4">
                {[1,2,3,4,5].map(i => <div key={i} className="h-10 rounded-xl" style={{ background: CARD }} />)}
              </div>
            </div>
          </aside>
          <main className="flex-1 p-6 md:p-8">
            <div className="h-1 rounded-full w-24 mb-6" style={{ background: CARD }} />
            <div className="h-8 rounded-lg w-1/3 mb-2" style={{ background: CARD }} />
            <div className="h-4 rounded w-1/4 mb-6" style={{ background: CARD }} />
            <div className="space-y-4">
              <div className="h-32 rounded-2xl" style={{ background: CARD }} />
              <div className="h-32 rounded-2xl opacity-75" style={{ background: CARD }} />
              <div className="h-32 rounded-2xl opacity-50" style={{ background: CARD }} />
            </div>
          </main>
        </div>
      </ScreenWrap>
    );
  }

  const roadmapData = [
    { phase: "30 Days", label: "Validate", color: V, milestones: plan.roadmap.day_30 },
    { phase: "60 Days", label: "Build", color: V2, milestones: plan.roadmap.day_60 },
    { phase: "90 Days", label: "Scale", color: M, milestones: plan.roadmap.day_90 },
  ];

  return (
    <ScreenWrap>
      <ExportDrawer open={showExport} onClose={() => setShowExport(false)} onRestart={onRestart} plan={plan} idea={idea} analysis={analysis} />
      <div className="flex min-h-screen">
        <aside className="hidden md:flex flex-col shrink-0 border-r sticky top-0 h-screen overflow-y-auto"
          style={{ width: 280, background: SURF, borderColor: "rgba(255,45,120,0.1)" }}>
          <div className="p-5 flex-1 flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-4 border-b" style={{ borderColor: BD }}>
              <img src="/favicon.png" alt="LaunchMind Logo" className="w-7 h-7 rounded-lg object-cover" />
              <span className="font-bold text-sm" style={{ color: TP, letterSpacing: "-0.02em" }}>LaunchMind</span>
            </div>

            <div className="p-3 rounded-xl" style={{ background: CARD, borderLeft: `3px solid ${T}` }}>
              <p className="text-xs font-semibold mb-1" style={{ color: T }}>Your Idea</p>
              <p className="text-xs leading-relaxed" style={{
                color: TS, display: "-webkit-box",
                WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
              }}>
                {displayIdea}
              </p>
            </div>

            {/* Dual Score Display */}
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="flex gap-4">
                <div className="text-center">
                  <RingProgress value={analysis.clarity_score} size={80} color={V} />
                  <p className="text-xs mt-1" style={{ color: TS }}>Clarity</p>
                </div>
                {plan.venture_score && (
                  <div className="text-center">
                    <RingProgress value={plan.venture_score} size={80} color="#06B6D4" />
                    <p className="text-xs mt-1" style={{ color: TS }}>Venture</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                <Pill label={analysis.feasibility} color={V2} />
                {plan.market_size && <Pill label={plan.market_size.tam_label} color={A} />}
              </div>
            </div>

            <nav className="space-y-1 pt-1">
              {SIDEBAR_NAV.map(({ id, label, Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                  style={{
                    background: tab === id ? `${V}18` : "transparent",
                    color: tab === id ? TP : TS,
                    borderLeft: `3px solid ${tab === id ? V : "transparent"}`,
                    boxShadow: tab === id ? "0 0 12px rgba(255,45,120,0.1)" : "none",
                  }}>
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </nav>

            {/* VC Pitch Room CTA */}
            <div className="mt-2 rounded-xl p-4"
              style={{ background: "linear-gradient(135deg, rgba(255,45,120,0.15) 0%, rgba(6,182,212,0.1) 100%)", border: `1px solid rgba(255,45,120,0.25)` }}>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={14} color={V} />
                <span className="text-xs font-bold" style={{ color: TP }}>VC Pitch Room</span>
              </div>
              <p className="text-xs mb-3" style={{ color: TS }}>Face 3 AI investors. Get your Venture Readiness Score live.</p>
              <BtnViolet onClick={onPitchRoom} size="sm" fullWidth>
                Enter Pitch Room <ArrowRight size={12} />
              </BtnViolet>
            </div>
          </div>

          <div className="p-5 border-t" style={{ borderColor: BD }}>
            <BtnGhost onClick={() => setShowExport(true)} fullWidth>
              <Download size={14} /> Export Plan
            </BtnGhost>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-8 overflow-y-auto relative">
          <AnimatePresence>
            {isPlanning && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-xl"
                style={{ background: "rgba(12,8,13,0.8)", backdropFilter: "blur(4px)" }}>
                <div className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin mb-4" style={{ borderColor: `${V} transparent ${V} ${V}` }} />
                <p className="font-bold text-lg" style={{ color: TP }}>Recalculating Plan...</p>
                <p className="text-sm" style={{ color: TS }}>Adapting roadmap based on your new validation.</p>
              </motion.div>
            )}
          </AnimatePresence>
          <StepDots step={3} />
          <AnimatePresence mode="wait">
            {tab === "assumptions" && (
              <motion.div key="assumptions"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Kill-Check: Assumptions to Validate First</h2>
                  <p className="text-sm" style={{ color: TS }}>Your plan only works if these are true. Validate before building.</p>
                </div>
                <div className="space-y-4">
                  {plan.assumptions.map((assump: any, idx: number) => {
                    const n = idx + 1;
                    const statement = assump.statement;
                    const risk = assump.risk || assump.risk_level;
                    const why = assump.why || assump.why_it_matters;
                    const isValid = validated.has(n);
                    const isOpen = expanded.has(n);
                    return (
                      <GlassCard key={n} hoverable className="overflow-hidden"
                        style={{ borderLeft: `3px solid ${isValid ? M : A}` }}>
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold px-2 py-1 rounded-full"
                              style={{ ...MONO, background: `${V}20`, color: V }}>#{n}</span>
                            <Pill label={risk} color={isValid ? M : A} />
                          </div>
                          <p className="font-semibold text-sm mb-3 leading-relaxed" style={{ color: TP }}>{statement}</p>
                          <button onClick={() => setExpanded(toggle(expanded, n))}
                            className="flex items-center gap-1.5 text-xs mb-3 transition-colors"
                            style={{ color: TS }}>
                            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            Why this matters
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}
                                className="overflow-hidden">
                                <div className="p-4 rounded-xl mb-3 text-xs leading-relaxed"
                                  style={{ background: SURF, color: TS, border: `1px solid ${BD}` }}>
                                  {why}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <button onClick={() => {
                              setValidated(toggle(validated, n));
                              if (!isValid && onAdjust) onAdjust(`Validated Assumption: ${statement}`);
                            }}
                            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
                            style={{
                              background: isValid ? `${M}20` : "transparent",
                              border: `1px solid ${isValid ? M : BD}`,
                              color: isValid ? M : TS,
                              boxShadow: isValid ? "0 0 12px rgba(249,168,212,0.2)" : "none",
                            }}>
                            <Check size={13} />
                            {isValid ? "Validated ✓" : "Mark as Validated"}
                          </button>
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {tab === "roadmap" && (
              <motion.div key="roadmap"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Your 90-Day Execution Roadmap</h2>
                  <p className="text-sm" style={{ color: TS }}>Three phases to go from zero to real traction.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-5">
                  {roadmapData.map(({ phase, label, color, milestones }) => (
                    <GlassCard key={phase} className="p-5">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                          <TrendingUp size={15} color={color} />
                        </div>
                        <div>
                          <p className="font-bold text-sm" style={{ color: TP }}>{phase}</p>
                          <p className="text-xs" style={{ color }}>Phase: {label}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {milestones.map((m: any, i: number) => {
                          const k = `${phase}-${i}`;
                          const done = checked.has(k);
                          let text = m;
                          let tag = "";
                          if (typeof m === "string") {
                            const match = m.match(/^\[(.*?)\]\s*(.*)$/);
                            if (match) { tag = match[1]; text = match[2]; }
                          } else if (typeof m === "object") {
                            text = m.text; tag = m.tag;
                          }
                          return (
                            <button key={i} onClick={() => {
                                setChecked(toggleStr(checked, k));
                                if (!done && onAdjust) onAdjust(`Completed Milestone: ${text}`);
                              }}
                              className="w-full flex items-start gap-3 text-left transition-opacity"
                              style={{ opacity: done ? 0.45 : 1 }}>
                              <div className="mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200"
                                style={{
                                  border: `1.5px solid ${done ? color : BD}`,
                                  background: done ? color : "transparent",
                                }}>
                                {done && <Check size={9} color={BG} />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs leading-relaxed mb-1"
                                  style={{ color: TP, textDecoration: done ? "line-through" : "none" }}>{text}</p>
                                {tag && (
                                  <span className="text-xs px-2 py-0.5 rounded-full"
                                    style={{ background: `${color}15`, color, fontSize: 10 }}>{tag}</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "week1" && (
              <motion.div key="week1"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Week 1 Action Plan</h2>
                  <p className="text-sm" style={{ color: TS }}>Your exact daily playbook for the next 7 days.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-6">
                  {plan.week1.map(({ day, tasks, hrs, time_estimate }: any) => (
                    <GlassCard key={day} hoverable className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold" style={{ ...MONO, color: T }}>Day {day}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${T}18`, color: T, fontSize: 10 }}>{hrs || time_estimate}</span>
                      </div>
                      {tasks.map((task: string, i: number) => (
                        <p key={i} className="text-xs leading-relaxed mb-1.5" style={{ color: TS }}>{task}</p>
                      ))}
                    </GlassCard>
                  ))}
                </div>
                <div className="rounded-2xl p-6"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,45,120,0.2) 0%, rgba(192,132,252,0.1) 100%)`,
                    border: `1px solid rgba(255,45,120,0.3)`,
                    boxShadow: "0 0 40px rgba(255,45,120,0.08)",
                    animation: "lmGlow 3s ease-in-out infinite",
                  }}>
                  <div className="text-2xl mb-3">⚡</div>
                  <p className="text-xs font-bold mb-2"
                    style={{ color: V, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Your First Move — Do this today
                  </p>
                  <p className="font-bold mb-2" style={{ fontSize: 18, color: TP, lineHeight: 1.3 }}>
                    {plan.day1_action.action}
                  </p>
                  <p className="text-sm" style={{ color: TS }}>
                    {plan.day1_action.note}
                  </p>
                </div>
              </motion.div>
            )}

            {tab === "market" && <MarketIntelligenceTab plan={plan} />}

            {tab === "venture" && (
              <motion.div key="venture"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Venture Readiness Score</h2>
                  <p className="text-sm" style={{ color: TS }}>AI-assessed readiness to pitch to real investors — across 4 critical dimensions.</p>
                </div>
                <div className="flex flex-col items-center py-8 mb-8">
                  <RingProgress value={plan.venture_score || 0} size={180} color="#06B6D4" />
                  <p className="text-lg font-bold mt-4" style={{ color: TP }}>
                    {(plan.venture_score || 0) >= 75 ? "🚀 Investor-Ready" :
                     (plan.venture_score || 0) >= 50 ? "📈 Promising — Keep Validating" :
                     "🌱 Early Stage — More Work Needed"}
                  </p>
                  <p className="text-sm mt-2" style={{ color: TS }}>Venture Readiness Score</p>
                </div>
                {plan?.venture_score_breakdown && (
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    {[
                      { label: "Market Opportunity", value: plan.venture_score_breakdown.market_opportunity, max: 25, color: V, Icon: DollarSign, desc: "How large and growing is the addressable market?" },
                      { label: "Execution Clarity", value: plan.venture_score_breakdown.execution_clarity, max: 25, color: V2, Icon: Target, desc: "How clear and concrete is the execution plan?" },
                      { label: "Innovation Factor", value: plan.venture_score_breakdown.innovation_factor, max: 25, color: T, Icon: Sparkles, desc: "How unique and defensible is the solution?" },
                      { label: "Team Fit", value: plan.venture_score_breakdown.team_fit, max: 25, color: A, Icon: Users, desc: "How well does the team's profile match this challenge?" },
                    ].map(({ label, value, max, color, Icon, desc }) => (
                      <GlassCard key={label} className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: `${color}20`, border: `1px solid ${color}35` }}>
                            <Icon size={16} color={color} />
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: TP }}>{label}</p>
                            <p className="text-xs" style={{ color }}>{value} / {max} pts</p>
                          </div>
                        </div>
                        <p className="text-xs mb-3" style={{ color: TS }}>{desc}</p>
                        <div className="h-2 rounded-full overflow-hidden" style={{ background: BD }}>
                          <motion.div
                            initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${color}, ${color}88)`, boxShadow: `0 0 10px ${color}50` }}
                          />
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}
                <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.15) 0%, rgba(192,132,252,0.1) 100%)", border: `1px solid rgba(6,182,212,0.3)` }}>
                  <p className="text-xs font-bold mb-2" style={{ color: "#06B6D4", letterSpacing: "0.06em", textTransform: "uppercase" }}>Ready to Test Your Pitch Live?</p>
                  <p className="text-sm mb-4" style={{ color: TS }}>Enter the VC Pitch Room and defend your idea against 3 AI investors with unique perspectives and investment thesis. Your score updates in real time.</p>
                  <BtnViolet onClick={onPitchRoom} size="md">
                    <MessageSquare size={14} /> Enter VC Pitch Room
                  </BtnViolet>
                </div>
              </motion.div>
            )}

            {tab === "pitchdeck" && (
              <motion.div key="pitchdeck"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>AI-Generated Pitch Deck</h2>
                  <p className="text-sm" style={{ color: TS }}>10 investor-ready slides generated from your plan. Copy each slide into Google Slides or PowerPoint.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { num: "01", title: "Cover Slide", icon: "🚀", color: V, content: [`Company: Your Startup Name`, `Tagline: ${analysis?.idea_summary?.split('.')[0] || idea || "A Startup Idea"}`, `Presenter: Swaraj Kumar Behera & Prajakta Kuila (Team: Dynamic Duo)`, `Date: ${new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`] },
                    { num: "02", title: "The Problem", icon: "😤", color: "#FF6B6B", content: [`Builders spend months on products nobody wants`, `Over 90% of startups fail due to poor market validation`, `The "Builder's Blindspot" — falling in love with the idea, not the market`, `Current tools offer no real-time, AI-driven validation support`] },
                    { num: "03", title: "Market Opportunity", icon: "📊", color: A, content: [plan?.market_size?.tam_label ? `TAM: ${plan.market_size.tam_label}` : `Total Addressable Market: Multi-billion dollar segment`, plan?.market_size?.sam_label ? `SAM: ${plan.market_size.sam_label}` : `Serviceable Market: Growing rapidly`, plan?.market_size?.som_label ? `3-Year Target: ${plan.market_size.som_label}` : `Initial Target Market: Early adopters`, plan?.market_size?.market_narrative || `Massive, underserved market with strong growth trajectory`] },
                    { num: "04", title: "Our Solution", icon: "💡", color: V2, content: [`AI-powered startup advisor that validates ideas before you build`, `5-question interrogation engine tailored to your role + timeline`, `Live web scraping for real competitor intelligence`, `Venture Readiness Score: AI scores your idea across 4 key dimensions`] },
                    { num: "05", title: "How It Works", icon: "⚙️", color: T, content: [`Step 1: Submit your idea (one rough sentence is enough)`, `Step 2: Answer 5 AI-generated clarifying questions`, `Step 3: Receive 90-day roadmap + competitor analysis + market sizing`, `Step 4: Enter the VC Pitch Room — defend your idea live against 3 AI investors`] },
                    { num: "06", title: "The VC Pitch Room", icon: "🦈", color: "#06B6D4", content: [`3 distinct AI VC personas: Skeptic, Growth Angel, Deep Tech`, `4-round interactive pitch simulation with real-time score tracking`, `Each answer scored: Strong / Decent / Weak / Red Flag`, `Final verdict + Venture Readiness Score update after pitch completes`] },
                    { num: "07", title: "Competitive Advantage", icon: "🏆", color: M, content: [
                      ...(plan?.competitors?.slice(0, 2).map((c: any) => `vs ${c.name || 'Competitor'}: ${c.differentiator?.slice(0, 60) || c.description?.slice(0, 60) || 'Our unique value'}...`) || []),
                      `Real-time web search — not static databases`, `Live VC simulation — no other tool has this`
                    ] },
                    { num: "08", title: "Tech Architecture", icon: "🔧", color: TS, content: [`Frontend: React + TypeScript + Vite + Framer Motion + Recharts`, `Backend: FastAPI (Python) + Gemini 2.5 Flash (structured JSON output)`, `Live web: DuckDuckGo real-time search for competitor discovery`, `AI Pipeline: 3 specialized agents — Interrogation, Planning, Pitch Room`] },
                    { num: "09", title: "Traction & Roadmap", icon: "📈", color: V, content: [
                      ...(plan?.roadmap?.day_30?.slice(0, 2).map((m: any) => `30 Days: ${typeof m === 'string' ? m.replace(/\[.*?\]\s*/, '') : (m?.text || 'Validate assumptions')}`) || []),
                      ...(plan?.roadmap?.day_60?.slice(0, 1).map((m: any) => `60 Days: ${typeof m === 'string' ? m.replace(/\[.*?\]\s*/, '') : (m?.text || 'Build core features')}`) || []),
                      `90 Days: Public launch + monetization`
                    ] },
                    { num: "10", title: "The Ask", icon: "🤝", color: V2, content: [`Stage: Pre-seed / Prototype validation`, `Target: Network partnerships with incubator networks and university hackathons`, `Focus: Connecting with mentors and early adopters`, `Goal: Helping 10,000 founders build what matters`] },
                    { num: "11", title: "Business Model", icon: "💰", color: M, content: [`Freemium: 3 free validations per month for solo builders`, `Pro Tier ($19/mo): Unlimited validations, PDF exports, and unlimited VC Pitch Room access`, `Enterprise Tier: License for university incubators, startup accelerators, and venture studios`, `API Licensing: Let third-party developer platforms embed our validation API`] },
                    { num: "12", title: "Go-To-Market", icon: "📣", color: A, content: [`University Hackathons: Embed LaunchMind as the official pre-validation tool for submissions`, `GitHub Marketplace: Release a GitHub Action that checks project ideas on repository creation`, `Build In Public: Leverage Twitter/X and LinkedIn content showing brutal VC Pitch Room roasts`, `Venture Partnerships: Partner with startup hubs to offer LaunchMind as part of onboarding`] },
                    { num: "13", title: "The Team", icon: "👥", color: V, content: [`Team Name: Dynamic Duo`, `Swaraj Kumar Behera (Fullstack Developer & AI Integration)`, `Prajakta Kuila (Frontend Engineer & UI/UX Design)`, `Vision: The Grammarly of startup validation — validate before you build`] },
                  ].map(({ num, title, icon, color, content }) => (
                    <GlassCard key={num} hoverable className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="text-2xl shrink-0" style={{ lineHeight: 1, marginTop: 2 }}>{icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-xs font-bold" style={{ ...MONO, color: `${color}80` }}>SLIDE {num}</span>
                            <h3 className="font-bold text-base" style={{ color: TP }}>{title}</h3>
                          </div>
                          <div className="space-y-2">
                            {content.filter(Boolean).map((line: string, i: number) => (
                              <div key={i} className="flex items-start gap-2">
                                <div className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: color }} />
                                <p className="text-sm leading-relaxed" style={{ color: TS }}>{line}</p>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`SLIDE ${num}: ${title}\n${content.filter(Boolean).join('\n')}`);
                              toast.success(`Slide ${num} copied!`, { description: 'Paste into your presentation.' });
                            }}
                            className="mt-4 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full transition-all"
                            style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                            <Link size={11} /> Copy Slide
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
                <div className="mt-6 p-4 rounded-xl" style={{ background: `${V}10`, border: `1px solid ${V}25` }}>
                  <p className="text-xs text-center" style={{ color: TS }}>💡 These slides are AI-generated from your actual plan data. Use them as a starting point in Google Slides or Canva.</p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </ScreenWrap>
  );
}

// ── VC Message Bubble with Typewriter ─────────────────────────────────────────
function VCMessageBubble({ text, isVC, animate, personaColor }: { text: string; isVC: boolean; animate: boolean; personaColor: string }) {
  const { displayed } = useTypewriter(text, 12, isVC && animate);
  return (
    <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${!isVC ? "rounded-tr-sm" : "rounded-tl-sm"}`}
      style={{
        background: !isVC ? `linear-gradient(135deg, ${V}30, ${V2}20)` : SURF,
        border: `1px solid ${!isVC ? `${V}30` : BD}`,
        color: TP,
      }}>
      {displayed}
    </div>
  );
}

// ── VC Pitch Room ─────────────────────────────────────────────────────────────

interface PitchMessage {
  speaker: "vc" | "founder";
  text: string;
}

function VCPitchRoom({ idea, role, timeline, team, plan, onBack, onRestart }: {
  idea: string; role: string; timeline: string; team: string;
  plan: any; onBack: () => void; onRestart: () => void;
}) {
  const [selectedPersona, setSelectedPersona] = useState<typeof VC_PERSONAS[0] | null>(null);
  const [conversation, setConversation] = useState<PitchMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ventureScore, setVentureScore] = useState(plan?.venture_score || 50);
  const [lastScoreLabel, setLastScoreLabel] = useState<string | null>(null);
  const [lastScoreDelta, setLastScoreDelta] = useState<number | null>(null);
  const [pitchComplete, setPitchComplete] = useState(false);
  const [finalVerdict, setFinalVerdict] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [conversation, isLoading]);

  const startPitch = async (persona: typeof VC_PERSONAS[0]) => {
    setSelectedPersona(persona);
    setStarted(true);
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea, role, timeline, team_size: team,
          persona_name: persona.name,
          persona_archetype: persona.archetype,
          persona_focus: persona.focus,
          founder_answer: "",
          conversation_history: [],
        })
      });
      const data = await res.json();
      setConversation([{ speaker: "vc", text: data.vc_response }]);
      setVentureScore(s => Math.min(100, Math.max(0, s + (data.score_delta || 0))));
    } catch {
      toast.info("Offline mode activated: Simulating live VC conversation.", { duration: 4000 });
      setConversation([{
        speaker: "vc",
        text: `Welcome, founder. I'm ${persona.name}, focusing on ${persona.focus.split(',')[0]}. Pitch me your idea: "${idea || 'your product'}". Why is this a burning pain, and what is your unfair advantage?`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendAnswer = async () => {
    if (!input.trim() || !selectedPersona || isLoading) return;
    const userMsg: PitchMessage = { speaker: "founder", text: input };
    const newConv = [...conversation, userMsg];
    setConversation(newConv);
    setInput("");
    setIsLoading(true);
    setLastScoreLabel(null);
    setLastScoreDelta(null);

    // Calculate count of VC questions asked so far (each vc speaker is a question)
    const turnCount = newConv.filter(m => m.speaker === "founder").length;

    try {
      const res = await fetch(`${API_BASE_URL}/api/pitch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea, role, timeline, team_size: team,
          persona_name: selectedPersona.name,
          persona_archetype: selectedPersona.archetype,
          persona_focus: selectedPersona.focus,
          founder_answer: input,
          conversation_history: newConv.map(m => ({ speaker: m.speaker, text: m.text })),
        })
      });
      const data = await res.json();
      const vcMsg: PitchMessage = { speaker: "vc", text: data.vc_response };
      setConversation(c => [...c, vcMsg]);
      setVentureScore(s => Math.min(100, Math.max(0, s + (data.score_delta || 0))));
      setLastScoreLabel(data.score_label);
      setLastScoreDelta(data.score_delta);
      if (data.pitch_complete) {
        setPitchComplete(true);
        setFinalVerdict(data.final_verdict);
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#FF2D78", "#C084FC", "#06B6D4", "#FCD34D"] });
      }
    } catch {
      // Offline fallback simulator
      setTimeout(() => {
        let responseText = "";
        let scoreDelta = 0;
        let scoreLabel = "Decent Answer";
        let isDone = false;
        let verdict = null;

        if (turnCount === 1) {
          responseText = `Interesting response. But let's talk distribution. As ${role || 'founder'}, how do you plan to acquire your first 100 users without spending a single dollar on ads? Give me specific channels.`;
          scoreDelta = 6;
          scoreLabel = "Strong Answer";
        } else if (turnCount === 2) {
          responseText = "Defensibility is key. If Microsoft or Google releases a similar feature in their product suite next week, why does your startup survive? What is your technical moat?";
          scoreDelta = -4;
          scoreLabel = "Weak Answer";
        } else if (turnCount === 3) {
          responseText = "Understood. The metrics are decent but early. If I write you a $250k check today, what is the #1 technical or hiring bottleneck you will solve first?";
          scoreDelta = 10;
          scoreLabel = "Strong Answer";
        } else {
          responseText = "Let me discuss this with my partners.";
          scoreDelta = 12;
          scoreLabel = "Strong Answer";
          isDone = true;
          verdict = `You defended your vision well. Although the customer acquisition strategy needs work, your product roadmap is solid and the pain point is real. Vance Capital is writing a $250k seed check. Congratulations!`;
        }

        setConversation(c => [...c, { speaker: "vc", text: responseText }]);
        setVentureScore(s => Math.min(100, Math.max(0, s + scoreDelta)));
        setLastScoreLabel(scoreLabel);
        setLastScoreDelta(scoreDelta);
        if (isDone) {
          setPitchComplete(true);
          setFinalVerdict(verdict);
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ["#FF2D78", "#C084FC", "#06B6D4", "#FCD34D"] });
        }
        setIsLoading(false);
      }, 1000);
      return;
    } finally {
      // Note: catch block handles loading state itself for offline path
      if (turnCount < 4) {
        setIsLoading(false);
      }
    }
  };

  // Persona Selection Screen
  if (!started) {
    return (
      <ScreenWrap>
        <div className="min-h-screen px-4 py-20 max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-sm mb-10 hover:opacity-80 transition-opacity" style={{ color: TS }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="text-center mb-12">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Pill label="VC Pitch Room 🦈" color={V} />
              <h2 className="font-bold mt-4 mb-3" style={{ fontSize: 36, color: TP, letterSpacing: "-0.03em" }}>
                Choose Your Investor
              </h2>
              <p className="text-sm max-w-md mx-auto" style={{ color: TS }}>
                Each investor has a unique personality, investment thesis, and blind spots. Choose wisely — their questions will directly reflect their focus areas.
              </p>
            </motion.div>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {VC_PERSONAS.map((persona, i) => (
              <motion.div key={persona.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                <GlassCard hoverable className="p-6 h-full cursor-pointer" onClick={() => startPitch(persona)}
                  style={{ borderTop: `3px solid ${persona.color}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                      style={{ background: `linear-gradient(135deg, ${persona.color}40, ${persona.color}20)`, border: `2px solid ${persona.color}50`, color: persona.color }}>
                      {persona.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: TP }}>{persona.name}</p>
                      <p className="text-xs" style={{ color: persona.color }}>{persona.title}</p>
                      <p className="text-xs" style={{ color: TS }}>{persona.firm}</p>
                    </div>
                  </div>
                  <div className="mb-3">
                    <Pill label={persona.archetype} color={persona.color} />
                  </div>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: TS }}>
                    <strong style={{ color: TP }}>Focus: </strong>{persona.focus}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: TS }}>
                    <strong style={{ color: TP }}>Style: </strong>{persona.personality}
                  </p>
                  <div className="mt-4 pt-4 border-t" style={{ borderColor: BD }}>
                    <BtnViolet size="sm" fullWidth onClick={() => startPitch(persona)}>
                      Pitch to {persona.name.split(" ")[0]} <ArrowRight size={12} />
                    </BtnViolet>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </ScreenWrap>
    );
  }

  const scoreLabelColor = lastScoreLabel === "Strong Answer" ? M : lastScoreLabel === "Decent Answer" ? A : lastScoreLabel === "Red Flag" ? "#FF3C3C" : TS;

  return (
    <ScreenWrap>
      <div className="min-h-screen flex flex-col max-w-4xl mx-auto px-4 py-20">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity" style={{ color: TS }}>
            <ArrowLeft size={16} />
          </button>
          {selectedPersona && (
            <>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ background: `${selectedPersona.color}30`, border: `2px solid ${selectedPersona.color}50`, color: selectedPersona.color }}>
                {selectedPersona.avatar}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: TP }}>{selectedPersona.name}</p>
                <p className="text-xs" style={{ color: selectedPersona.color }}>{selectedPersona.archetype}</p>
              </div>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            {lastScoreLabel && lastScoreDelta !== null && (
              <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="px-3 py-1.5 rounded-full text-xs font-bold"
                style={{ background: `${scoreLabelColor}20`, color: scoreLabelColor, border: `1px solid ${scoreLabelColor}40` }}>
                {lastScoreDelta > 0 ? `+${lastScoreDelta}` : lastScoreDelta} · {lastScoreLabel}
              </motion.div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: CARD, border: `1px solid ${BD}` }}>
              <Trophy size={14} color={V} />
              <span className="font-bold text-sm" style={{ color: TP, ...MONO }}>{Math.round(ventureScore)}</span>
              <span className="text-xs" style={{ color: TS }}>/ 100</span>
            </div>
          </div>
        </div>

        {/* Venture Score Bar */}
        <div className="mb-5">
          <div className="h-2 rounded-full overflow-hidden" style={{ background: BD }}>
            <motion.div
              animate={{ width: `${ventureScore}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${V}, ${V2}, #06B6D4)`, boxShadow: "0 0 12px rgba(255,45,120,0.4)" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs" style={{ color: TS }}>Venture Readiness</span>
            <span className="text-xs font-bold" style={{ color: ventureScore >= 75 ? M : ventureScore >= 50 ? A : TS }}>{Math.round(ventureScore)}%</span>
          </div>
        </div>

        {/* Chat Window */}
        <GlassCard className="flex-1 flex flex-col" style={{ minHeight: 420 }}>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 480 }}>
            {conversation.map((msg, i) => {
              const isLatestVC = msg.speaker === "vc" && i === conversation.length - 1;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className={`flex gap-3 ${msg.speaker === "founder" ? "flex-row-reverse" : ""}`}>
                  {msg.speaker === "vc" && selectedPersona && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                      style={{ background: `${selectedPersona.color}30`, border: `1.5px solid ${selectedPersona.color}50`, color: selectedPersona.color }}>
                      {selectedPersona.avatar}
                    </div>
                  )}
                  <VCMessageBubble
                    text={msg.text}
                    isVC={msg.speaker === "vc"}
                    animate={isLatestVC}
                    personaColor={selectedPersona?.color || V}
                  />
                </motion.div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3">
                {selectedPersona && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{ background: `${selectedPersona.color}30`, border: `1.5px solid ${selectedPersona.color}50`, color: selectedPersona.color }}>
                    {selectedPersona.avatar}
                  </div>
                )}
                <div className="p-4 rounded-2xl rounded-tl-sm" style={{ background: SURF, border: `1px solid ${BD}` }}>
                  <div className="flex gap-1.5 items-center">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: selectedPersona?.color || V, animation: `lmPulse 1.1s ease-in-out ${i * 0.18}s infinite` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {pitchComplete ? (
            <div className="p-6 border-t" style={{ borderColor: BD }}>
              {finalVerdict && (
                <div className="p-4 rounded-xl mb-4" style={{ background: `${V}15`, border: `1px solid ${V}30` }}>
                  <p className="text-xs font-bold mb-2" style={{ color: V, letterSpacing: "0.06em", textTransform: "uppercase" }}>Final Verdict</p>
                  <p className="text-sm leading-relaxed" style={{ color: TP }}>{finalVerdict}</p>
                </div>
              )}
              <div className="flex gap-3">
                <BtnViolet onClick={() => { setStarted(false); setConversation([]); setPitchComplete(false); setFinalVerdict(null); setLastScoreLabel(null); }} size="sm">
                  <RefreshCw size={13} /> Try Another VC
                </BtnViolet>
                <BtnGhost onClick={onBack}>Back to Dashboard</BtnGhost>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t" style={{ borderColor: BD }}>
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendAnswer(); } }}
                  placeholder="Defend your idea..."
                  className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: SURF, border: `1px solid ${BD}`, color: TP, caretColor: V }}
                  disabled={isLoading}
                />
                <BtnViolet onClick={sendAnswer} disabled={isLoading || input.trim().length < 3}>
                  Send <ArrowRight size={14} />
                </BtnViolet>
              </div>
              <p className="text-xs mt-2 text-center" style={{ color: TS }}>Press Enter to send · Be specific and confident · 4 rounds total</p>
            </div>
          )}
        </GlassCard>
      </div>
    </ScreenWrap>
  );
}

// ── Demo Screen ───────────────────────────────────────────────────────────────

function DemoScreen({ onHome, onTry, onHowItWorks, onAbout }: { onHome: () => void; onTry: () => void; onHowItWorks: () => void; onAbout: () => void }) {
  const sampleIdea = "A mobile app to help freelancers track unpaid invoices";
  return (
    <ScreenWrap>
      <Navbar onHome={onHome} onLaunch={onTry} onHowItWorks={onHowItWorks} onAbout={onAbout} />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-24">
        <div className="text-center mb-12">
          <Pill label="Live Demo" color={T} />
          <h2 className="font-bold mt-4 mb-3"
            style={{ fontSize: 32, color: TP, letterSpacing: "-0.025em" }}>
            See LaunchMind in action
          </h2>
          <p className="text-sm" style={{ color: TS }}>
            Pre-filled walkthrough for:{" "}
            <span style={{ color: TP, fontWeight: 600 }}>"{sampleIdea}"</span>
          </p>
        </div>

        <div className="space-y-5">
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill label="Step 1" color={V} />
              <span className="text-sm font-semibold" style={{ color: TP }}>Idea Input</span>
            </div>
            <div className="p-4 rounded-xl text-sm mb-3" style={{ background: SURF, color: TP, border: `1px solid ${BD}` }}>
              {sampleIdea}
            </div>
            <div className="flex flex-wrap gap-2">
              {["Founder", "1 month", "Solo"].map(p => (
                <span key={p} className="px-3 py-1 rounded-full text-xs"
                  style={{ background: `${V}20`, color: V, border: `1px solid ${V}35` }}>{p}</span>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill label="Step 2" color={V2} />
              <span className="text-sm font-semibold" style={{ color: TP }}>AI Clarification Questions</span>
            </div>
            <div className="space-y-3">
              {[
                { q: "Who owes money most — agencies, direct clients, or platforms?", a: "Mainly direct clients — most painful to chase" },
                { q: "Do freelancers currently have a tracking system, or winging it?", a: "Most are using spreadsheets or nothing at all" },
                { q: "What would make a freelancer pay $10/month for this?", a: "If it automatically sends reminders and escalations" },
              ].map(({ q, a }, i) => (
                <div key={i} className="p-3 rounded-xl"
                  style={{ background: SURF, borderLeft: `3px solid ${i < 2 ? M : V}` }}>
                  <p className="text-xs font-semibold mb-2" style={{ color: TP }}>{q}</p>
                  <div className="flex items-center gap-2">
                    <Check size={12} color={i < 2 ? M : TS} />
                    <p className="text-xs" style={{ color: i < 2 ? M : TS }}>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-5">
              <Pill label="Step 3" color={M} />
              <span className="text-sm font-semibold" style={{ color: TP }}>Execution Plan + VC Pitch Room</span>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center shrink-0 gap-3">
                <RingProgress value={82} size={100} color={V} />
                <p className="text-xs" style={{ color: TS }}>Clarity Score</p>
                <RingProgress value={71} size={100} color="#06B6D4" />
                <p className="text-xs" style={{ color: TS }}>Venture Score</p>
                <Pill label="High Feasibility" color={M} />
              </div>
              <div className="flex-1 space-y-3">
                <div className="p-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: SURF, borderLeft: `3px solid ${A}`, color: TS }}>
                  <strong style={{ color: TP }}>Key Assumption:</strong> Freelancers will pay for automated invoice follow-up, not just manual tracking.
                </div>
                <div className="p-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: SURF, borderLeft: `3px solid ${V2}`, color: TS }}>
                  <strong style={{ color: TP }}>30-Day Priority:</strong> Build a spreadsheet-based MVP. Manually send invoice reminders for 10 beta users and prove the concept.
                </div>
                <div className="p-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: SURF, borderLeft: `3px solid ${V}`, color: TS }}>
                  <strong style={{ color: TP }}>Day 1 Action:</strong> Post in 3 freelancer Slack communities asking about invoice pain points.
                </div>
                <div className="p-3 rounded-xl text-xs leading-relaxed"
                  style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(192,132,252,0.08) 100%)", borderLeft: `3px solid #06B6D4`, color: TS }}>
                  <strong style={{ color: "#06B6D4" }}>VC Pitch Room:</strong> Marcus Vance asks: "You said clients are the problem — but have you actually talked to 5 of them? Give me a number." <em style={{ color: V }}>+8 to Venture Score on strong answer.</em>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="text-center mt-14">
          <BtnViolet onClick={onTry} size="lg">
            Launch Your Own Idea <ArrowRight size={17} />
          </BtnViolet>
          <p className="mt-3 text-xs" style={{ color: TS }}>Free · No account required · Takes 5 minutes</p>
        </div>
      </div>
    </ScreenWrap>
  );
}

// ── Additional Screens ────────────────────────────────────────────────────────

function HowItWorksScreen({ onHome, onLaunch, onDemo, onAbout }: { onHome: () => void; onLaunch: () => void; onDemo: () => void; onAbout: () => void }) {
  const steps = [
    { num: "01", title: "Pitch Your Idea", desc: "Give us a rough sentence about what you want to build. Our AI acts as a product manager and asks you the tough clarifying questions you'd skip.", color: V, Icon: Brain },
    { num: "02", title: "Live Web Analysis", desc: "We instantly scrape the live web to find real competitors, surfacing the market landscape with AI-generated TAM/SAM/SOM sizing.", color: V2, Icon: Target },
    { num: "03", title: "Get Your Roadmap", desc: "You receive a 30/60/90 day execution plan, the top 3 assumptions that could kill your idea, and a concrete Day 1 action.", color: T, Icon: Rocket },
    { num: "04", title: "Enter the Pitch Room", desc: "Face 3 AI venture capitalists in a live simulation. Defend your idea round-by-round and watch your Venture Readiness Score update live.", color: "#06B6D4", Icon: MessageSquare },
  ];
  return (
    <ScreenWrap>
      <Navbar onHome={onHome} onLaunch={onLaunch} onDemo={onDemo} onAbout={onAbout} />
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Pill label="The Process" color={V} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
          className="font-bold mt-5 mb-10" style={{ fontSize: 36, color: TP, letterSpacing: "-0.03em" }}>
          How LaunchMind Works
        </motion.h2>
        <div className="grid md:grid-cols-4 gap-5 text-left">
          {steps.map(({ num, title, desc, color, Icon }, i) => (
            <motion.div key={num}
              initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
              <GlassCard hoverable className="p-6 h-full relative overflow-hidden">
                <div className="absolute top-3 right-4 font-bold" style={{ ...MONO, color: `${color}25`, fontSize: 48, lineHeight: 1 }}>{num}</div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}25`, boxShadow: `0 0 20px ${color}15` }}>
                  <Icon size={19} color={color} />
                </div>
                <h3 className="font-bold mb-3 text-base" style={{ color }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: TS }}>{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.4 }}
          className="mt-14">
          <BtnViolet onClick={onLaunch} size="lg">Try It Now <ArrowRight size={16} /></BtnViolet>
        </motion.div>
      </div>
    </ScreenWrap>
  );
}

function AboutScreen({ onHome, onLaunch, onDemo, onHowItWorks }: { onHome: () => void; onLaunch: () => void; onDemo: () => void; onHowItWorks: () => void }) {
  return (
    <ScreenWrap>
      <Navbar onHome={onHome} onLaunch={onLaunch} onDemo={onDemo} onHowItWorks={onHowItWorks} />
      <div className="max-w-2xl mx-auto px-4 pt-32 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Pill label="About LaunchMind" color={M} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
          className="font-bold mt-5 mb-8" style={{ fontSize: 36, color: TP, letterSpacing: "-0.03em" }}>
          Built to Cure the Builder's Blindspot
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
          <GlassCard className="p-8 mb-6 text-left">
            <p className="text-sm leading-[1.85] mb-4" style={{ color: TS }}>
              Every year, millions of developers, students, and aspiring founders spend months — or even years — building products that nobody wants. They fall in love with their idea, jump straight into coding, and ignore the critical market realities and brutal questions a seasoned investor would ask on Day 1.
            </p>
            <p className="text-sm leading-[1.85] mb-4" style={{ color: TS }}>
              <strong style={{ color: TP }}>We call this the Builder's Blindspot.</strong> LaunchMind was built to cure it — by simulating the experience of pitching to a ruthless Silicon Valley VC before you write a single line of code.
            </p>
            <div className="h-px w-full my-5" style={{ background: BD }} />
            <div className="grid grid-cols-2 gap-3">
              {[
                { Icon: Zap, label: "Gemini 2.5 Flash", color: V },
                { Icon: Target, label: "Live Web Search", color: V2 },
                { Icon: MessageSquare, label: "VC Pitch Room", color: "#06B6D4" },
                { Icon: BarChart2, label: "Market Intelligence", color: A },
              ].map(({ Icon, label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon size={14} color={color} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: TP }}>{label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <BtnViolet onClick={onLaunch} size="lg">Start Validating <ArrowRight size={16} /></BtnViolet>
        </motion.div>
      </div>
    </ScreenWrap>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [screen, setScreen] = useState<Screen>(() => loadSession()?.screen || "landing");
  const [idea, setIdea] = useState(() => loadSession()?.idea || "");
  const [role, setRole] = useState(() => loadSession()?.role || "Student");
  const [timeline, setTimeline] = useState(() => loadSession()?.timeline || "1 month");
  const [team, setTeam] = useState(() => loadSession()?.team || "Solo");
  const [analysis, setAnalysis] = useState<any>(() => loadSession()?.analysis || null);
  const [plan, setPlan] = useState<any>(() => loadSession()?.plan || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Persistence side-effect
  useEffect(() => {
    saveSession({ screen, idea, role, timeline, team, analysis, plan });
  }, [screen, idea, role, timeline, team, analysis, plan]);

  // First-time visit onboarding check
  useEffect(() => {
    const visited = localStorage.getItem("launchmind_visited");
    if (!visited) {
      setShowOnboarding(true);
      localStorage.setItem("launchmind_visited", "true");
    }
  }, []);

  const go = (s: Screen) => setScreen(s);
  const restart = () => {
    clearSession();
    setScreen("landing");
    setIdea("");
    setRole("Student");
    setTimeline("1 month");
    setTeam("Solo");
    setAnalysis(null);
    setPlan(null);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, role, timeline, team_size: team, is_roast_mode: isRoastMode })
      });
      const data = await res.json();
      setAnalysis(data);
      go("questions");
    } catch (err) {
      console.warn("Backend not running. Activating offline mode with demo metrics.", err);
      toast.info("Offline demo mode: Using pre-baked sample questions.", { duration: 5000 });
      setAnalysis({
        ...DEMO_ANALYSIS,
        idea_summary: `[OFFLINE MODE] ${idea || "Freelancer invoice tracker"}`
      });
      go("questions");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePlan = async (answers: string[]) => {
    setIsPlanning(true);
    setPlan(null);
    go("results");
    
    try {
      const answersPayload = analysis.clarifying_questions.map((q: string, i: number) => ({
        question: q,
        answer: answers[i]
      }));

      const res = await fetch(`${API_BASE_URL}/api/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, role, timeline, team_size: team, answers: answersPayload })
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.warn("Backend down. Activating offline mode for plan generation.", err);
      setTimeout(() => {
        toast.success("Offline demo plan generated successfully!", { duration: 5000 });
        setPlan(DEMO_PLAN);
        setIsPlanning(false);
      }, 1500);
      return;
    } finally {
      setIsPlanning(false);
    }
  };

  const handleAdjustPlan = async (validated_item: string) => {
    setIsPlanning(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, role, timeline, team_size: team, validated_item, current_plan: plan })
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.warn("Adjust failed. Recalculating offline.", err);
      setTimeout(() => {
        toast.info("Plan adapted offline.", { duration: 3000 });
        // Simulating adaptation offline by updating roadmap items
        const updatedPlan = { ...plan };
        if (updatedPlan.roadmap && updatedPlan.roadmap.day_30) {
          updatedPlan.roadmap.day_30 = updatedPlan.roadmap.day_30.filter((item: string) => !item.includes(validated_item));
        }
        setPlan(updatedPlan);
        setIsPlanning(false);
      }, 1000);
      return;
    } finally {
      setIsPlanning(false);
    }
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: TP }}>
      <style>{`
        @keyframes lmSpin { to { transform: rotate(360deg); } }
        @keyframes lmPulse { 0%,100%{opacity:.2;transform:scale(.7)} 50%{opacity:1;transform:scale(1)} }
        @keyframes lmGlow { 0%,100%{box-shadow:0 0 20px rgba(255,45,120,0.15)} 50%{box-shadow:0 0 40px rgba(255,45,120,0.35)} }
        @keyframes lmShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
        @keyframes lmFloat { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }
        @keyframes lmGradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        * { scrollbar-width: none; -ms-overflow-style: none; }
        *::-webkit-scrollbar { display: none; }
        ::placeholder { color: #9B7EA0; }
        textarea, input { font-family: 'Inter', sans-serif; }
        ::selection { background: rgba(255,45,120,0.3); }
        .lm-float { animation: lmFloat 4s ease-in-out infinite; }
        .lm-glow { animation: lmGlow 3s ease-in-out infinite; }
      `}</style>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: CARD,
            border: `1px solid ${BD}`,
            color: TP,
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />

      <CherryBlossomCanvas />

      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}

      <AnimatePresence mode="wait">
        {screen === "landing" && (
          <LandingScreen key="landing" onHome={() => go("landing")} onStart={() => go("input")} onDemo={() => go("demo")} onHowItWorks={() => go("how-it-works")} onAbout={() => go("about")} />
        )}
        {screen === "how-it-works" && (
          <HowItWorksScreen key="how-it-works" onHome={() => go("landing")} onLaunch={() => go("input")} onDemo={() => go("demo")} onAbout={() => go("about")} />
        )}
        {screen === "about" && (
          <AboutScreen key="about" onHome={() => go("landing")} onLaunch={() => go("input")} onDemo={() => go("demo")} onHowItWorks={() => go("how-it-works")} />
        )}
        {screen === "input" && (
          <IdeaInputScreen key="input"
            idea={idea} setIdea={setIdea}
            role={role} setRole={setRole}
            timeline={timeline} setTimeline={setTimeline}
            team={team} setTeam={setTeam}
            isRoastMode={isRoastMode} setIsRoastMode={setIsRoastMode}
            isAnalyzing={isAnalyzing}
            onNext={handleAnalyze}
            onBack={() => go("landing")} />
        )}
        {screen === "questions" && (
          <QuestionsScreen key="questions" idea={idea} analysis={analysis} isPlanning={isPlanning} onDone={handlePlan} onBack={() => go("input")} />
        )}
        {screen === "results" && (
          <ResultsDashboard key="results" idea={idea} analysis={analysis} plan={plan} isPlanning={isPlanning} onAdjust={handleAdjustPlan} onRestart={restart} onPitchRoom={() => go("pitch-room")} />
        )}
        {screen === "pitch-room" && (
          <VCPitchRoom key="pitch-room" idea={idea} role={role} timeline={timeline} team={team} plan={plan} onBack={() => go("results")} onRestart={restart} />
        )}
        {screen === "demo" && (
          <DemoScreen key="demo" onHome={() => go("landing")} onTry={() => { setIdea(""); go("input"); }} onHowItWorks={() => go("how-it-works")} onAbout={() => go("about")} />
        )}
      </AnimatePresence>
    </div>
  );
}
