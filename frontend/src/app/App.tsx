import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Zap, Brain, AlertTriangle, Rocket, ChevronDown, ChevronUp,
  Check, Download, Link, ArrowRight, ArrowLeft, X, Sparkles,
  RefreshCw, ExternalLink, TrendingUp, Calendar, Target, Users
} from "lucide-react";

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

type Screen = "landing" | "input" | "questions" | "results" | "demo" | "how-it-works" | "about";
type Tab = "assumptions" | "roadmap" | "week1" | "market";

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

    interface Ripple {
      x: number; y: number; r: number; opacity: number;
    }

    interface Bloom {
      x: number; y: number; r: number; opacity: number; color: string;
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

    // Scatter initial petals across screen
    const petals: Petal[] = Array.from({ length: 50 }, () => {
      const p = makePetal();
      p.y = Math.random() * H;
      p.opacity = 0.05 + Math.random() * 0.25;
      return p;
    });

    const ripples: Ripple[] = [];
    const blooms: Bloom[] = [];
    let mouse = { x: -1000, y: -1000 };
    let t = 0;

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      // Petal bezier shape
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.75, -s * 0.55, s * 0.55, s * 0.75, 0, s * 0.35);
      ctx.bezierCurveTo(-s * 0.55, s * 0.75, -s * 0.75, -s * 0.55, 0, -s);
      ctx.fill();
      // Inner shimmer
      ctx.globalAlpha = p.opacity * 0.4;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.25, s * 0.18, s * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    let animId = 0;

    const tick = () => {
      t++;
      ctx.clearRect(0, 0, W, H);

      // Vignette overlay for depth
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(12,8,13,0.55)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      const windX = Math.sin(t * 0.0025) * 0.5 + Math.sin(t * 0.007) * 0.2;

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.life++;

        // Gravity + wind
        p.vx += windX * 0.025;
        p.vy += 0.012;

        // Mouse attraction / swirl removed

        // Sinusoidal wobble
        p.phase += p.phaseSpeed;
        p.vx += Math.sin(p.phase) * 0.04;

        // Velocity damping
        p.vx *= 0.979;
        p.vy *= 0.988;

        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;

        // Fade near bottom or end of life
        if (p.y > H - 100) p.opacity -= 0.012;
        if (p.maxLife !== Infinity && p.life > p.maxLife * 0.7) {
          p.opacity -= 0.015;
        }

        // Recycle
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

    const onMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };

    const onLeave = () => { mouse = { x: -1000, y: -1000 }; };

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
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

