"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function RefundPage() {
  // ================== THEME LOGIC (MATCHING HOME) ===================
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

  const theme = {
    bg: isDark ? "bg-black" : "bg-white",
    text: isDark ? "text-white" : "text-gray-900",
    textSub: isDark ? "text-gray-400" : "text-gray-600",
    border: isDark ? "border-white/10" : "border-black/10",
    cardBg: isDark ? "bg-zinc-900/40 border-gray-700" : "bg-gray-100 border-gray-200",
    navBg: isDark ? "bg-black/80" : "bg-white/80",
    stickyBar: isDark ? "bg-orange-600 text-black" : "bg-orange-500 text-white",
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className={`${theme.bg} ${theme.text} min-h-screen font-sans transition-colors duration-300`}>
      
      {/* GLOBAL STYLES */}
      <style dangerouslySetInnerHTML={{
          __html: `
          @import url('https://fonts.googleapis.com/css2?family=Potta+One&display=swap');
          .font-potta { font-family: 'Potta One', cursive; }
          body { background-image: radial-gradient(${isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'} 1px, transparent 1px); background-size: 30px 30px; }
        `}}
      />

      {/* ================= NAVBAR ================= */}
      <header className={`fixed top-0 left-0 w-full z-50 ${theme.navBg} backdrop-blur-md border-b ${theme.border}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="FYT LYF Logo" className="w-18 h-10 object-contain" />
            <a href="/" className="text-xl tracking-wider font-potta">
              <span className="text-orange-500">FYT</span> LYF
            </a>
          </div>

          <nav className={`hidden md:flex gap-8 text-sm ${theme.textSub}`}>
            <a href="/" className={`hover:${theme.text} transition`}>Home</a>
            <a href="/contact" className={`hover:${theme.text} transition`}>Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full border ${theme.border} hover:bg-orange-500/20 transition`}>
              {isDark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className={`md:hidden border ${theme.border} px-3 py-2 rounded-xl`}>
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {menuOpen && (
           <div className={`md:hidden ${isDark ? "bg-black/95" : "bg-white/95"} border-b ${theme.border} text-center py-6 space-y-4`}>
             <a href="/" className="block py-2">Home</a>
             <a href="/contact" className="block py-2">Contact</a>
           </div>
        )}
      </header>

      {/* ================= CONTENT ================= */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center mb-16`}
          >
            <p className="text-orange-500 tracking-[6px] text-sm uppercase font-bold">Policy</p>
            <h1 className="text-4xl md:text-6xl font-extrabold mt-2">Cancellation & Refund</h1>
            <p className={`mt-4 ${theme.textSub}`}>Transparent. Fair. Disciplined.</p>
          </motion.div>

          <div className={`space-y-12`}>

            {/* BLOCK 1: SUBSCRIPTIONS */}
            <div className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg}`}>
              <h2 className="text-2xl font-bold text-orange-500 flex items-center gap-3">
                <span className="text-3xl">🚫</span> Subscription & Membership Policy
              </h2>
              <div className={`mt-5 space-y-4 ${theme.textSub} leading-relaxed`}>
                <p>
                  At <strong>FYT LYF</strong>, we prioritize commitment and discipline. When you subscribe to any of our plans (Pro, Pro+, or Elite), you are reserving a spot in our ecosystem, accessing premium intellectual property, and utilizing server resources for analytics and AI generation.
                </p>
                <p className={`${isDark ? "text-gray-200" : "text-gray-800"} font-semibold border-l-4 border-orange-500 pl-4 py-1`}>
                  Therefore, voluntary cancellations or "change of mind" requests are <span className="text-orange-500">NON-REFUNDABLE</span>.
                </p>
                <p>
                  Please review your choice carefully before purchasing. We believe that once you commit to your fitness journey, you should see it through.
                </p>
              </div>
            </div>

            {/* BLOCK 2: TRANSACTION ERRORS (REFUNDABLE) */}
            <div className={`p-8 rounded-3xl border border-green-500/30 bg-green-500/5`}>
              <h2 className="text-2xl font-bold text-green-500 flex items-center gap-3">
                <span className="text-3xl">✅</span> Transaction & Technical Refunds
              </h2>
              <div className={`mt-5 space-y-4 ${theme.textSub} leading-relaxed`}>
                <p>
                  While subscriptions are final, we ensure 100% safety for your money regarding technical errors. <strong>Refunds ARE provided</strong> in the following specific technical cases:
                </p>
                
                <ul className="grid gap-4 mt-4">
                  <li className={`p-4 rounded-xl border ${theme.border} ${isDark ? "bg-black" : "bg-white"}`}>
                    <strong className="block text-orange-500 mb-1">Case 1: Double Deduction</strong>
                    If you were charged twice for the same plan due to a server glitch or payment gateway error, the extra amount will be refunded fully.
                  </li>
                  <li className={`p-4 rounded-xl border ${theme.border} ${isDark ? "bg-black" : "bg-white"}`}>
                    <strong className="block text-orange-500 mb-1">Case 2: Money Deducted, Plan Not Active</strong>
                    If the amount was deducted from your bank account but the subscription failed to activate on your user handle due to a network failure on our end.
                  </li>
                </ul>

                <p className="mt-4 text-sm">
                  *Refunds for valid technical errors are typically processed within <strong>5-7 business days</strong> to the original source of payment.
                </p>
              </div>
            </div>

            {/* BLOCK 3: HOW TO CLAIM */}
            <div className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg}`}>
              <h2 className="text-xl font-bold">How to Request a Technical Refund</h2>
              <p className={`mt-3 ${theme.textSub}`}>
                If you faced a transaction issue mentioned above, please contact us immediately.
              </p>
              
              <div className="mt-6 flex flex-col md:flex-row gap-6">
                <div className={`flex-1 p-4 rounded-xl border ${theme.border} ${isDark ? "bg-black" : "bg-white"}`}>
                  <p className="text-xs uppercase tracking-wider text-gray-500">Email Us</p>
                  <a href="mailto:founder@fytlyf.in" className="text-lg font-bold text-orange-500 hover:underline">founder@fytlyf.in</a>
                  <p className="text-xs mt-2 text-gray-400">Subject: Refund Request - [Your Name]</p>
                </div>
              </div>

              <div className="mt-6 text-sm text-gray-400 bg-orange-500/10 p-4 rounded-xl border border-orange-500/20">
                <strong>Required Details:</strong> Please attach the Transaction ID, Date of Payment, and Registered Email/Phone Number in your email for faster processing.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={`py-10 border-t ${theme.border} text-center`}>
        <h3 className="text-xl font-extrabold font-potta"><span className="text-orange-500">FYT</span> LYF</h3>
        <p className={`text-sm mt-4 ${theme.textSub}`}>Built For The Unstoppable.</p>
        <p className={`text-xs mt-6 text-gray-500`}>© 2026 FYT LYF • All Rights Reserved</p>
      </footer>

    </main>
  );
}