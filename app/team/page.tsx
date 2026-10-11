"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Search,
  Users,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { supabase, hasSupabaseConfig } from "@/lib/supabase";

type Member = {
  id: string;
  name: string;
  domain: string;
  position: string;
  linkedin_url: string | null;
  github_url: string | null;
  branch: string;
  semester: number;
  bio: string;
  photo_url: string;
  status: string;
};

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Meet the Team", href: "/team" },
  { label: "Admin", href: "/admin" },
  { label: "Register", href: "/register" },
];

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All Domains");
  const [positionFilter, setPositionFilter] = useState("All Positions");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  async function loadMembers() {
    setLoading(true);
    setError("");

    if (!hasSupabaseConfig) {
      setError("Supabase is not configured. Check your .env.local file.");
      setLoading(false);
      return;
    }

    const { data, error: fetchError } = await supabase
      .from("members")
      .select(
        "id, name, domain, position, linkedin_url, github_url, branch, semester, bio, photo_url, status"
      )
      .eq("status", "approved")
      .order("name", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setMembers([]);
    } else {
      setMembers((data ?? []) as Member[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    void loadMembers();
  }, []);

  const domains = useMemo(
    () => [
      "All Domains",
      ...Array.from(new Set(members.map((member) => member.domain))).sort(),
    ],
    [members]
  );

  const positions = useMemo(
    () => [
      "All Positions",
      ...Array.from(new Set(members.map((member) => member.position))).sort(),
    ],
    [members]
  );

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !term ||
        [
          member.name,
          member.domain,
          member.position,
          member.bio,
          member.branch,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(term));

      const matchesDomain =
        domainFilter === "All Domains" || member.domain === domainFilter;

      const matchesPosition =
        positionFilter === "All Positions" ||
        member.position === positionFilter;

      return matchesSearch && matchesDomain && matchesPosition;
    });
  }, [members, search, domainFilter, positionFilter]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#08090d] text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/[0.12] blur-[140px]" />
        <div className="absolute right-[-150px] top-[500px] h-[350px] w-[350px] rounded-full bg-blue-500/[0.08] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#080812]/90 backdrop-blur-xl">
          <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10">
                <Sparkles className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <p className="text-sm font-bold tracking-[0.22em] text-white">
                  EMBRIONE<span className="text-violet-300">.</span>
                </p>
                <p className="text-[10px] tracking-[0.18em] text-white/40">
                  PEOPLE & COMMUNITY
                </p>
              </div>
            </Link>

            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.href === "/team" ? "page" : undefined}
                  className={`text-sm transition-colors ${
                    link.href === "/team"
                      ? "text-violet-300"
                      : "text-white/60 hover:text-violet-200"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/register"
                className="primary-button"
              >
                Join the team <ArrowUpRight size={16} />
              </Link>
            </div>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition hover:border-violet-300/40 hover:text-violet-200 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </nav>

          {menuOpen && (
            <div className="border-t border-white/10 bg-[#080812] px-5 py-5 md:hidden">
              <div className="mx-auto flex max-w-7xl flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={link.href === "/team" ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`text-sm transition-colors ${
                      link.href === "/team"
                        ? "text-violet-300"
                        : "text-white/60 hover:text-violet-200"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="primary-button w-fit"
                >
                  Join the team <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pb-14 pt-20 lg:px-10 lg:pb-20 lg:pt-28">
          <div className="max-w-3xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/[0.07] px-4 py-2 text-xs tracking-wide text-violet-200">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              THE PEOPLE BEHIND EMBRIONE
            </div>

            <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Different minds.
              <br />
              <span className="bg-gradient-to-r from-violet-300 via-fuchsia-200 to-blue-300 bg-clip-text text-transparent">
                One community.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
              Meet the people who bring ideas to life, build things that
              matter, and make Embrione what it is.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <a
                href="#directory"
                className="primary-button"
              >
                Explore the team <ArrowDownRight size={16} />
              </a>

              <div className="flex items-center gap-2 text-sm text-white/45">
                <Users className="h-4 w-4" />
                {members.length} approved{" "}
                {members.length === 1 ? "member" : "members"}
              </div>
            </div>
          </div>
        </section>

        {/* Directory */}
        <section
          id="directory"
          className="mx-auto max-w-7xl scroll-mt-24 px-6 pb-24 lg:px-10"
        >
          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.25em] text-violet-300">
                THE DIRECTORY
              </p>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Find your people.
              </h2>
              <p className="mt-3 text-sm text-white/45">
                Search by name, explore domains, and discover the team.
              </p>
            </div>

            <button
              onClick={() => void loadMembers()}
              disabled={loading}
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/10 px-4 py-2.5 text-sm text-white/65 transition hover:border-white/25 hover:text-white disabled:opacity-50 md:self-auto"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          <div className="mb-8 grid gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.025] p-3 md:grid-cols-[1fr_210px_210px]">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-black/20 px-4">
              <Search className="h-5 w-5 shrink-0 text-white/35" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search people, domains, skills..."
                className="h-12 w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                aria-label="Search team members"
              />
            </div>

            <select
              value={domainFilter}
              onChange={(event) => setDomainFilter(event.target.value)}
              className="h-12 rounded-xl border border-white/[0.07] bg-[#101116] px-4 text-sm text-white/80 outline-none focus:border-violet-400/50"
              aria-label="Filter by domain"
            >
              {domains.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>

            <select
              value={positionFilter}
              onChange={(event) => setPositionFilter(event.target.value)}
              className="h-12 rounded-xl border border-white/[0.07] bg-[#101116] px-4 text-sm text-white/80 outline-none focus:border-violet-400/50"
              aria-label="Filter by position"
            >
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-[330px] animate-pulse rounded-2xl border border-white/[0.07] bg-white/[0.025]"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.05] px-6 py-12 text-center">
              <p className="font-medium text-red-200">
                Something interrupted our orbit.
              </p>
              <p className="mt-2 text-sm text-white/50">{error}</p>
              <button
                onClick={() => void loadMembers()}
                className="mt-5 rounded-full border border-white/15 px-5 py-2 text-sm transition hover:bg-white/10"
              >
                Try again
              </button>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-16 text-center">
              <Users className="mx-auto h-9 w-9 text-white/25" />
              <h3 className="mt-4 text-xl font-medium">
                {members.length === 0
                  ? "Our directory is just getting started."
                  : "No matching members found."}
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
                {members.length === 0
                  ? "Approved members will appear here once their registrations are reviewed."
                  : "Try a different search or reset your filters to explore the team."}
              </p>
              {members.length > 0 && (
                <button
                  onClick={() => {
                    setSearch("");
                    setDomainFilter("All Domains");
                    setPositionFilter("All Positions");
                  }}
                  className="mt-5 text-sm text-violet-300 hover:text-violet-200"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="mb-5 text-xs tracking-wide text-white/35">
                SHOWING {filteredMembers.length} OF {members.length} MEMBERS
              </p>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMembers.map((member) => (
                  <article
                    key={member.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#101116]/80 p-6 transition duration-300 hover:-translate-y-1 hover:border-violet-300/30 hover:bg-[#13131b]"
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/[0.07] blur-3xl transition group-hover:bg-violet-500/[0.14]" />

                    <div className="relative flex items-start gap-4">
                      <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                        {member.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={member.photo_url}
                            alt={member.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-violet-200">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1 pt-1">
                        <span className="inline-block max-w-full truncate rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-violet-200">
                          {member.position}
                        </span>
                        <h3 className="mt-2 truncate text-lg font-semibold">
                          {member.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-white/40">
                          {member.domain}
                        </p>
                      </div>
                    </div>

                    <p className="relative mt-6 min-h-[66px] text-sm leading-6 text-white/55">
                      {member.bio || "Part of the Embrione community."}
                    </p>

                    <div className="relative mt-5 flex flex-wrap gap-2">
                      {member.branch && (
                        <span className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
                          {member.branch}
                        </span>
                      )}
                      {member.semester > 0 && (
                        <span className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-xs text-white/50">
                          Semester {member.semester}
                        </span>
                      )}
                    </div>

                    <div className="relative mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-5">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s LinkedIn`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/10 hover:text-white"
                        >
                          <FaLinkedin size={16} />
                          LinkedIn
                          <ArrowUpRight className="h-3 w-3 opacity-50" />
                        </a>
                      )}

                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${member.name}'s GitHub`}
                          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/65 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                        >
                          <FaGithub size={16} />
                          GitHub
                          <ArrowUpRight className="h-3 w-3 opacity-50" />
                        </a>
                      )}

                      {!member.linkedin_url && !member.github_url && (
                        <span className="text-xs text-white/25">
                          No social links added
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.08]">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <Link
              href="/"
              className="font-semibold tracking-[0.2em] text-white/60"
            >
              EMBRIONE
            </Link>
            <p>Built by people who believe in what comes next.</p>
            <Link
              href="/register"
              className="transition hover:text-violet-200"
            >
              Become a member <ArrowUpRight className="ml-1 inline h-3 w-3" />
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}