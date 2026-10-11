
"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type React from "react";
import { supabase } from "@/lib/supabase";

const domains = [
  "Web Development",
  "Design",
  "Logistics",
  "Operations",
  "Sponsorship",
  "Hospitality",
  "Social Media",
  "Event Management",
];

const positions = ["Head", "Vice-Head", "Core Member", "Member"];

const branches = [
  "CSE",
  "AIML",
  "ECE",
  "EEE",
  "ME",
  "Biotech",
  "Civil",
  "Other",
];

type Profile = {
  name: string;
  domain: string;
  position: string;
  srn: string;
  email: string;
  linkedin_url: string;
  github_url: string;
  branch: string;
  semester: string;
  bio: string;
};

const initialProfile: Profile = {
  name: "",
  domain: "Web Development",
  position: "Member",
  srn: "",
  email: "",
  linkedin_url: "",
  github_url: "",
  branch: "CSE",
  semester: "1",
  bio: "",
};

function makeWebP(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const source = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(source);

      const maxSize = 800;
      const scale = Math.min(
        1,
        maxSize / Math.max(image.naturalWidth, image.naturalHeight)
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));

      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Your browser could not process this image."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(
              new Error("Image conversion failed. Please try another image.")
            );
          }
        },
        "image/webp",
        0.8
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(source);
      reject(new Error("Could not read this image. Please select another."));
    };

    image.src = source;
  });
}

