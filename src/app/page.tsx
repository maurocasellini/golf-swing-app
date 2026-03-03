import Link from "next/link";

const STEPS = [
  { num: "1", title: "Upload", desc: "Record your swing and upload the video" },
  { num: "2", title: "Mark Frames", desc: "Select key positions on the timeline" },
  { num: "3", title: "Get Analysis", desc: "Receive detailed feedback and drills" },
];

const FEATURES = [
  { title: "8-Phase Analysis", description: "Every swing position scored from 1-100 with detailed observations.", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { title: "Cause-Effect Chains", description: "Understand how faults in one phase create problems downstream.", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { title: "Practice Drills", description: "Specific drills with equipment, reps, and feel cues for each fault.", icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" },
  { title: "Progress Tracking", description: "See how your scores trend over time across multiple sessions.", icon: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-golf-900 via-golf-800 to-golf-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            AI-Powered Golf Swing Analysis
          </h1>
          <p className="text-lg sm:text-xl text-golf-100 max-w-2xl mx-auto mb-8">
            Upload your swing video and receive detailed biomechanical feedback,
            phase-by-phase scoring, and personalized practice drills in seconds.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-base font-semibold text-golf-800 shadow-lg hover:bg-golf-50 transition-colors"
          >
            Analyze Your Swing
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-golf-100 text-golf-800 text-xl font-bold">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 bg-white p-6 hover:shadow-sm transition-shadow">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-golf-100 text-golf-700">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={f.icon} />
                  </svg>
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-golf-50">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Ready to improve your swing?</h2>
          <p className="text-gray-600 mb-6">Start your first analysis — no account needed.</p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 rounded-full bg-golf-700 px-8 py-3 text-base font-semibold text-white hover:bg-golf-800 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
}
