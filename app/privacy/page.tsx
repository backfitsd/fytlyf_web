export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      
      <div className="max-w-5xl mx-auto">
        
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-10 shadow-xl backdrop-blur">
          
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Privacy Policy
          </h1>

          <p className="text-orange-500 mt-2 tracking-wide">
            FYT LYF • India • Last Updated: 1 January 2026
          </p>

          <div className="mt-8 space-y-6 text-gray-300 leading-relaxed text-lg">
            <p>
              FYT LYF (“we”, “our”, “us”) respects your privacy. 
              This Privacy Policy explains how we collect, use and protect your information when you pre-register for FYT LYF.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              What We Collect
            </h2>
            <ul className="list-disc ml-6">
              <li>Name</li>
              <li>Email</li>
              <li>Indian Mobile Number</li>
              <li>Basic analytics (Google Analytics)</li>
            </ul>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Why We Collect It
            </h2>
            <ul className="list-disc ml-6">
              <li>Pre-registration management</li>
              <li>Updates & launch communication</li>
              <li>Platform improvement</li>
            </ul>

            <p>
              Your data is securely stored in Google Firebase & Google Analytics.
              We do not sell your data.
            </p>

            <h2 className="text-2xl font-bold text-orange-500 mt-6">
              Your Rights
            </h2>
            <p>You may request access, update or deletion at:</p>
            <p className="text-white font-bold">
              founder@fytlyf.in
            </p>

            <p className="text-sm text-gray-500 mt-6">
              This policy may update when our platform officially launches.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