export default function RegisterPage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!photo) {
      setPhotoPreview("");
      return;
    }

    const url = URL.createObjectURL(photo);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photo]);

  function updateField(
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  }

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError("");
    setMessage("");

    if (!file) {
      setPhoto(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Please choose an image smaller than 10 MB.");
      event.target.value = "";
      return;
    }

    setPhoto(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    let uploadedPath: string | null = null;

    try {
      if (
        !profile.name.trim() ||
        !profile.srn.trim() ||
        !profile.email.trim()
      ) {
        throw new Error("Please complete your name, SRN, and email.");
      }

      let photoUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        profile.name.trim() || "Embrione Member"
      )}`;

      if (photo) {
        const webpBlob = await makeWebP(photo);
        const safeName = crypto.randomUUID();
        const path = `${safeName}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("member-photos")
          .upload(path, webpBlob, {
            contentType: "image/webp",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        uploadedPath = path;

        const { data: publicData } = supabase.storage
          .from("member-photos")
          .getPublicUrl(path);

        photoUrl = publicData.publicUrl;
      }

      const { error: insertError } = await supabase.from("members").insert({
        name: profile.name.trim(),
        domain: profile.domain,
        position: profile.position,
        srn: profile.srn.trim(),
        email: profile.email.trim(),
        linkedin_url: profile.linkedin_url.trim() || null,
        github_url: profile.github_url.trim() || null,
        branch: profile.branch,
        semester: Number(profile.semester),
        bio: profile.bio.trim(),
        photo_url: photoUrl,
        status: "pending",
      });

      if (insertError) {
        if (uploadedPath) {
          await supabase.storage
            .from("member-photos")
            .remove([uploadedPath]);
        }

        if (insertError.code === "23505") {
          throw new Error(
            "This SRN may already be registered. Please check your details."
          );
        }

        throw insertError;
      }

      setMessage(
        "Application submitted! Your profile is now awaiting admin approval."
      );
      setProfile(initialProfile);
      setPhoto(null);

      const fileInput = document.getElementById(
        "profile-photo"
      ) as HTMLInputElement | null;

      if (fileInput) fileInput.value = "";
    } catch (error) {
  console.error("Registration failed:", error);

  setMessage(
    error instanceof Error
      ? error.message
      : JSON.stringify(error) || "Unknown registration error"
  );
}
  }

  const avatar =
    photoPreview ||
    `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
      profile.name.trim() || "Embrione Member"
    )}`;

  return (
    <main className="min-h-screen bg-[#09090b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-violet-600/10 blur-[130px]" />
        <div className="absolute -right-40 top-[45%] h-96 w-96 rounded-full bg-fuchsia-500/[0.07] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,0.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.6)_1px,transparent_1px)] [background-size:64px_64px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.08]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/25 bg-violet-400/10 font-bold text-violet-200">
              E
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.2em]">
                EMBRIONE
              </p>
              <p className="mt-1 text-[9px] tracking-[0.16em] text-white/40">
                MEMBER ONBOARDING
              </p>
            </div>
          </Link>

          <Link
            href="/team"
            className="text-sm text-white/55 transition hover:text-white"
          >
            Meet the team <span className="ml-1">↗</span>
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs tracking-[0.2em] text-violet-300">
            YOUR STORY STARTS HERE
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Create your profile<span className="text-violet-300">.</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/50 sm:text-base">
            Tell us about yourself. Your member card updates as you fill in the
            details, so you can preview your profile before submitting it.
          </p>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-white/[0.09] bg-[#111114]/90 p-5 shadow-2xl shadow-black/20 sm:p-8"
          >
            <div className="mb-7 flex items-center justify-between border-b border-white/[0.08] pb-5">
              <div>
                <h2 className="text-lg font-medium">Member details</h2>
                <p className="mt-1 text-xs text-white/40">
                  Fields marked * are required
                </p>
              </div>
              <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-3 py-1.5 text-xs text-violet-200">
                Application
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name *">
                <input
                  name="name"
                  value={profile.name}
                  onChange={updateField}
                  placeholder="Your full name"
                  required
                  maxLength={100}
                  className={inputStyle}
                />
              </Field>

              <Field label="SRN *">
                <input
                  name="srn"
                  value={profile.srn}
                  onChange={updateField}
                  placeholder="PES1UG23CS001"
                  required
                  maxLength={40}
                  className={inputStyle}
                />
              </Field>

              <Field label="Email address *">
                <input
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  required
                  maxLength={254}
                  className={inputStyle}
                />
              </Field>

              <Field label="Domain *">
                <select
                  name="domain"
                  value={profile.domain}
                  onChange={updateField}
                  className={selectStyle}
                >
                  {domains.map((domain) => (
                    <option
                      key={domain}
                      value={domain}
                      className={optionStyle}
                    >
                      {domain}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Position *">
                <select
                  name="position"
                  value={profile.position}
                  onChange={updateField}
                  className={selectStyle}
                >
                  {positions.map((position) => (
                    <option
                      key={position}
                      value={position}
                      className={optionStyle}
                    >
                      {position}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Branch *">
                <select
                  name="branch"
                  value={profile.branch}
                  onChange={updateField}
                  className={selectStyle}
                >
                  {branches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                      className={optionStyle}
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Semester *">
                <select
                  name="semester"
                  value={profile.semester}
                  onChange={updateField}
                  className={selectStyle}
                >
                  {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(
                    (semester) => (
                      <option
                        key={semester}
                        value={semester}
                        className={optionStyle}
                      >
                        Semester {semester}
                      </option>
                    )
                  )}
                </select>
              </Field>

              <Field label="LinkedIn URL">
                <input
                  name="linkedin_url"
                  type="url"
                  value={profile.linkedin_url}
                  onChange={updateField}
                  placeholder="https://linkedin.com/in/..."
                  className={inputStyle}
                />
              </Field>

              <Field label="GitHub URL">
                <input
                  name="github_url"
                  type="url"
                  value={profile.github_url}
                  onChange={updateField}
                  placeholder="https://github.com/..."
                  className={inputStyle}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="A little about you">
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={updateField}
                    placeholder="What do you enjoy building, learning, or contributing?"
                    maxLength={200}
                    rows={4}
                    className={`${inputStyle} resize-y`}
                  />
                </Field>
                <p className="mt-2 text-right text-xs text-white/35">
                  {profile.bio.length}/200 characters
                </p>
              </div>

              <div className="sm:col-span-2">
                <Field label="Profile picture">
                  <label
                    htmlFor="profile-photo"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] px-5 py-7 text-center transition hover:border-violet-300/40 hover:bg-violet-300/[0.04]"
                  >
                    <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
                      ↑
                    </span>
                    <span className="text-sm font-medium">
                      {photo ? photo.name : "Choose a profile photo"}
                    </span>
                    <span className="mt-2 text-xs text-white/40">
                      PNG, JPG, JPEG · Max 10 MB · Converted to WebP
                    </span>
                    <input
                      id="profile-photo"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhoto}
                      className="sr-only"
                    />
                  </label>
                </Field>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm leading-6 text-red-200"
              >
                {error}
              </div>
            )}

            {message && (
              <div
                role="status"
                className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm leading-6 text-emerald-200"
              >
                <p className="font-medium">Submission received ✓</p>
                <p className="mt-1">{message}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-full bg-violet-300 px-6 py-4 text-sm font-semibold text-[#171020] transition duration-300 hover:bg-violet-200 hover:shadow-[0_10px_35px_rgba(167,139,250,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Submitting your profile..." : "Submit application"}
              {!loading && <span>→</span>}
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-white/35">
              Your application will remain pending until an admin reviews it.
            </p>
          </form>

          <aside className="lg:sticky lg:top-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs tracking-[0.18em] text-violet-300">
                  LIVE PREVIEW
                </p>
                <h2 className="mt-2 text-lg font-medium">Your member card</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/45">
                Live
              </span>
            </div>

            <div className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-[#111114] p-5 transition duration-300 hover:border-violet-300/30 sm:p-7">
              <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-violet-500/[0.13] blur-[75px] transition duration-500 group-hover:bg-violet-500/20" />
              <div className="pointer-events-none absolute -bottom-24 -left-12 h-52 w-52 rounded-full bg-fuchsia-500/[0.08] blur-[75px]" />

              <div className="relative flex items-center justify-between border-b border-white/[0.09] pb-5">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em]">
                    EMBRIONE
                  </p>
                  <p className="mt-1 text-[9px] tracking-[0.16em] text-white/35">
                    PES UNIVERSITY
                  </p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-300/20 bg-violet-300/[0.08] text-violet-200">
                  ✳
                </div>
              </div>

              <div className="relative mt-7 flex flex-col items-center text-center">
                <div className="rounded-[27px] bg-gradient-to-br from-violet-300/70 via-fuchsia-300/40 to-white/10 p-[2px]">
                  <img
                    src={avatar}
                    alt="Member profile preview"
                    className="h-32 w-32 rounded-[25px] bg-[#202027] object-cover sm:h-36 sm:w-36"
                  />
                </div>

                <h3 className="mt-5 max-w-full break-words text-2xl font-semibold tracking-tight">
                  {profile.name.trim() || "Your Name"}
                </h3>

                <p className="mt-2 text-sm text-violet-200">
                  {profile.position}
                </p>

                <span className="mt-4 rounded-full border border-violet-300/20 bg-violet-300/[0.07] px-4 py-2 text-xs text-violet-100">
                  {profile.domain}
                </span>

                <p className="mt-5 min-h-[60px] max-w-sm break-words text-sm leading-6 text-white/50">
                  {profile.bio.trim() ||
                    "Your introduction will appear here as you fill in your profile."}
                </p>
              </div>

              <div className="relative mt-7 grid grid-cols-2 gap-3 border-t border-white/[0.09] pt-5">
                <div className="rounded-xl bg-white/[0.035] p-3">
                  <p className="text-[10px] tracking-[0.15em] text-white/35">
                    BRANCH
                  </p>
                  <p className="mt-2 text-sm font-medium">{profile.branch}</p>
                </div>
                <div className="rounded-xl bg-white/[0.035] p-3">
                  <p className="text-[10px] tracking-[0.15em] text-white/35">
                    SEMESTER
                  </p>
                  <p className="mt-2 text-sm font-medium">
                    {profile.semester}
                  </p>
                </div>
              </div>

              <div className="relative mt-4 flex items-center justify-between gap-3 text-xs text-white/35">
                <span className="max-w-[70%] truncate">
                  {profile.srn || "SRN pending"}
                </span>
                <span className="shrink-0 rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-3 py-1.5 text-amber-200">
                  Preview
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <p className="text-sm font-medium">Before you submit</p>
              <ul className="mt-3 space-y-2 text-xs leading-6 text-white/45">
                <li>✓ Check your name, SRN, and email.</li>
                <li>✓ Add a short introduction.</li>
                <li>✓ Preview your card and upload a photo if you wish.</li>
                <li>
                  ✓ Your profile appears in the team directory only after
                  approval.
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

const inputStyle =
  "mt-2 w-full rounded-xl border border-white/[0.09] bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-300/50 focus:ring-2 focus:ring-violet-300/10";

const selectStyle =
  `${inputStyle} [color-scheme:dark]`;

const optionStyle = "bg-[#111122] text-white";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-white/65">
      {label}
      {children}
    </label>
  );
}
