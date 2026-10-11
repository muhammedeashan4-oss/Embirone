"use client";

import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

export default function HeroScenes() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[100px]" />

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0b18]/95 p-5 shadow-2xl shadow-violet-950/30 sm:p-7">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-violet-300">
              Embrione portal
            </p>
            <h3 className="mt-2 text-xl font-semibold text-white">
              People make it happen.
            </h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/20 bg-violet-500/10">
            <Users className="text-violet-300" size={21} />
          </div>
        </div>

        <div className="space-y-3">
          <div
            className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4"
            style={{ animation: "heroFloat 4s ease-in-out infinite" }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/15">
              <UserRound size={22} className="text-violet-300" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                New member application
              </p>
              <p className="mt-1 text-xs text-white/45">
                Profile submitted successfully
              </p>
            </div>

            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-[10px] font-medium text-amber-300">
              Pending
            </span>
          </div>

          <div className="flex justify-center py-1">
            <div className="h-7 w-px bg-gradient-to-b from-violet-400/60 to-fuchsia-400/60" />
          </div>

          <div
            className="flex items-center gap-4 rounded-2xl border border-violet-400/20 bg-violet-500/[0.07] p-4"
            style={{
              animation: "heroFloat 4s ease-in-out 0.7s infinite",
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-fuchsia-500/15">
              <ShieldCheck size={22} className="text-fuchsia-300" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Admin moderation
              </p>
              <p className="mt-1 text-xs text-white/45">
                Review. Verify. Approve.
              </p>
            </div>

            <ArrowRight size={18} className="text-violet-300" />
          </div>

          <div className="flex justify-center py-1">
            <div className="h-7 w-px bg-gradient-to-b from-fuchsia-400/60 to-emerald-400/60" />
          </div>

          <div
            className="flex items-center gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4"
            style={{
              animation: "heroFloat 4s ease-in-out 1.4s infinite",
            }}
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
              <CheckCircle2 size={22} className="text-emerald-300" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white">
                Meet the team
              </p>
              <p className="mt-1 text-xs text-white/45">
                Approved members, one community
              </p>
            </div>

            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
              Approved
            </span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
          <div>
            <p className="text-xs text-white/40">One connected workflow</p>
            <p className="mt-1 text-sm font-medium text-white/80">
              Application to community
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-300" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes heroFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="heroFloat"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}