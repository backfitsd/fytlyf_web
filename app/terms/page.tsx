export default function TermsPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">

      <div className="max-w-5xl mx-auto">

        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-10 shadow-xl backdrop-blur">

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Terms & Disclaimer
          </h1>

          <p className="text-orange-500 mt-2 tracking-wide">
            FYT LYF • India • Last Updated: 1 January 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-300 leading-relaxed text-lg">

            <p>
              By using FYT LYF or submitting your pre-registration details,
              you agree to these terms.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Pre-Launch Status
            </h2>
            <p>
              FYT LYF is currently in pre-registration phase.
              Features may evolve before official launch.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Eligibility
            </h2>
            <p>Users must be 13+ and based in India.</p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Health Disclaimer
            </h2>
            <p>
              FYT LYF does not provide medical advice.
              Consult a doctor before engaging in fitness activity.
              Participation is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Data Consent
            </h2>
            <p>
              By submitting your details, you consent to FYT LYF contacting you 
              for updates & launch notifications.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Contact
            </h2>
            <p className="text-white font-bold">
              founder@fytlyf.in
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
