export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center px-6">
        
        <h1 className="text-5xl font-bold">
          FYT LYF
        </h1>

        <p className="text-xl mt-4 text-gray-300">
          The Discipline Based Fitness Revolution of India
        </p>

        <p className="mt-6 text-orange-500 font-semibold">
          Challenges Open • Launching Jan 1, 2026
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <a className="bg-orange-500 px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition">
            Enter The Arena
          </a>

          <a className="border px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition">
            Become A Member
          </a>
        </div>

      </div>
    </main>
  );
}