function RingProgress({ value, size = 128 }: { value: number; size?: number }) {
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
            <stop offset="0%" stopColor={V} />
            <stop offset="100%" stopColor={V2} />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.05)" strokeWidth={11} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth={11} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.3s cubic-bezier(0.34,1.2,0.64,1)", filter: "drop-shadow(0 0 6px rgba(255,45,120,0.6))" }} />
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
  return (
    <nav className="fixed top-4 inset-x-0 z-50 flex justify-center px-4">
      <div className="flex items-center justify-between w-full max-w-5xl px-5 py-3 rounded-2xl"
        style={{
          background: "rgba(20,10,17,0.85)",
          border: `1px solid rgba(255,45,120,0.12)`,
          backdropFilter: "blur(24px) saturate(1.4)",
          boxShadow: "0 0 40px rgba(255,45,120,0.06), 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)",
        }}>
        <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
          <img src="/favicon.png" alt="LaunchMind Logo" className="w-7 h-7 rounded-lg object-cover" />
          <span className="font-bold" style={{ color: TP, letterSpacing: "-0.02em" }}>LaunchMind</span>
        </button>
        <div className="hidden md:flex items-center gap-2">
          {[
            { label: "How it works", icon: Brain, onClick: onHowItWorks },
            { label: "Examples", icon: Rocket, onClick: onDemo },
            { label: "About", icon: Zap, onClick: onAbout }
          ].map(({ label, icon: Icon, onClick }) => (
            <button key={label} onClick={onClick}
              className="flex items-center gap-2 px-4 py-2 text-sm rounded-full transition-all duration-200"
              style={{ color: TS }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.color = TP;
                el.style.background = "rgba(255,255,255,0.05)";
                el.style.transform = "scale(1.02)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.color = TS;
                el.style.background = "transparent";
                el.style.transform = "scale(1)";
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
        <BtnViolet onClick={onLaunch} size="sm">Start Building <ArrowRight size={13} /></BtnViolet>
      </div>
    </nav>
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
            AI-Powered Execution Engine
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="font-bold mb-6"
            style={{ fontSize: "clamp(38px,5.5vw,62px)", color: TP, letterSpacing: "-0.04em", lineHeight: 1.04 }}>
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
            Turn your vague idea into a structured execution plan — with AI that interrogates your thinking, not just generates lists.
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
            {["Built in 7 days", "Gemini-Powered", "100% Free"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span style={{ opacity: 0.35 }}>·</span>}
                {s}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 pb-28 grid md:grid-cols-3 gap-5">
        {[
          { Icon: Brain, title: "Idea Interrogation", desc: "AI asks the questions you forgot to ask yourself", color: V, delay: 0.6, num: "01" },
          { Icon: AlertTriangle, title: "Assumption Mapping", desc: "Surface the 3 beliefs that could kill your idea before you build", color: V2, delay: 0.7, num: "02" },
          { Icon: Rocket, title: "Execution Roadmap", desc: "30/60/90-day plan with a concrete Day 1 action", color: T, delay: 0.8, num: "03" },
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

function ExportDrawer({ open, onClose, onRestart }: { open: boolean; onClose: () => void; onRestart: () => void }) {
  const [copied, setCopied] = useState(false);
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
                { Icon: Download, label: "Download PDF", sub: "Get a portable version of your full plan", action: "Download", available: true },
                { Icon: ExternalLink, label: "Copy to Notion", sub: "Push directly to your Notion workspace", action: "Coming soon", available: false },
                { Icon: Link, label: "Share Link", sub: "Generate a unique, shareable URL", action: copied ? "Copied!" : "Copy Link", available: true },
              ].map(({ Icon, label, sub, action, available }) => (
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
                        <BtnViolet size="sm"
                          onClick={label === "Share Link" ? () => { setCopied(true); setTimeout(() => setCopied(false), 2000); } : undefined}>
                          {action}
                        </BtnViolet>
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

// ── Results Dashboard ─────────────────────────────────────────────────────────

function ResultsDashboard({ idea, analysis, plan, isPlanning, onAdjust, onRestart }: { idea: string; analysis: any; plan: any; isPlanning?: boolean; onAdjust?: (item: string) => void; onRestart: () => void }) {
  const [tab, setTab] = useState<Tab>("assumptions");
  const [validated, setValidated] = useState(new Set<number>());
  const [expanded, setExpanded] = useState(new Set<number>());
  const [checked, setChecked] = useState(new Set<string>());
  const [showExport, setShowExport] = useState(false);

  const displayIdea = analysis?.idea_summary || idea;

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
    { id: "market" as Tab, label: "Market Map", Icon: Target },
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
                <div className="h-10 rounded-xl" style={{ background: CARD }} />
                <div className="h-10 rounded-xl" style={{ background: CARD }} />
                <div className="h-10 rounded-xl" style={{ background: CARD }} />
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
      <ExportDrawer open={showExport} onClose={() => setShowExport(false)} onRestart={onRestart} />
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

            <div className="flex flex-col items-center py-2">
              <RingProgress value={analysis.clarity_score} />
              <p className="text-xs font-semibold mt-3 mb-1" style={{ color: TS }}>Clarity Score</p>
              <p className="text-xs text-center mb-4" style={{ color: TS }}>Based on feasibility and assumptions</p>
              {plan.competitors && (
                <button onClick={() => setTab("market")} className="text-xs px-3 py-1.5 rounded-full transition-colors flex items-center gap-1.5" style={{ background: `${T}20`, color: T, border: `1px solid ${T}40` }}>
                  <Target size={12} /> {plan.competitors.length} Competitors Found
                </button>
              )}
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-xs" style={{ color: TS }}>Feasibility</span>
              <Pill label={analysis.feasibility} color={V2} />
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
                            if (match) {
                              tag = match[1];
                              text = match[2];
                            }
                          } else if (typeof m === "object") {
                            text = m.text;
                            tag = m.tag;
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
                  {plan.week1.map(({ day, tasks, hrs }: any) => (
                    <GlassCard key={day} hoverable className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold" style={{ ...MONO, color: T }}>Day {day}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: `${T}18`, color: T, fontSize: 10 }}>{hrs}</span>
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

            {tab === "market" && (
              <motion.div key="market"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}>
                <div className="mb-6">
                  <h2 className="font-bold mb-1" style={{ fontSize: 20, color: TP }}>Market Map</h2>
                  <p className="text-sm" style={{ color: TS }}>We found analogous products or competitors. Here's how you stand out.</p>
                </div>
                <div className="space-y-4">
                  {plan.competitors && plan.competitors.map((comp: any, idx: number) => (
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
            )}
          </AnimatePresence>
        </main>
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
              <span className="text-sm font-semibold" style={{ color: TP }}>Execution Plan Generated</span>
            </div>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex flex-col items-center shrink-0">
                <RingProgress value={82} size={108} />
                <p className="text-xs mt-2 mb-2" style={{ color: TS }}>Clarity Score</p>
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
    { num: "01", title: "Pitch Your Idea", desc: "Give us a rough sentence about what you want to build. Our AI acts as a product manager and asks you the tough clarifying questions.", color: V, Icon: Brain },
    { num: "02", title: "Live Web Analysis", desc: "We instantly scrape the web to find live competitors, allowing us to build an accurate Market Map with real data.", color: V2, Icon: Target },
    { num: "03", title: "Get Your Roadmap", desc: "You receive a 30/60/90 day execution plan, the top 3 assumptions that could kill your idea, and a concrete Day 1 action.", color: T, Icon: Rocket },
  ];
  return (
    <ScreenWrap>
      <Navbar onHome={onHome} onLaunch={onLaunch} onDemo={onDemo} onAbout={onAbout} />
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-24 text-center">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
          <Pill label="The Process" color={V} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
          className="font-bold mt-5 mb-10" style={{ fontSize: 36, color: TP, letterSpacing: "-0.03em" }}>
          How LaunchMind Works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6 text-left">
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
                <h3 className="font-bold mb-3 text-lg" style={{ color }}>{title}</h3>
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
          <Pill label="About Us" color={M} />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.45 }}
          className="font-bold mt-5 mb-8" style={{ fontSize: 36, color: TP, letterSpacing: "-0.03em" }}>
          Built for Builders
        </motion.h2>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.4 }}>
          <GlassCard className="p-8 mb-6 text-left">
            <p className="text-sm leading-[1.85] mb-4" style={{ color: TS }}>
              LaunchMind was created because too many founders spend months building products nobody wants. We built this tool to simulate the experience of having an experienced startup advisor grill your idea and give you a reality check — before you write a single line of code.
            </p>
            <div className="h-px w-full my-5" style={{ background: BD }} />
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${V}15`, border: `1px solid ${V}25` }}>
                  <Zap size={14} color={V} />
                </div>
                <span className="text-xs font-semibold" style={{ color: TP }}>Gemini 2.5 Flash</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${V2}15`, border: `1px solid ${V2}25` }}>
                  <Target size={14} color={V2} />
                </div>
                <span className="text-xs font-semibold" style={{ color: TP }}>Live Web Scraping</span>
              </div>
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
  const [screen, setScreen] = useState<Screen>("landing");
  const [idea, setIdea] = useState("");
  const [role, setRole] = useState("Student");
  const [timeline, setTimeline] = useState("1 month");
  const [team, setTeam] = useState("Solo");
  const [analysis, setAnalysis] = useState<any>(null);
  const [plan, setPlan] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlanning, setIsPlanning] = useState(false);
  const [isRoastMode, setIsRoastMode] = useState(false);

  const go = (s: Screen) => setScreen(s);
  const restart = () => { setScreen("landing"); setIdea(""); setAnalysis(null); setPlan(null); };

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
      console.error(err);
      alert("Failed to analyze idea. Is the backend running?");
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
      console.error(err);
      alert("Failed to build plan. Is the backend running?");
      go("questions");
    } finally {
      setIsPlanning(false);
    }
  };

  const handleAdjustPlan = async (validated_item: string) => {
    setIsPlanning(true);
    try {
      const res = await fetch("http://localhost:8000/api/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, role, timeline, team_size: team, validated_item, current_plan: plan })
      });
      const data = await res.json();
      setPlan(data);
    } catch (err) {
      console.error(err);
      alert("Failed to recalculate plan. Is the backend running?");
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

      <CherryBlossomCanvas />

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
          <ResultsDashboard key="results" idea={idea} analysis={analysis} plan={plan} isPlanning={isPlanning} onAdjust={handleAdjustPlan} onRestart={restart} />
        )}
        {screen === "demo" && (
          <DemoScreen key="demo" onHome={() => go("landing")} onTry={() => { setIdea(""); go("input"); }} onHowItWorks={() => go("how-it-works")} onAbout={() => go("about")} />
        )}
      </AnimatePresence>
    </div>
  );
}
