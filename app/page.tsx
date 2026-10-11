import HeroScenes from "@/components/hero-scene";
import Link from "next/link";
import Navbar from "@/components/ui/Navbar";
import { ShieldCheck } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Stay curious.",
    description:
      "Explore unfamiliar ideas, ask better questions, and keep discovering what's possible.",
    symbol: "✳",
  },
  {
    number: "02",
    title: "Build together.",
    description:
      "Bring different perspectives together and turn individual ideas into shared progress.",
    symbol: "⌘",
  },
  {
    number: "03",
    title: "Make an impact.",
    description:
      "Create meaningful projects, experiment with technology, and learn by doing.",
    symbol: "↗",
  },
];

const domains = [
  { name: "Web Development", detail: "Build what's next", symbol: "⌘" },
  { name: "Design", detail: "Make ideas tangible", symbol: "✳" },
  { name: "Operations", detail: "Make things happen", symbol: "◎" },
  { name: "Marketing", detail: "Tell stories that matter", symbol: "◈" },
];

const principles = [
  { number: "01", title: "Curiosity", description: "Question the ordinary" },
  { number: "02", title: "Collaboration", description: "Go further together" },
  { number: "03", title: "Creation", description: "Turn thought into action" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section id="discover" className="cosmic-bg relative isolate pt-24">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[5%] top-[14%] h-64 w-64 rounded-full bg-violet-600/[0.10] blur-[100px]" />
          <div className="absolute right-[5%] top-[18%] h-72 w-72 rounded-full bg-cyan-400/[0.09] blur-[110px]" />
          <div className="absolute bottom-0 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-violet-700/[0.08] blur-[100px]" />
        </div>

        <div className="mx-auto grid min-h-[650px] w-full max-w-7xl items-center gap-8 px-5 pb-16 pt-12 sm:px-8 md:grid-cols-[1.05fr_0.95fr] md:pb-24 md:pt-16 lg:px-12">
          <div className="fade-up relative z-10 max-w-2xl">
            <div className="eyebrow mb-8">
              <span className="pulse-dot" />
              A community for the curious
            </div>

            <h1 className="text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-[76px]">
              Ideas don&apos;t
              <br />
              just happen.
              <br />
              <span className="gradient-text">They become</span>
              <br />
              <span className="gradient-text">something.</span>
            </h1>

            <p className="mt-7 max-w-lg text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              A space for curious minds, bold ideas, and people
              who love making things happen. Your next chapter
              starts here.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="primary-button">
                Begin your journey <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/team" className="secondary-button">
                Meet the community
              </Link>
            </div>

            {/* Admin entry point */}
            <Link
              href="/admin"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.06] px-4 py-2.5 text-sm text-white/55 transition hover:border-violet-300/40 hover:bg-violet-400/[0.12] hover:text-violet-200"
            >
              <ShieldCheck size={16} />
              Admin portal
              <span aria-hidden="true">↗</span>
            </Link>

            <div className="mt-8 flex items-center gap-3 text-xs text-white/40">
              <span className="pulse-dot" />
              <span>Curiosity is where everything begins.</span>
            </div>
          </div>

          {/* Orbital illustration */}
          <div
            className="relative mx-auto flex aspect-square w-full max-w-[470px] items-center justify-center"
            role="img"
            aria-label="Abstract glowing orbital illustration"
          >
            <div className="absolute h-[84%] w-[84%] rounded-full border border-violet-300/[0.12]" />
            <div className="absolute h-[66%] w-[98%] rotate-[-28deg] rounded-[50%] border border-cyan-200/20" />
            <div className="absolute h-[66%] w-[98%] rotate-[28deg] rounded-[50%] border border-violet-300/25" />
            <div className="absolute h-[52%] w-[52%] rounded-full bg-violet-500/20 blur-[65px]" />

            <div className="float-slow relative flex h-[44%] w-[44%] items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-violet-300/30 via-indigo-500/15 to-cyan-300/20 shadow-[inset_-18px_-18px_50px_rgba(5,5,20,0.8),0_0_90px_rgba(139,92,246,0.2)]">
              <div className="absolute inset-[8%] rounded-full border border-white/10" />
              <div className="absolute left-[14%] top-[20%] h-[18%] w-[35%] rounded-full bg-white/20 blur-xl" />
              <div className="h-[18%] w-[18%] rounded-full bg-white/80 shadow-[0_0_35px_rgba(196,181,253,0.85)]" />
            </div>

            <div className="absolute left-[15%] top-[27%] h-2 w-2 rounded-full bg-cyan-200 shadow-[0_0_18px_rgba(103,213,245,0.9)]" />
            <div className="absolute right-[16%] top-[35%] h-1.5 w-1.5 rounded-full bg-violet-200 shadow-[0_0_15px_rgba(196,181,253,0.9)]" />
            <div className="absolute bottom-[21%] left-[27%] h-1.5 w-1.5 rounded-full bg-white/80" />

            <div className="glass-panel absolute left-0 top-[20%] rounded-2xl px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                The mindset
              </p>
              <p className="mt-1 text-sm font-medium text-white">
                Think beyond.
              </p>
            </div>

            <div className="glass-panel absolute bottom-[16%] right-0 rounded-2xl px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40">
                The mission
              </p>
              <p className="mt-1 text-sm font-medium text-cyan-100">
                Create what&apos;s next.
              </p>
            </div>
          </div>
        </div>

        {/* Core principles */}
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 border-t border-white/[0.08] px-5 py-7 sm:grid-cols-3 sm:gap-4 sm:px-8 lg:px-12">
          {principles.map((item) => (
            <div key={item.number} className="flex items-center gap-4">
              <span className="text-xs tracking-widest text-violet-300/70">
                {item.number}
              </span>
              <div>
                <p className="text-sm font-medium text-white/85">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 md:py-32 lg:px-12"
      >
        <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
          <div>
            <p className="section-label">Beyond the ordinary</p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
              Great things start with{" "}
              <span className="gradient-text">a different question.</span>
            </h2>
          </div>

          <div className="max-w-2xl">
            <p className="text-base leading-8 text-white/55 sm:text-lg">
              Embrione brings together people who want to learn,
              experiment, collaborate, and make their ideas real.
              It&apos;s not about knowing everything already. It&apos;s
              about being willing to discover what you can do.
            </p>
            <Link
              href="/team"
              className="mt-7 inline-flex items-center gap-3 text-sm font-medium text-violet-200 transition hover:gap-4 hover:text-white"
            >
              Get to know us <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.number}
              className="ui-card interactive-card group p-6 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/[0.08] text-xl text-violet-200">
                  {feature.symbol}
                </span>
                <span className="text-xs tracking-[0.2em] text-white/25">
                  {feature.number}
                </span>
              </div>
              <h3 className="mt-8 text-xl font-medium text-white">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/50">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Domains */}
      <section id="domains" className="border-y border-white/[0.07] bg-white/[0.015]">
        <div className="mx-auto w-full max-w-7xl px-5 py-24 sm:px-8 md:py-28 lg:px-12">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="section-label">Find your orbit</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Different minds.{" "}
                <span className="gradient-text">One universe.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-white/45">
              Find the kind of work that excites you, meet people
              who challenge you, and discover where your strengths
              can take you.
            </p>
          </div>

          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {domains.map((domain, index) => (
              <article
                key={domain.name}
                className="ui-card interactive-card group flex min-h-44 flex-col justify-between p-5 sm:p-6"
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl text-violet-200/90">
                    {domain.symbol}
                  </span>
                  <span className="text-xs text-white/25">
                    0{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-medium text-white">
                    {domain.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/45">
                    {domain.detail}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section id="join" className="px-5 py-24 sm:px-8 md:py-32 lg:px-12">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-violet-300/15 bg-[#111020] px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 -top-32 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-40 -right-16 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />

          <div className="relative">
            <p className="section-label">Your next chapter starts here</p>
            <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              You have the idea.
              <br />
              <span className="gradient-text">Let&apos;s make it real.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-white/50 sm:text-base">
              Bring your curiosity, your perspective, and your
              willingness to try. There&apos;s room to grow here.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="primary-button">
                Apply to Embrione <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/team" className="secondary-button">
                Explore the team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <Link
            href="/"
            className="text-xs font-semibold tracking-[0.22em] text-white/70"
          >
            EMBRIONE
          </Link>
          <p className="text-xs text-white/35">
            Built from curiosity. Driven by possibility.
          </p>
          <div className="flex flex-wrap gap-5 text-xs text-white/45">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/team" className="transition hover:text-white">Our team</Link>
            <Link href="/register" className="transition hover:text-white">Apply</Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 transition hover:text-violet-200"
            >
              <ShieldCheck size={14} />
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}