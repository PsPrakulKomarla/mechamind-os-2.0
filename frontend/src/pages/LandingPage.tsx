import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Cpu, FileText, BarChart3, Wifi, Wrench, GitBranch, Shield,
  Brain, Activity, ArrowRight, ChevronRight, Eye, Search,
  Layers, Zap, Database, Settings, CheckCircle2,
  TrendingUp, Clock, Lock, AlertTriangle, Menu, X,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i = 0) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: (i = 0) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

function useCounter(end: number, duration = 2000) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, end, duration]);
  return { ref, count };
}

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section ref={ref} id={id} initial="hidden" animate={isInView ? "visible" : "hidden"} className={className}>
      {children}
    </motion.section>
  );
}

function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    interface Particle { x: number; y: number; vx: number; vy: number; r: number; o: number; }
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5, o: Math.random() * 0.3 + 0.1,
    }));
    let time = 0;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      time += 0.002;
      ctx.strokeStyle = "rgba(59,130,246,0.04)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      const offsetX = (time * 20) % gridSize;
      const offsetY = (time * 10) % gridSize;
      for (let x = -gridSize + offsetX; x < w + gridSize; x += gridSize) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = -gridSize + offsetY; y < h + gridSize; y += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${p.o})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59,130,246,${0.06 * (1 - dist / 150)})`; ctx.stroke();
          }
        }
      }
      const gradient = ctx.createLinearGradient(0, h * 0.6, w, h);
      gradient.addColorStop(0, "rgba(59,130,246,0.02)");
      gradient.addColorStop(0.5, "rgba(6,182,212,0.015)");
      gradient.addColorStop(1, "rgba(139,92,246,0.02)");
      ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 4) {
        const y = h * 0.75 + Math.sin(x * 0.003 + time) * 30 + Math.sin(x * 0.007 + time * 1.5) * 15;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h); ctx.closePath(); ctx.fill();
      animId = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

function AiKnowledgeCore() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 20);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 20);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [mouseX, mouseY]);
  const nodes = [
    { x: -120, y: -80, label: "PDF", icon: FileText },
    { x: 120, y: -60, label: "IoT", icon: Wifi },
    { x: -100, y: 90, label: "SOP", icon: Shield },
    { x: 130, y: 80, label: "KG", icon: GitBranch },
    { x: 0, y: -130, label: "AI", icon: Brain },
    { x: -140, y: 10, label: "Sensor", icon: Activity },
    { x: 140, y: -10, label: "Report", icon: BarChart3 },
  ];
  return (
    <motion.div
      className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] mx-auto"
      style={{ rotateX: springY, rotateY: springX, perspective: 800 }}
    >
      <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-[#3B82F6]/20 via-[#06B6D4]/10 to-[#8B5CF6]/20 border border-[#3B82F6]/30 shadow-[0_0_80px_rgba(59,130,246,0.25),inset_0_0_60px_rgba(59,130,246,0.1)] animate-[spin_20s_linear_infinite]">
        <div className="absolute inset-4 rounded-full border border-[#3B82F6]/20 border-dashed" />
        <div className="absolute inset-8 rounded-full border border-[#06B6D4]/15" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Cpu size={48} className="text-[#3B82F6] drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
        </div>
      </div>
      <div className="absolute inset-0 animate-[spin_30s_linear_infinite]">
        <div className="absolute inset-[5%] rounded-full border border-[#3B82F6]/10" style={{ transform: "rotateX(70deg)" }} />
      </div>
      <div className="absolute inset-0 animate-[spin_25s_linear_infinite_reverse]">
        <div className="absolute inset-[10%] rounded-full border border-[#06B6D4]/[0.08]" style={{ transform: "rotateX(60deg) rotateZ(45deg)" }} />
      </div>
      {nodes.map((node, i) => {
        const Icon = node.icon;
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ left: `calc(50% + ${node.x}px)`, top: `calc(50% + ${node.y}px)`, transform: "translate(-50%, -50%)" }}
            animate={{ y: [0, -6, 0, 6, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#111827]/80 border border-[#3B82F6]/20 flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              <Icon size={18} className="text-[#3B82F6]" />
            </div>
            <span className="block text-[9px] sm:text-[10px] text-[#3B82F6]/60 text-center mt-1 font-mono">{node.label}</span>
          </motion.div>
        );
      })}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 420 420">
        {nodes.map((node, i) => (
          <line key={i} x1="210" y1="210" x2={210 + node.x} y2={210 + node.y} stroke="rgba(59,130,246,0.12)" strokeWidth="1" strokeDasharray="4 4" />
        ))}
      </svg>
    </motion.div>
  );
}

function FloatingCard({ icon: Icon, label, delay, x, y }: { icon: typeof FileText; label: string; delay: number; x: string; y: string; }) {
  return (
    <motion.div
      className="absolute hidden md:block"
      style={{ left: x, top: y }}
      animate={{ y: [0, -10, 0, 10, 0], rotate: [0, 2, 0, -2, 0] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <div className="w-20 h-24 rounded-xl bg-[#111827]/60 border border-[#3B82F6]/15 backdrop-blur-sm p-3 flex flex-col items-center gap-2 shadow-lg hover:border-[#3B82F6]/30 transition-colors cursor-default" style={{ transform: `rotate(${(delay % 3 - 1) * 3}deg)` }}>
        <Icon size={20} className="text-[#3B82F6]/70" />
        <span className="text-[8px] text-gray-500 text-center leading-tight">{label}</span>
      </div>
    </motion.div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <AnimatedBackground />
      <FloatingCard icon={FileText} label="PDF" delay={0} x="5%" y="20%" />
      <FloatingCard icon={Wrench} label="Maintenance Report" delay={0.5} x="85%" y="15%" />
      <FloatingCard icon={Eye} label="Inspection Report" delay={1} x="8%" y="65%" />
      <FloatingCard icon={Shield} label="SOP" delay={1.5} x="82%" y="60%" />
      <FloatingCard icon={Layers} label="Engineering Drawing" delay={2} x="15%" y="80%" />
      <FloatingCard icon={Wifi} label="IoT Sensor" delay={2.5} x="78%" y="80%" />
      <FloatingCard icon={GitBranch} label="Knowledge Graph" delay={3} x="50%" y="85%" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center lg:text-left">
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-medium mb-6">
              <Zap size={12} /> AI-Powered Industrial Intelligence
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Industrial Intelligence.<br />
              <span className="bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] bg-clip-text text-transparent">One AI Brain.</span><br />
              <span className="text-gray-300">Infinite Operational Knowledge.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="mt-6 text-gray-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              MechaMind OS 2.0 transforms industrial documents, SOPs, maintenance records, IoT data, engineering drawings, inspection reports, and enterprise knowledge into one intelligent operational brain using AI, RAG, Knowledge Graphs, and Agentic AI.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#3B82F6] hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                Get Started <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#111827] border border-gray-700 hover:border-[#3B82F6]/50 text-white font-medium transition-all">
                Login <ChevronRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <AiKnowledgeCore />
            <div className="absolute inset-0 bg-[#3B82F6]/5 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </div>
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-5 h-8 rounded-full border-2 border-gray-600 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#3B82F6]" />
        </div>
      </motion.div>
    </section>
  );
}

function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B1220]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Cpu size={24} className="text-[#3B82F6]" />
          <span className="text-white font-bold text-lg">MechaMind OS</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#architecture" className="text-sm text-gray-400 hover:text-white transition-colors">Architecture</a>
          <a href="#why" className="text-sm text-gray-400 hover:text-white transition-colors">Why Us</a>
          <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">Login</Link>
          <Link to="/register" className="px-4 py-2 rounded-lg bg-[#3B82F6] hover:bg-blue-500 text-white text-sm font-medium transition-colors">Get Started</Link>
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-gray-400 hover:text-white">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[#0B1220]/95 backdrop-blur-xl border-b border-white/5 px-4 pb-4">
          <a href="#features" className="block py-2 text-gray-400 hover:text-white text-sm">Features</a>
          <a href="#architecture" className="block py-2 text-gray-400 hover:text-white text-sm">Architecture</a>
          <a href="#why" className="block py-2 text-gray-400 hover:text-white text-sm">Why Us</a>
          <Link to="/login" className="block py-2 text-gray-300 hover:text-white text-sm">Login</Link>
          <Link to="/register" className="block mt-2 text-center px-4 py-2 rounded-lg bg-[#3B82F6] text-white text-sm font-medium">Get Started</Link>
        </div>
      )}
    </nav>
  );
}

function ProblemSection() {
  const steps = [
    { icon: FileText, text: "PDFs scattered across drives" },
    { icon: Settings, text: "Emails buried in inboxes" },
    { icon: Wrench, text: "Maintenance logs in paper" },
    { icon: Eye, text: "Inspection reports locked away" },
    { icon: Layers, text: "Engineering drawings outdated" },
    { icon: Shield, text: "SOPs inconsistent & hidden" },
    { icon: AlertTriangle, text: "Knowledge loss every day" },
    { icon: Clock, text: "Slow decisions across teams" },
    { icon: Activity, text: "Unexpected downtime increases" },
  ];
  return (
    <Section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-[#3B82F6] text-sm font-medium tracking-wider uppercase">The Challenge</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Industrial Knowledge Is Scattered.</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Critical operational knowledge is fragmented across dozens of systems, formats, and locations leading to costly delays and preventable failures.</p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6]/30 via-[#06B6D4]/20 to-[#EF4444]/30" />
          <div className="space-y-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEnd = i >= steps.length - 3;
              return (
                <motion.div key={i} variants={slideFromLeft} custom={i} className="relative flex items-center gap-4 sm:gap-6 pl-14 sm:pl-18">
                  <div className={`absolute left-3 sm:left-5 w-7 h-7 rounded-full flex items-center justify-center border ${isEnd ? "bg-[#EF4444]/10 border-[#EF4444]/30" : "bg-[#111827] border-[#3B82F6]/30"}`}>
                    <Icon size={14} className={isEnd ? "text-[#EF4444]" : "text-[#3B82F6]"} />
                  </div>
                  <div className={`flex-1 px-5 py-4 rounded-xl border transition-colors ${isEnd ? "bg-[#EF4444]/5 border-[#EF4444]/20" : "bg-[#111827]/50 border-gray-800 hover:border-[#3B82F6]/30"}`}>
                    <span className={`text-sm sm:text-base ${isEnd ? "text-[#EF4444]" : "text-gray-300"}`}>{step.text}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function SolutionSection() {
  const stages = [
    { icon: FileText, label: "Documents", color: "#3B82F6" },
    { icon: Eye, label: "OCR Processing", color: "#06B6D4" },
    { icon: GitBranch, label: "Knowledge Graph", color: "#8B5CF6" },
    { icon: Database, label: "Vector Database", color: "#3B82F6" },
    { icon: Brain, label: "AI Copilot", color: "#06B6D4" },
    { icon: Zap, label: "Operational Intelligence", color: "#10B981" },
  ];
  return (
    <Section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0f1a]">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-[#06B6D4] text-sm font-medium tracking-wider uppercase">The Solution</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            From Chaos to <span className="bg-gradient-to-r from-[#3B82F6] to-[#06B6D4] bg-clip-text text-transparent">Intelligence</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Our AI pipeline transforms scattered industrial data into actionable operational intelligence in real time.</p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-[#3B82F6]/30 via-[#06B6D4]/30 to-[#10B981]/30 -translate-y-1/2" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <motion.div key={i} variants={scaleIn} custom={i} className="relative group">
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#111827] border border-gray-800 flex items-center justify-center mb-3 group-hover:border-[color:var(--c)] transition-colors relative z-10"
                      style={{ "--c": stage.color } as React.CSSProperties}
                      whileHover={{ scale: 1.1, y: -4 }}
                    >
                      <Icon size={28} style={{ color: stage.color }} />
                    </motion.div>
                    <span className="text-xs sm:text-sm text-gray-300 font-medium">{stage.label}</span>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="hidden lg:block absolute top-10 -right-3 text-[#3B82F6]/30"><ChevronRight size={16} /></div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        <motion.div variants={fadeUp} className="mt-12 flex justify-center">
          <div className="relative h-2 w-full max-w-3xl rounded-full bg-[#111827] overflow-hidden border border-gray-800">
            <motion.div
              className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#3B82F6] via-[#06B6D4] to-[#8B5CF6] rounded-full"
              animate={{ x: ["0%", "200%", "0%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function FeaturesSection() {
  const features = [
    { icon: FileText, title: "Document Intelligence", desc: "AI-powered OCR, parsing, and classification of industrial documents with automatic knowledge extraction." },
    { icon: GitBranch, title: "Knowledge Graph", desc: "Connected entity relationships across assets, maintenance, and operations for contextual understanding." },
    { icon: Brain, title: "AI Copilot", desc: "Natural language interface for querying industrial knowledge, generating reports, and getting recommendations." },
    { icon: Wrench, title: "Predictive Maintenance", desc: "ML-driven failure prediction with actionable maintenance scheduling and spare parts optimization." },
    { icon: Shield, title: "Compliance Intelligence", desc: "Automated safety compliance monitoring, audit trail generation, and regulatory reporting." },
    { icon: Search, title: "Root Cause Analysis", desc: "AI-assisted failure investigation with knowledge graph traversal and historical pattern matching." },
    { icon: Wifi, title: "IoT Monitoring", desc: "Real-time sensor data integration with anomaly detection and intelligent alarm management." },
    { icon: BarChart3, title: "Analytics Dashboard", desc: "Executive-level operational analytics with customizable dashboards and automated insights." },
  ];
  return (
    <Section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8" id="features">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-[#8B5CF6] text-sm font-medium tracking-wider uppercase">Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Built for <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">Industrial Operations</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Every module is purpose-built for manufacturing, energy, and infrastructure enterprises.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={i} variants={scaleIn} custom={i} whileHover={{ y: -6, scale: 1.02 }}
                className="group relative p-6 rounded-2xl bg-[#111827]/60 border border-gray-800 hover:border-[#3B82F6]/30 backdrop-blur-sm transition-all cursor-default overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mb-4 group-hover:bg-[#3B82F6]/15 transition-colors">
                    <Icon size={22} className="text-[#3B82F6]" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{feature.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

function StatsSection() {
  const stats = [
    { value: 35, suffix: "%", label: "Faster Knowledge Retrieval", icon: TrendingUp },
    { value: 60, suffix: "%", label: "Reduction in Unplanned Downtime", icon: Wrench },
    { value: 99, suffix: ".9%", label: "Enterprise Security Uptime", icon: Lock },
    { value: 10, suffix: "x", label: "Faster Root Cause Analysis", icon: Search },
  ];
  return (
    <Section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#0a0f1a]" id="why">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-[#10B981] text-sm font-medium tracking-wider uppercase">Why MechaMind</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">
            Proven <span className="bg-gradient-to-r from-[#10B981] to-[#3B82F6] bg-clip-text text-transparent">Industrial Impact</span>
          </h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            const counter = useCounter(stat.value, 2000);
            return (
              <motion.div key={i} variants={scaleIn} custom={i}
                className="text-center p-6 rounded-2xl bg-[#111827]/40 border border-gray-800 hover:border-[#3B82F6]/20 transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center mx-auto mb-4">
                  <Icon size={24} className="text-[#3B82F6]" />
                </div>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  <span ref={counter.ref}>{counter.count}</span>{stat.suffix}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
        <motion.div variants={fadeUp} className="mt-12 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 sm:px-8 py-4 rounded-2xl bg-[#111827]/60 border border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-[#10B981]" /> SOC 2 Compliant</div>
            <div className="w-px h-4 bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-[#10B981]" /> GDPR Ready</div>
            <div className="w-px h-4 bg-gray-700 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm text-gray-300"><CheckCircle2 size={16} className="text-[#10B981]" /> On-Premise Deploy</div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

function ArchitectureSection() {
  const layers = [
    { icon: FileText, label: "Documents & Data Sources", color: "#3B82F6", desc: "PDFs, SOPs, IoT, CMMS, ERP" },
    { icon: Eye, label: "OCR & Pre-processing", color: "#06B6D4", desc: "Text extraction, classification" },
    { icon: GitBranch, label: "Knowledge Graph", color: "#8B5CF6", desc: "Entity linking, relationships" },
    { icon: Database, label: "Vector Search (RAG)", color: "#3B82F6", desc: "Semantic embeddings, retrieval" },
    { icon: Brain, label: "Large Language Model", color: "#06B6D4", desc: "Context-aware reasoning" },
    { icon: Zap, label: "Recommendations", color: "#10B981", desc: "Actionable insights, alerts" },
    { icon: BarChart3, label: "Operational Intelligence", color: "#3B82F6", desc: "Dashboards, reports, actions" },
  ];
  return (
    <Section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8" id="architecture">
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="text-[#06B6D4] text-sm font-medium tracking-wider uppercase">Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">System Architecture</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">A complete end-to-end pipeline from raw industrial data to operational intelligence.</p>
        </motion.div>
        <div className="relative">
          <div className="absolute left-8 sm:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-[#3B82F6]/40 via-[#8B5CF6]/30 to-[#10B981]/40" />
          <div className="space-y-4">
            {layers.map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div key={i} variants={slideFromLeft} custom={i} className="relative flex items-center gap-4 sm:gap-6 pl-18 sm:pl-24">
                  <div className="absolute left-5 sm:left-9 w-7 h-7 rounded-full flex items-center justify-center border bg-[#111827]" style={{ borderColor: `${layer.color}40` }}>
                    <Icon size={14} style={{ color: layer.color }} />
                  </div>
                  <div className="flex-1 px-5 py-4 rounded-xl bg-[#111827]/50 border border-gray-800 hover:border-[color:var(--c)] transition-colors group" style={{ "--c": `${layer.color}50` } as React.CSSProperties}>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm sm:text-base text-white font-medium">{layer.label}</span>
                        <span className="block text-xs text-gray-500 mt-0.5">{layer.desc}</span>
                      </div>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${layer.color}15` }}>
                        <Icon size={16} style={{ color: layer.color }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0B1220]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={20} className="text-[#3B82F6]" />
              <span className="text-white font-bold">MechaMind OS 2.0</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">AI-powered Industrial Knowledge Intelligence Platform for manufacturing, energy, and infrastructure enterprises.</p>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
            <div className="space-y-2">
              <a href="#features" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Features</a>
              <a href="#architecture" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Architecture</a>
              <a href="#why" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Why MechaMind</a>
              <span className="block text-sm text-gray-600">Version 2.0.0</span>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Documentation</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">GitHub</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">API Reference</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Changelog</a>
            </div>
          </div>
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Company</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">About</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Contact</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Privacy</a>
              <a href="#" className="block text-sm text-gray-500 hover:text-gray-300 transition-colors">Terms</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">&copy; 2026 MechaMind OS. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built for Industrial Operations</p>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B1220] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <StatsSection />
      <ArchitectureSection />
      <Footer />
    </div>
  );
}

export default LandingPage;
