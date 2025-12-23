"use client"; // This handles the animations & state
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { GA_EVENT } from "@/lib/ga";
import { motion } from "framer-motion";

// ⭐ STEP 1 — CONSTANTS
const planLabels: any = {
  free: "Free",
  pro: "Pro",
  pro_plus: "Pro+",
  elite: "Elite",
  not_decided: "Not Decided Yet",
};

const planColors: any = {
  free: "text-gray-300",
  pro: "text-blue-400",
  pro_plus: "text-orange-400",
  elite: "text-yellow-400",
  not_decided: "text-green-400",
};

const motivationMessages: any = {
  free: "Great start! Discipline begins with your first step.",
  pro: "Athlete mode activated. Stay consistent.",
  pro_plus: "Dominator mindset. You’re built different.",
  elite: "Elite circle. Only discipline survives here.",
  not_decided: "No pressure. Just don’t stop. We’ll help you choose.",
};

// ✅ INTERNAL REVEAL COMPONENT
const Reveal = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export default function HomeClient() { 

  // ================== 1. THEME LOGIC (LIGHT / DARK) ===================
  // ✅ THEME PERSISTENCE
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return true;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // Dynamic Theme Classes
  const theme = {
    bg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-white" : "text-gray-900",
    textSub: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white/10" : "border-black/10",
    cardBg: isDark ? "bg-zinc-900/40 border-gray-700" : "bg-gray-100 border-gray-200",
    cardHover: isDark ? "hover:bg-zinc-900/70" : "hover:bg-gray-200",
    navBg: isDark ? "bg-black/60" : "bg-white/80",
    heroGradient: isDark ? "from-zinc-900/40 via-black to-black" : "from-gray-200/40 via-white to-white",
    inputBg: isDark ? "bg-black border-gray-700 focus:border-orange-500" : "bg-white border-gray-300 focus:border-orange-600",
    stickyBar: isDark ? "bg-orange-600 text-black" : "bg-orange-500 text-white",
    alertBg: isDark ? "bg-red-900/40 border-red-600" : "bg-red-50 border-red-200",
    alertText: isDark ? "text-red-400" : "text-red-600",
    alertShadow: isDark ? "shadow-red-600/40" : "shadow-red-200",
  };

  // ================== 2. PRICING STATE ===================
  const [proPlan, setProPlan] = useState(1);
  const [plusPlan, setPlusPlan] = useState(1);
  const [elitePlan, setElitePlan] = useState(3);

  const proPrices: any = {
    1: { current: 699, original: 999 },
    3: { current: 1599, original: 2499 },
    6: { current: 2999, original: 4499 },
  };

  const plusPrices: any = {
    1: { current: 999, original: 1499 },
    3: { current: 2499, original: 3999 },
    6: { current: 4499, original: 6999 },
  };

  const elitePrices: any = {
    3: { current: 9999, original: 14999 },
    6: { current: 14999, original: 24999 },
  };

  // ================== 3. COUNTDOWN LOGIC ===================
  const [timeLeft, setTimeLeft] = useState({
    days: "00", hours: "00", mins: "00", secs: "00",
  });

  useEffect(() => {
    const targetDate = new Date("2025-12-31T23:59:59").getTime();

    const calculate = () => {
      const now = Date.now();
      const diff = targetDate - now;
      if (diff <= 0) return { days: "00", hours: "00", mins: "00", secs: "00" };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)).toString().padStart(2, "0"),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, "0"),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, "0"),
        secs: Math.floor((diff % 60000) / 1000).toString().padStart(2, "0"),
      };
    };

    setTimeLeft(calculate());
    const timer = setInterval(() => setTimeLeft(calculate()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ================== 4. REVEAL ANIMATION ===================
  useEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("active")),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ================== 5. UI HELPERS ===================
  const scrollTo = (id: string) => {
    const x = document.getElementById(id);
    if (x) {
      x.scrollIntoView({ behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  
  // ⭐ STEP 2 — NEW STATES FOR USER & SUCCESS
  const [savedUser, setSavedUser] = useState<any>(null);
  const [successData, setSuccessData] = useState<any>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ⭐ STEP 3 — LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    if (typeof window === "undefined") return;
    const data = localStorage.getItem("fyt_registration");
    if (data) setSavedUser(JSON.parse(data));
  }, []);

  return (
    <main className={`${theme.bg} ${theme.text} min-h-screen font-sans transition-colors duration-300 overflow-x-hidden`}>
      
      {/* GOOGLE ANALYTICS SCRIPTS */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
          `,
        }}
      />

      {/* GLOBAL STYLES & FONTS */}
      <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Potta+One&display=swap');
          html { scroll-behavior: smooth; }
          .font-potta { font-family: 'Potta One', cursive; }
          .reveal { opacity:0; transform:translateY(40px); transition:all .8s ease-out; }
          .reveal.active { opacity:1; transform:translateY(0); }
          .glow { box-shadow:0 0 25px rgba(255,98,0,.3); }
          /* Gentle Float for Phone */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float { animation: float 6s ease-in-out infinite; }
          /* Screen Reader Only Class for Accessibility */
          .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0; }
          
          /* ✅ MICRO FEAR ANIMATION */
          @keyframes alertPulse {
            0% { box-shadow: 0 0 10px rgba(255,0,0,.4); }
            50% { box-shadow: 0 0 35px rgba(255,0,0,.7); }
            100% { box-shadow: 0 0 10px rgba(255,0,0,.4); }
          }
          .alert-glow {
            animation: alertPulse 2s infinite ease-in-out;
          }

          /* ✅ EXTRA MICRO POLISH FOR MOBILE AVATARS */
          @media (max-width: 768px){
            .hero-avatars img { 
              transform: translateY(5px);
            }
          }
        `}}
      />

      {/* ================= NAVBAR ================= */}
      <header className={`fixed top-0 left-0 w-full z-50 ${theme.navBg} backdrop-blur border-b ${theme.border} transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          
          {/* LOGO AREA */}
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo" className="w-18 h-10 object-contain" />
            <h1 className="text-xl tracking-wider font-potta">
              <span className="text-orange-500">FYT</span> LYF
            </h1>
          </div>

          <nav className={`hidden md:flex gap-8 text-sm ${theme.textSub}`}>
            <button onClick={() => scrollTo("arena")} className={`hover:${theme.text} transition`}>Arena</button>
            <button onClick={() => scrollTo("pricing")} className={`hover:${theme.text} transition`}>Membership</button>
            <button onClick={() => scrollTo("register")} className={`hover:${theme.text} transition`}>Register</button>
            <button onClick={() => scrollTo("about")} className={`hover:${theme.text} transition`}>About</button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className={`p-2 rounded-full border ${theme.border} hover:bg-orange-500/20 transition`}
              title="Toggle Theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <button onClick={() => scrollTo("register")} className="hidden md:block bg-orange-600 text-white px-5 py-2 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg glow">
              Join Now
            </button>

            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden border ${theme.border} px-3 py-2 rounded-xl`}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`md:hidden ${isDark ? "bg-black/95" : "bg-white/95"} border-b ${theme.border} text-center py-6 space-y-4 absolute w-full top-full left-0 shadow-2xl`}>
            <button onClick={() => scrollTo("arena")} className="block w-full py-2">Arena</button>
            <button onClick={() => scrollTo("pricing")} className="block w-full py-2">Membership</button>
            <button onClick={() => scrollTo("register")} className="block w-full py-2">Register</button>
          </div>
        )}
      </header>

      {/* ================= TOAST ================= */}
      {toast && (
        <div className="fixed top-24 right-6 bg-orange-600 text-white px-6 py-3 rounded-xl shadow-2xl z-[60] animate-bounce">
          {toast}
        </div>
      )}

      {/* ================= HERO SECTION ================= */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden reveal pt-20 md:pt-0">
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.heroGradient}`}></div>
        
        {/* BACKGROUND GLOW */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 6,
            repeat: Infinity
          }}
          className="absolute -top-20 left-1/4 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none"
        ></motion.div>
        
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 items-center relative z-10 w-full">
          <div className="text-left space-y-5 order-2 md:order-1">
            <Reveal>
              <p className={`tracking-[6px] text-xs font-bold ${theme.textSub} uppercase font-potta`}>
                FYT LYF
              </p>
            </Reveal>
            <Reveal>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                NOT JUST FITNESS. <br />
                <span className="text-orange-500">A DISCIPLINE MOVEMENT.</span>
              </h1>
            </Reveal>
            <Reveal>
              <p className={`text-base md:text-lg max-w-md ${theme.textSub} leading-relaxed`}>
                India’s Most Hardcore, Community Driven, Discipline Based Fitness Revolution.
              </p>
            </Reveal>
            <Reveal>
              <p className="text-orange-500 text-sm font-semibold tracking-wide">
                Challenges Open • Launching Jan 1, 2026
              </p>
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap gap-4 pt-2">
                <button 
                  onClick={() => scrollTo("arena")} 
                  className="bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-600/20 transform hover:-translate-y-1"
                >
                  Enter The Arena
                </button>
                <button 
                  onClick={() => scrollTo("pricing")} 
                  className={`border ${theme.border} px-6 py-3 rounded-xl font-bold hover:bg-zinc-800 hover:text-white transition transform hover:-translate-y-1`}
                >
                  Become A Member
                </button>
              </div>
            </Reveal>
          </div>

          {/* ✅ FIXED LAYOUT: SIDE-BY-SIDE NO OVERLAP */}
          <div className="
            hero-avatars
            flex 
            flex-row /* ALWAYS ROW */
            items-end 
            justify-center 
            w-full
            gap-2 md:gap-10 /* GAP ENSURES SEPARATION */
            mt-10 md:mt-0
            order-1 md:order-2
          ">

            {/* Female - Sized to fit Mobile without hiding */}
            <img 
              src="/avatars/female.png"
              alt="Female Avatar"
              className="
                h-[200px] 
                md:h-[420px] 
                object-contain
                drop-shadow-[0_0_35px_rgba(255,98,0,.3)]
                relative z-10
              "
            />

            {/* PHONE - PREMIUM LOOK + PREMIUM CARD */}
            <div className="relative z-10">
              <div className="
                relative 
                w-[160px] md:w-[320px] 
                h-[320px] md:h-[620px] 
                bg-black 
                border-[6px] md:border-[8px] border-[#1a1a1a] /* PREMIUM DARK BORDER */
                rounded-[2.5rem] md:rounded-[3rem] 
                shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5)] /* DEEP SHADOW */
                overflow-hidden 
                ring-1 ring-gray-700 /* METALLIC RING */
                animate-float
              ">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 md:w-32 h-5 md:h-7 bg-black rounded-b-2xl z-30 shadow-md"></div>
                  
                  {/* PHONE SCREEN CONTENT */}
                  <div className="w-full h-full bg-zinc-50 flex flex-col items-center justify-center p-4 md:p-6 text-center relative overflow-hidden">
                    
                    {/* Glass Reflection Effect */}
                    <div className="absolute -top-40 -right-20 w-[150%] h-[150%] bg-gradient-to-b from-white/10 to-transparent rotate-12 pointer-events-none z-10"></div>

                    {/* ❌ REMOVED DIGITAL ID CARD FROM HERE AS REQUESTED */}

                    <img src="/logo.png" alt="Logo" className="w-32 md:w-45 h-16 md:h-25 object-contain mb-3 md:mb-4 animate-pulse relative z-0" />
                    <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-3 md:mb-5 font-potta relative z-0">
                      <span className="text-orange-500">FYT</span> LYF
                    </h2>
                    <div className="w-8 md:w-10 h-1 bg-orange-500 rounded-full mb-4 md:mb-8 relative z-0"></div>
                    <div className="space-y-0 relative z-0">
                      <h3 className="text-[10px] md:text-xs font-bold text-gray-800 leading-tight">
                        FEEL YOUR TRANSFORMATION<br />
                      </h3>
                      <h3 className="text-[10px] md:text-xs font-bold text-orange-500 leading-tight">
                        LOVE YOUR FITNESS<br />
                      </h3>
                    </div>
                  </div>
              </div>
            </div>

            {/* Male - Sized to fit Mobile without hiding */}
            <img 
              src="/avatars/male.png"
              alt="Male Avatar"
              className="
                h-[210px] 
                md:h-[430px] 
                object-contain
                drop-shadow-[0_0_35px_rgba(255,98,0,.3)]
                relative z-10
              "
            />

          </div>

        </div>
      </section>

      {/* ================= ARENA ================= */}
      <section id="arena" className={`py-24 px-6 reveal ${isDark ? "bg-black" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-orange-500 tracking-[6px] text-sm">THE ARENA</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold mt-3">Choose Your War</h3>
          <p className={`mt-4 max-w-3xl mx-auto ${theme.textSub}`}>Two paths. One goal — Discipline. Choose how you want to rise.</p>

          {/* ✅ FIXED BANNER FOR LIGHT MODE */}
          <div className={`mt-6 inline-flex items-center gap-3 border px-5 py-2 rounded-xl shadow-lg alert-glow ${theme.alertBg}`}>
            <span className="text-red-500 text-lg">🔥</span>
            <p className={`font-semibold tracking-wide uppercase ${theme.alertText}`}>
              Seats Filling Fast — Limited Joining Window
            </p>
          </div>

          <div className="mt-14 grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-10 transition shadow-xl shadow-orange-500/5 ${theme.cardBg} ${theme.cardHover}`}
            >
              <p className="text-orange-500 font-semibold">TRANSFORMATION ARENA</p>
              <h4 className="text-3xl font-bold mt-3">75 HARD Challenge</h4>
              <p className={`mt-4 ${theme.textSub}`}>75 Days. No excuses. Proof-based transformation.</p>
              
              {/* ✅ FIXED SCARCITY WARNING FOR LIGHT MODE */}
              <div className={`mt-6 w-full border px-4 py-2 rounded-lg text-center shadow-md ${theme.alertBg} ${theme.alertShadow}`}>
                <span className={`font-bold tracking-wider uppercase text-sm ${theme.alertText}`}>
                  🚨 High Demand — Spots Closing Soon
                </span>
              </div>
              
              <button onClick={() => scrollTo("register")} className="mt-8 bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg glow">Join Transformation</button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 80, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={`border rounded-3xl p-10 transition shadow-xl shadow-orange-500/5 ${theme.cardBg} ${theme.cardHover}`}
            >
              <p className="text-orange-500 font-semibold">PERFORMANCE ARENA</p>
              <h4 className="text-3xl font-bold mt-3">Performance Battles</h4>
              <p className={`mt-4 ${theme.textSub}`}>Compete. Push limits. Earn respect.</p>
              
              {/* ✅ FIXED SCARCITY WARNING FOR LIGHT MODE */}
              <div className={`mt-6 w-full border px-4 py-2 rounded-lg text-center shadow-md ${theme.alertBg} ${theme.alertShadow}`}>
                <span className={`font-bold tracking-wider uppercase text-sm ${theme.alertText}`}>
                  🚨 High Demand — Spots Closing Soon
                </span>
              </div>

              <button onClick={() => scrollTo("register")} className={`mt-8 border ${theme.border} px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition`}>Enter Performance Battles</button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ⭐ TRUST & FAIR PLAY */}
      <section className={`py-24 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-orange-500 tracking-[6px] text-sm">TRUST & FAIR PLAY</p>
          <h2 className="text-4xl md:text-6xl font-extrabold mt-3">
            Strict. Fair. Fully Verified.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mt-14">
            <div className={`rounded-3xl p-8 border ${theme.border}`}>
              <h3 className="text-xl font-bold">Strict Verification</h3>
              <p className={`mt-2 text-sm ${theme.textSub}`}>Every winner is verified. No shortcuts. No cheating.</p>
            </div>
            <div className={`rounded-3xl p-8 border border-orange-500`}>
              <h3 className="text-xl font-bold">India Only</h3>
              <p className={`mt-2 text-sm ${theme.textSub}`}>Rewards shipped only within India. Valid winners only.</p>
            </div>
            <div className={`rounded-3xl p-8 border border-yellow-500`}>
              <h3 className="text-xl font-bold">Fair Shipping</h3>
              <p className={`mt-2 text-sm ${theme.textSub}`}>Same reward process for Free & Paid users.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY ================= */}
      <section id="why" className={`py-24 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-orange-500 tracking-[6px] text-sm">WHY FYT LYF</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold mt-3">Built Different.</h3>
          <div className="mt-14 grid md:grid-cols-3 gap-8">
            <div className={`border rounded-3xl p-8 transition shadow-xl ${theme.cardBg} ${theme.cardHover}`}><h4 className="text-2xl font-bold text-orange-500">Discipline First</h4><p className={`mt-3 ${theme.textSub}`}>No motivation nonsense. Just results.</p></div>
            <div className={`border rounded-3xl p-8 transition shadow-xl ${theme.cardBg} ${theme.cardHover}`}><h4 className="text-2xl font-bold text-orange-500">Hardcore Community</h4><p className={`mt-3 ${theme.textSub}`}>Train with people who refuse to quit.</p></div>
            <div className={`border rounded-3xl p-8 transition shadow-xl ${theme.cardBg} ${theme.cardHover}`}><h4 className="text-2xl font-bold text-orange-500">Proof. Not Talk.</h4><p className={`mt-3 ${theme.textSub}`}>Verified results. Earned recognition.</p></div>
          </div>
        </div>
      </section>

      {/* ================= COUNTDOWN ================= */}
      <section className={`py-24 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-orange-500 tracking-[6px] text-sm">LIMITED WINDOW</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold mt-3">Registrations Close Soon</h3>
          <div className="mt-12 grid grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className={`border rounded-2xl py-6 ${theme.cardBg}`}><p className="text-5xl font-extrabold text-orange-500">{timeLeft.days}</p><p className={`text-sm tracking-widest mt-2 ${theme.textSub}`}>DAYS</p></div>
            <div className={`border rounded-2xl py-6 ${theme.cardBg}`}><p className="text-5xl font-extrabold text-orange-500">{timeLeft.hours}</p><p className={`text-sm tracking-widest mt-2 ${theme.textSub}`}>HRS</p></div>
            <div className={`border rounded-2xl py-6 ${theme.cardBg}`}><p className="text-5xl font-extrabold text-orange-500">{timeLeft.mins}</p><p className={`text-sm tracking-widest mt-2 ${theme.textSub}`}>MINS</p></div>
            <div className={`border rounded-2xl py-6 ${theme.cardBg}`}><p className="text-5xl font-extrabold text-orange-500">{timeLeft.secs}</p><p className={`text-sm tracking-widest mt-2 ${theme.textSub}`}>SECS</p></div>
          </div>
          <button onClick={() => scrollTo("register")} className="mt-10 bg-orange-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg glow">Pre Register Now</button>
        </div>
      </section>

      {/* ================= PRICING (DYNAMIC) ================= */}
      <section id="pricing" className={`py-28 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-7xl mx-auto text-center">

          <div className="inline-block mb-4 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest animate-pulse shadow-lg shadow-red-500/30">
             Limited Time Launch Pricing — Ends 31 Dec 2025
          </div>

          <h2 className="text-orange-500 tracking-[6px] text-sm">MEMBERSHIP</h2>
          <p className="text-xl font-bold mt-2 text-gray-400">India’s Most Hardcore Fitness Membership</p>
          <h3 className="text-4xl md:text-6xl font-extrabold mt-3">Choose Your Power Level</h3>

          <p className={`mt-4 max-w-3xl mx-auto ${theme.textSub}`}>Free to begin. Upgrade when you’re ready to dominate.</p>
          <p className="mt-2 text-xs text-gray-400">
            Inclusive of all taxes • Founder Pricing Ends 31 Dec 2025 • Prices revert to normal after launch
          </p>

          <div className="mt-16 grid md:grid-cols-4 gap-8">

            {/* FREE */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className={`border rounded-3xl transition p-8 shadow-xl text-left flex flex-col justify-between h-[680px] ${theme.cardBg} ${theme.cardHover}`}
            >
              <div>
                <p className={`${theme.textSub} font-semibold`}>FREE</p>
                <div className="inline-block mt-2 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Badge: Beginner Access</div>
                
                <h4 className="text-5xl font-extrabold mt-4">₹0</h4>
                <ul className={`text-sm mt-6 space-y-3 ${theme.textSub}`}>
                  <li>✅ Dashboard Access</li>
                  <li>✅ Basic Tracking</li>
                  <li>✅ Some Workouts</li>
                  <li className="opacity-40 flex items-center gap-2">🔒 Premium Programs</li>
                  <li className="opacity-40 flex items-center gap-2">🔒 Ad Free</li>
                  <li className="opacity-40 flex items-center gap-2">🔒 AI Personalization</li>
                </ul>
              </div>
              <button onClick={() => scrollTo("register")} className={`mt-8 w-full border ${theme.border} px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition`}>Get Started</button>
            </motion.div>

            {/* PRO */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
              className={`border border-blue-600 rounded-3xl transition p-8 shadow-xl text-left flex flex-col justify-between h-[680px] ${theme.cardBg} ${theme.cardHover}`}
            >
              <div>
                <p className="text-blue-500 font-semibold">PRO</p>
                <div className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Badge: Athlete Mode</div>

                <div className="mt-3 flex gap-2">
                  {[1, 3, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => setProPlan(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        proPlan === m ? "bg-blue-600 border-blue-400 text-white" : `${theme.border} ${theme.textSub}`
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>

                <p className="text-sm line-through text-blue-300/60 mt-3">₹{proPrices[proPlan].original}</p>
                <h4 className="text-5xl font-extrabold">₹{proPrices[proPlan].current}</h4>
                <ul className={`text-sm mt-6 space-y-3 ${theme.textSub}`}>
                  <li>✅ Premium Workout Programs</li>
                  <li>✅ Advanced Tracking</li>
                  <li>✅ Ad Free</li>
                  <li className="opacity-40 flex items-center gap-2">🔒 Personalized AI Plans</li>
                  <li className="opacity-40 flex items-center gap-2">🔒 Deep Analytics</li>
                </ul>
              </div>
              <button onClick={() => scrollTo("register")} className="mt-8 w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">Choose Pro</button>
            </motion.div>

            {/* PRO PLUS */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`border-2 border-orange-600 rounded-3xl transition p-8 shadow-2xl shadow-orange-600/20 text-left relative flex flex-col justify-between h-[680px] ${theme.cardBg} ${theme.cardHover}`}
            >
              <span className="absolute -top-4 right-6 bg-orange-600 text-white px-4 py-1 text-xs font-bold rounded-xl flex items-center gap-2">👑 MOST POPULAR</span>
              <div>
                <p className="text-orange-500 font-semibold flex items-center gap-2">PRO PLUS 👑</p>
                <div className="inline-block mt-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg shadow-orange-500/40">Badge: Dominator Mode</div>

                <div className="mt-3 flex gap-2">
                  {[1, 3, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPlusPlan(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        plusPlan === m ? "bg-orange-600 border-orange-400 text-white" : `${theme.border} ${theme.textSub}`
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>

                <p className="text-sm line-through text-orange-300/60 mt-3">₹{plusPrices[plusPlan].original}</p>
                <h4 className="text-5xl font-extrabold">₹{plusPrices[plusPlan].current}</h4>
                <ul className={`text-sm mt-6 space-y-3 ${theme.textSub}`}>
                  <li>✅ Everything in PRO</li>
                  <li>✅ Personalized AI Plans</li>
                  <li>✅ Deep Analytics</li>
                  <li>✅ Exclusive Challenges</li>
                  <li>✅ Premium Content Vault</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-center text-gray-400 mb-2">No refunds • Renew at end of plan</p>
                <button onClick={() => scrollTo("register")} className="w-full bg-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-500/30 transform hover:-translate-y-1">Become Pro+</button>
              </div>
            </motion.div>

            {/* ELITE */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className={`border border-yellow-600 rounded-3xl transition p-8 shadow-xl text-left flex flex-col justify-between h-[680px] ${theme.cardBg} ${theme.cardHover}`}
            >
              <div>
                <p className="text-yellow-500 font-semibold">ELITE</p>
                <div className="inline-block mt-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Badge: VIP Elite Discipline Circle</div>

                <div className="mt-3 flex gap-2">
                  {[3, 6].map((m) => (
                    <button
                      key={m}
                      onClick={() => setElitePlan(m)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                        elitePlan === m ? "bg-yellow-500 border-yellow-400 text-black" : `${theme.border} ${theme.textSub}`
                      }`}
                    >
                      {m}M
                    </button>
                  ))}
                </div>

                <p className="text-sm line-through text-yellow-300/60 mt-3">₹{elitePrices[elitePlan].original}</p>
                <h4 className="text-5xl font-extrabold">₹{elitePrices[elitePlan].current}</h4>
                <ul className={`text-sm mt-6 space-y-3 ${theme.textSub}`}>
                  <li>✅ AI + Human Hybrid Coaching</li>
                  <li>✅ Human Fitness Review</li>
                  <li>✅ VIP Badges</li>
                  <li>✅ Guaranteed Physical Kit</li>
                  <li>✅ Highest Priority</li>
                </ul>
              </div>
              <div>
                <p className="text-xs text-center text-gray-400 mb-2">No refunds • Renew at end of plan</p>
                <button onClick={() => scrollTo("register")} className={`w-full border-2 ${theme.border} px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition`}>Unlock Elite</button>
              </div>
            </motion.div>

          </div>

          {/* ✅ STEP 5 — WHY WINNERS CHOOSE PRO+ */}
          <div className="mt-16 max-w-4xl mx-auto text-center border-t border-gray-800 pt-10">
             <h4 className="text-xl font-bold text-gray-300 mb-6 uppercase tracking-widest">Why Most Winners Choose PRO+</h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold text-orange-500">
               <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl py-3">Personalized AI Plans</div>
               <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl py-3">Deep Performance Analytics</div>
               <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl py-3">Exclusive Access</div>
               <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl py-3">Premium Identity Status</div>
             </div>
          </div>

        </div>
      </section>

      {/* ⭐ STEP 1 — ADD AVATAR & CHARACTER SYSTEM SECTION */}
      <section id="avatars" className={`py-28 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-7xl mx-auto text-center">

          <p className="text-orange-500 tracking-[6px] text-sm">YOUR IDENTITY</p>
          <h2 className="text-4xl md:text-6xl font-extrabold mt-3 leading-tight">
            Not Just Fitness… <span className="text-orange-500">Your Character. Your Legend.</span>
          </h2>

          <p className={`mt-4 max-w-3xl mx-auto ${theme.textSub}`}>
            FYT LYF brings something no other fitness platform in India does — 
            Your own Avatar Identity System. Train. Transform. Earn your status.
          </p>

          <div className="grid md:grid-cols-4 gap-8 mt-16">

            {/* FREE */}
            <div className={`rounded-3xl p-8 border ${theme.border} ${theme.cardHover}`}>
              <h3 className="text-xl font-bold">Free Users</h3>
              <p className={`mt-3 text-sm ${theme.textSub}`}>
                Basic avatars & workout models unlocked.
              </p>
            </div>

            {/* PRO */}
            <div className={`rounded-3xl p-8 border border-blue-500 ${theme.cardHover}`}>
              <h3 className="text-xl font-bold text-blue-400">PRO</h3>
              <p className={`mt-3 text-sm ${theme.textSub}`}>
                Unlock more premium avatars & identity sets.
              </p>
            </div>

            {/* PRO PLUS */}
            <div className={`rounded-3xl p-8 border border-orange-500 ${theme.cardHover}`}>
              <h3 className="text-xl font-bold text-orange-500">PRO PLUS</h3>
              <p className={`mt-3 text-sm ${theme.textSub}`}>
                Request your <span className="text-orange-500 font-bold">Personal Character Avatar</span>.
                Premium avatar packs unlocked.
              </p>
            </div>

            {/* ELITE */}
            <div className={`rounded-3xl p-8 border border-yellow-500 ${theme.cardHover}`}>
              <h3 className="text-xl font-bold text-yellow-400">ELITE</h3>
              <p className={`mt-3 text-sm ${theme.textSub}`}>
                Personal Character Avatar + 
                <span className="text-yellow-400 font-bold"> Personal Workout Avatar Coach</span>.
                Elite exclusive avatars unlocked.
              </p>
            </div>

          </div>

          <p className={`mt-6 text-sm ${theme.textSub}`}>
            *Avatar request available inside app for subscribed users only.
          </p>

        </div>
      </section>

      {/* ================= REGISTER ================= */}
      <section id="register" className={`py-28 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-orange-500 tracking-[6px] text-sm">PRE REGISTRATION</p>
          <h2 className="text-4xl md:text-6xl font-extrabold mt-3 leading-tight">Be The First To Enter The FYT LYF Revolution</h2>
          
          <div className={`mt-10 rounded-3xl p-10 ${theme.cardBg}`}>
            
            {/* ⭐ STEP 6 — RETURNING USER CARD */}
            {savedUser && (
              <div className={`rounded-3xl p-8 mb-8 border ${theme.border} ${theme.cardBg}`}>
                
                <h2 className="text-2xl font-extrabold">
                  Welcome Back, {savedUser.name}! 🔥
                </h2>

                <p className={`${theme.textSub} mt-2`}>
                  You are already pre-registered.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-sm">
                  <div className={`border ${theme.border} rounded-xl p-4`}>
                    <p className="text-gray-400">Email</p>
                    <p className="font-semibold">{savedUser.email}</p>
                  </div>

                  <div className={`border ${theme.border} rounded-xl p-4`}>
                    <p className="text-gray-400">Phone</p>
                    <p className="font-semibold">{savedUser.phone}</p>
                  </div>

                  <div className={`border ${theme.border} rounded-xl p-4 md:col-span-2`}>
                    <p className="text-gray-400">Plan</p>
                    <p className={`font-bold text-xl ${planColors[savedUser.planPreference]}`}>
                      {planLabels[savedUser.planPreference]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ UPDATED FORM WITH CHECKBOX LOGIC */}
            <form 
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
              
                const name = form.name.value.trim();
                const email = form.email.value.trim();
                const phone = form.phone.value.trim();
                // ⭐ STEP 4 — GET PLAN PREFERENCE
                const planPreference = form.planPreference.value;
                const agree = form.agree.checked; 
              
                const indiaPhoneRegex = /^[6-9]\d{9}$/;
              
                if (!indiaPhoneRegex.test(phone)) {
                  showToast("❌ Enter a valid 10 digit Indian number");
                  return;
                }

                if (!agree) {
                  showToast("⚠️ Please agree to Terms & Privacy Policy");
                  return;
                }
              
                try {
                  // 🔥 REPLACE YOUR FIRESTORE SAVE
                  await addDoc(collection(db, "registrations"), {
                    name,
                    email,
                    phone,
                    planPreference,
                    createdAt: serverTimestamp(),
                    country: "India",
                    status: "pre_registered",
                  });

                  // 🔥 ADD ANALYTICS
                  GA_EVENT("registration_success", {
                    category: "registration",
                    label: "pre_register",
                    value: 1,
                  });

                  GA_EVENT("plan_interest_selected", {
                    category: "registration",
                    label: planPreference,
                    value: 1,
                  });

                  // 🔥 SAVE LOCALLY
                  localStorage.setItem(
                    "fyt_registration",
                    JSON.stringify({ name, email, phone, planPreference })
                  );

                  setSuccessData({ name, plan: planPreference });
                  setSavedUser({ name, email, phone, planPreference });
              
                  showToast(`✅ Welcome ${name}! Registration Successful.`);
                  form.reset();
                } catch (err) {
                  console.error(err);
                  showToast("⚠️ Something went wrong. Try again.");
                }
              }}
              className="grid md:grid-cols-3 gap-6"
            >
              <div>
                <label className="sr-only" htmlFor="name">Full Name</label>
                <input id="name" name="name" required placeholder="Full Name" className={`w-full rounded-xl px-5 py-4 outline-none transition ${theme.inputBg}`} />
              </div>
              
              <div>
                <label className="sr-only" htmlFor="email">Email Address</label>
                <input id="email" name="email" required type="email" placeholder="Email Address" className={`w-full rounded-xl px-5 py-4 outline-none transition ${theme.inputBg}`} />
              </div>
              
              <div>
                <label className="sr-only" htmlFor="phone">Indian Mobile Number</label>
                <input id="phone" name="phone" required placeholder="Indian Mobile Number" className={`w-full rounded-xl px-5 py-4 outline-none transition ${theme.inputBg}`} />
              </div>

              {/* ⭐ STEP 5 — ADD PLAN DROPDOWN IN FORM (FIXED ACCESSIBILITY) */}
              <div className="md:col-span-3">
                <label htmlFor="planPreference" className="sr-only">Select Plan Interest</label>
                <select
                  id="planPreference"
                  name="planPreference"
                  required
                  defaultValue=""
                  className={`w-full rounded-xl px-5 py-4 outline-none transition ${theme.inputBg}`}
                  aria-label="Select Plan Interest"
                >
                  <option value="" disabled>Select Plan Interest</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="pro_plus">Pro+</option>
                  <option value="elite">Elite</option>
                  <option value="not_decided">Not Decided Yet</option>
                </select>
              </div>

              {/* ✅ ADDED CHECKBOX UI */}
              <div className="md:col-span-3 flex items-center gap-3 text-sm justify-center md:justify-start">
                <input type="checkbox" id="agree" name="agree" className="w-5 h-5 accent-orange-600 cursor-pointer" />
                <label htmlFor="agree" className={`${theme.textSub} cursor-pointer`}>
                  I agree to the
                  <a href="/terms" className="text-orange-500 ml-1 hover:underline">Terms & Disclaimer</a>
                  and
                  <a href="/privacy" className="text-orange-500 ml-1 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="md:col-span-3 mt-4 bg-orange-600 text-white hover:bg-orange-700 transition px-10 py-4 rounded-xl font-semibold shadow-lg glow">Pre Register Now</button>
            </form>
            <p className={`text-sm mt-4 ${theme.textSub}`}>* Only valid for users in India • Age 13+ • Medical responsibility on user</p>
            {/* ✅ TRUST CONTACT LINE */}
            <p className={`text-sm mt-2 ${theme.textSub}`}>
              Need help or business enquiries?
              <a 
                href="mailto:founder@fytlyf.in" 
                className="text-orange-500 font-semibold underline hover:text-orange-400 ml-1"
              >
                founder@fytlyf.in
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className={`py-28 px-6 border-t ${theme.border} reveal`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-orange-500 tracking-[6px] text-sm">THE MOVEMENT</p>
            <h2 className="text-4xl md:text-6xl font-extrabold mt-3">Not Just Fitness. <span className="text-orange-500 block">A Discipline Revolution.</span></h2>
            <p className={`mt-6 text-lg ${theme.textSub}`}>FYT LYF was built for the people who refuse to be average. The ones who wake up earlier. Train harder. Push beyond excuses.</p>
          </div>
          <div className="relative">
             <div className={`rounded-3xl p-8 h-[380px] flex items-center justify-center ${theme.cardBg}`}>
                <h3 className="text-3xl font-extrabold text-center">Built For The <span className="text-orange-500 block mt-2">Unstoppable.</span></h3>
             </div>
          </div>
        </div>
      </section>

      {/* ================= REWARDS & APP & FOOTER ================= */}
      
      <section className={`py-24 px-6 border-t ${theme.border}`}>
         <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold">Earn Respect. <span className="text-orange-500">Win Glory.</span></h2>
            <div className="grid md:grid-cols-3 gap-8 mt-16">
               <div className={`rounded-3xl p-8 border ${theme.border} ${theme.cardHover}`}><h3 className="text-2xl font-bold">Digital Rewards</h3><p className={`mt-2 text-sm ${theme.textSub}`}>Official Certificates & Badges</p></div>
               <div className={`rounded-3xl p-8 border border-orange-500 ${theme.cardHover}`}><h3 className="text-2xl font-bold">Physical Rewards</h3><p className={`mt-2 text-sm ${theme.textSub}`}>Medals, T-Shirts & Gear</p></div>
               <div className={`rounded-3xl p-8 border border-yellow-500 ${theme.cardHover}`}><h3 className="text-2xl font-bold">Performance Loot</h3><p className={`mt-2 text-sm ${theme.textSub}`}>Supplements & Goodies</p></div>
            </div>
         </div>
      </section>

      <section className={`py-24 px-6 border-t ${theme.border}`}>
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-orange-500 tracking-[6px] text-sm">THE APP</p>
          <h2 className="text-4xl font-extrabold mt-3">Your Discipline Engine.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className={`rounded-3xl p-8 ${theme.cardBg}`}><h3 className="text-xl font-bold">Smart Dashboard</h3></div>
            <div className={`rounded-3xl p-8 border border-orange-500`}><h3 className="text-xl font-bold">AI Powered</h3></div>
            <div className={`rounded-3xl p-8 border border-yellow-500`}><h3 className="text-xl font-bold">Community</h3></div>
          </div>
        </div>
      </section>

      <footer className={`py-20 px-6 border-t ${theme.border} pb-24 md:pb-20`}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-2xl font-extrabold font-potta"><span className="text-orange-500">FYT</span> LYF</h3>
            <p className={`text-sm mt-4 ${theme.textSub}`}>India • 2026</p>
          </div>
          <div><h4 className="font-bold">Navigation</h4><ul className={`text-sm mt-4 space-y-2 ${theme.textSub}`}><li onClick={()=>scrollTo("arena")} className="cursor-pointer">Challenges</li><li onClick={()=>scrollTo("register")} className="cursor-pointer">Register</li></ul></div>
          
          {/* ✅ NEW LEGAL SECTION */}
          <div>
            <h4 className="font-bold">Legal</h4>
            <ul className={`text-sm mt-4 space-y-2 ${theme.textSub}`}>
              <li><a href="/terms" className="hover:text-orange-500">Terms & Disclaimer</a></li>
              <li><a href="/privacy" className="hover:text-orange-500">Privacy Policy</a></li>
            </ul>
          </div>

          {/* ✅ UPDATED CONNECT SECTION */}
          <div>
            <h4 className="font-bold">Connect</h4>
            <ul className={`text-sm mt-4 space-y-2 ${theme.textSub}`}>
              <li>
                <a 
                  href="https://www.instagram.com/_fyt_lyf?igsh=Nm1vY2VhZDYzMzJ0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a 
                  href="0" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-orange-500 transition"
                >
                  YouTube
                </a>
              </li>
              <li>
                <a 
                  href="mailto:founder@fytlyf.in"
                  className="hover:text-orange-500 transition"
                >
                  founder@fytlyf.in
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* ⭐ STEP 4 — LEGAL & RULE PROTECTION BLOCK */}
        <p className="text-xs mt-6 text-center text-gray-400">
          • India Only • Age 13+ • Participate at your own medical risk • 
          FYT LYF verification & decisions are final • 
          No refund on subscriptions • 
          Rewards applicable only to valid verified winners
        </p>

        <p className={`text-center text-xs mt-10 tracking-[4px] uppercase ${theme.textSub}`}>© 2026 FYT LYF — Built For The Unstoppable</p>
      </footer>

      {/* STICKY BOTTOM BAR */}
      <div className={`fixed bottom-0 left-0 w-full font-bold text-center py-3 z-50 text-sm md:text-base shadow-2xl flex items-center justify-center gap-2 ${theme.stickyBar}`}>
        <span className="hidden md:inline">Registrations Closing Soon — </span>
        <span className="font-mono">{timeLeft.days}D : {timeLeft.hours}H : {timeLeft.mins}M : {timeLeft.secs}S</span>
        
        {/* ✅ CONDITIONAL RENDER BUTTON */}
        <button 
          onClick={() => scrollTo("register")} 
          className={`ml-2 px-4 py-1 rounded-full text-xs font-bold transition flex items-center gap-2
            ${savedUser 
              ? "bg-green-500 text-white hover:bg-green-600 border border-green-400" 
              : (isDark ? "bg-black text-orange-500" : "bg-white text-orange-600")}
          `}
        >
          {savedUser ? (
            <>
              <span>✅</span> Already Registered
            </>
          ) : (
            "Register"
          )}
        </button>
      </div>

      {/* ⭐ STEP 7 — ADD THANK YOU CARD */}
      {successData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[999]">
          <div className={`bg-zinc-900 border ${theme.border} rounded-3xl p-8 max-w-md text-center`}>
            
            <h2 className="text-3xl font-extrabold">
              Thank You, {successData.name}! 🎯
            </h2>

            <p className={`${theme.textSub} text-sm mt-2`}>
              Registration Successful
            </p>

            <p className={`text-2xl font-bold mt-3 ${planColors[successData.plan]}`}>
              {planLabels[successData.plan]}
            </p>

            <p className="mt-5 text-gray-300 text-sm leading-relaxed">
              {motivationMessages[successData.plan]}
            </p>

            <button
              onClick={() => setSuccessData(null)}
              className="mt-8 bg-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-700"
            >
              Continue
            </button>
          </div>
        </div>
      )}

    </main>
  );
}