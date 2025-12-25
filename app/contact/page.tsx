"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactPage() {
  // ================== THEME LOGIC ===================
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
    inputBg: isDark ? "bg-black border-gray-700 focus:border-orange-500" : "bg-white border-gray-300 focus:border-orange-600",
    navBg: isDark ? "bg-black/80" : "bg-white/80",
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
            <a href="/refunds" className={`hover:${theme.text} transition`}>Refund Policy</a>
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
             <a href="/refunds" className="block py-2">Refund Policy</a>
           </div>
        )}
      </header>

      {/* ================= CONTENT ================= */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <p className="text-orange-500 tracking-[6px] text-sm uppercase font-bold">Support</p>
            <h1 className="text-4xl md:text-6xl font-extrabold mt-2">Get in Touch</h1>
            <p className={`mt-4 ${theme.textSub} max-w-xl mx-auto`}>
              Questions about challenges? Technical issues? 
              We are here to help you stay on track.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-start">
            
            {/* LEFT: DIRECT CONTACT INFO */}
            <div className="space-y-6">
              
              {/* EMAIL CARD */}
              <div className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg} hover:border-orange-500/50 transition duration-300`}>
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center text-2xl mb-4">
                  ✉️
                </div>
                <h3 className="text-xl font-bold">Email Support</h3>
                <p className={`mt-2 ${theme.textSub} text-sm`}>
                  For queries regarding subscriptions, technical bugs, or business partnerships.
                </p>
                <a href="mailto:founder@fytlyf.in" className="block mt-4 text-orange-500 font-bold text-lg hover:underline">
                  founder@fytlyf.in
                </a>
              </div>

              {/* INSTAGRAM CARD */}
              <div className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg} hover:border-pink-500/50 transition duration-300`}>
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center text-2xl mb-4">
                  📸
                </div>
                <h3 className="text-xl font-bold">Instagram Community</h3>
                <p className={`mt-2 ${theme.textSub} text-sm`}>
                  Follow for updates, daily motivation, and challenge announcements. DM us for quick queries.
                </p>
                <a 
                  href="https://www.instagram.com/_fyt_lyf?igsh=Nm1vY2VhZDYzMzJ0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
                >
                  Follow @_fyt_lyf
                </a>
              </div>

            </div>

            {/* RIGHT: CONTACT FORM */}
            <div className={`p-8 rounded-3xl border ${theme.border} ${theme.cardBg}`}>
              <h3 className="text-2xl font-bold mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Your Name" 
                    className={`w-full p-4 rounded-xl outline-none transition ${theme.inputBg}`} 
                  />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Your Email" 
                    className={`w-full p-4 rounded-xl outline-none transition ${theme.inputBg}`} 
                  />
                </div>
                
                {/* ✅ FIXED: ADDED ID, NAME, HTMLFOR & ARIA-LABEL FOR ACCESSIBILITY */}
                <div>
                  <label htmlFor="subject" className="sr-only">Subject</label>
                  <select 
                    id="subject" 
                    name="subject" 
                    aria-label="Select Subject"
                    className={`w-full p-4 rounded-xl outline-none transition ${theme.inputBg}`}
                  >
                    <option>General Inquiry</option>
                    <option>Technical Issue</option>
                    <option>Refund Request</option>
                    <option>Collaboration</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="How can we help you?" 
                    className={`w-full p-4 rounded-xl outline-none transition ${theme.inputBg}`}
                  ></textarea>
                </div>
                <button className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition shadow-lg shadow-orange-500/20">
                  Send Message
                </button>
              </form>
            </div>

          </div>

        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className={`py-10 border-t ${theme.border} text-center`}>
        <h3 className="text-xl font-extrabold font-potta"><span className="text-orange-500">FYT</span> LYF</h3>
        <p className={`text-sm mt-4 ${theme.textSub}`}>India • 2026</p>
      </footer>

    </main>
  );
}