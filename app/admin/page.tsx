
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Activity,
  Check,
  CheckCircle2,
  Clock3,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { supabase } from "@/lib/supabase";

type Status = "pending" | "approved" | "rejected";
type Filter = "all" | Status;

type Member = {
  id: string;
  name: string;
  domain: string;
  position: string;
  srn: string;
  email: string;
  linkedin_url: string | null;
  github_url: string | null;
  branch: string;
  semester: string | number;
  bio: string;
  photo_url: string | null;
  status: Status;
  created_at: string;
};

const filters: Filter[] = [
  "pending",
  "approved",
  "rejected",
  "all",
];

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadMembers = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });

    if (fetchError) {
      setError(
        `Could not load applications: ${fetchError.message}`
      );
      setMembers([]);
    } else {
      setMembers((data ?? []) as Member[]);
    }

    setLoading(false);
  }, []);

  const verifyAdmin = useCallback(
    async (userId: string) => {
      setError("");
      setMessage("");

      const { data, error: adminError } = await supabase
        .from("admins")
        .select("user_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (adminError || !data) {
        await supabase.auth.signOut();
        setIsAdmin(false);

        setError(
          adminError
            ? `Could not verify admin access: ${adminError.message}`
            : "This account does not have admin access."
        );

        return;
      }

      setIsAdmin(true);
      await loadMembers();
    },
    [loadMembers]
  );

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!active) return;

      if (sessionError) {
        setError(sessionError.message);
        setChecking(false);
        return;
      }

      if (data.session?.user) {
        await verifyAdmin(data.session.user.id);
      }

      if (active) {
        setChecking(false);
      }
    }

    checkSession();

    return () => {
      active = false;
    };
  }, [verifyAdmin]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoggingIn(true);
    setError("");
    setMessage("");

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      if (!data.user) {
        setError("Login failed. Please try again.");
        return;
      }

      await verifyAdmin(data.user.id);
    } catch {
      setError("Something went wrong while logging in.");
    } finally {
      setLoggingIn(false);
    }
  }

  async function changeStatus(
    member: Member,
    status: Status
  ) {
    if (member.status !== "pending") {
      setError(
        "Only pending applications can be approved or rejected."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to ${status} ${member.name}'s application?`
    );

    if (!confirmed) return;

    setBusyId(member.id);
    setError("");
    setMessage("");

    try {
      const { data, error: updateError } = await supabase
        .from("members")
        .update({ status })
        .eq("id", member.id)
        .eq("status", "pending")
        .select("id, status")
        .maybeSingle();

      if (updateError) {
        setError(
          `Could not update application: ${updateError.message}`
        );
        return;
      }

      if (!data) {
        setError(
          "No application was updated. Check your admin permissions or refresh the page."
        );
        return;
      }

      setMembers((current) =>
        current.map((item) =>
          item.id === member.id
            ? { ...item, status: data.status as Status }
            : item
        )
      );

      setMessage(
        `${member.name}'s application was ${status}.`
      );
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");

    const { error: logoutError } =
      await supabase.auth.signOut();

    if (logoutError) {
      setError(logoutError.message);
      return;
    }

    setIsAdmin(false);
    setMembers([]);
    setEmail("");
    setPassword("");
    setFilter("pending");
    setSearch("");
  }

  const counts = useMemo(
    () => ({
      all: members.length,
      pending: members.filter(
        (member) => member.status === "pending"
      ).length,
      approved: members.filter(
        (member) => member.status === "approved"
      ).length,
      rejected: members.filter(
        (member) => member.status === "rejected"
      ).length,
    }),
    [members]
  );

  const visibleMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesFilter =
        filter === "all" || member.status === filter;

      const searchable = [
        member.name,
        member.email,
        member.srn,
        member.domain,
        member.position,
        member.branch,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesFilter &&
        (!query || searchable.includes(query))
      );
    });
  }, [members, filter, search]);

  if (checking) {
    return (
      <>
        <AdminStyles />
        <main className="admin-screen centered">
          <div className="loading-orb">
            <ShieldCheck size={28} />
          </div>
          <p className="muted">Verifying admin session...</p>
        </main>
      </>
    );
  }

  if (!isAdmin) {
    return (
      <>
        <AdminStyles />

        <main className="admin-screen login-screen">
          <div className="login-decoration decoration-one" />
          <div className="login-decoration decoration-two" />

          <section className="login-card">
            <div className="brand-mark">
              <ShieldCheck size={30} />
            </div>

            <p className="eyebrow">EMBRIONE / CONTROL CENTER</p>

            <h1>
              Admin
              <br />
              <span>access.</span>
            </h1>

            <p className="login-description">
              Sign in to review applications and manage the
              Embrione team directory.
            </p>

            <form onSubmit={handleLogin} className="login-form">
              <label htmlFor="admin-email">Email address</label>

              <div className="input-wrap">
                <Mail size={17} />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="admin@example.com"
                  autoComplete="username"
                  required
                />
              </div>

              <label htmlFor="admin-password">Password</label>

              <div className="input-wrap">
                <ShieldCheck size={17} />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>

              {error && (
                <div className="notice error-notice">
                  <XCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="primary-button login-button"
                type="submit"
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <>
                    <RefreshCw className="spin" size={17} />
                    Verifying access...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={17} />
                    Sign in to dashboard
                  </>
                )}
              </button>
            </form>

            <div className="login-footer">
              <span className="status-dot" />
              Restricted administrator access
            </div>
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <AdminStyles />

      <main className="admin-screen dashboard-screen">
        <header className="dashboard-header">
          <a href="/" className="dashboard-brand">
            <span className="brand-icon">
              <ShieldCheck size={23} />
            </span>

            <span>
              <strong>EMBRIONE</strong>
              <small>ADMIN CONSOLE</small>
            </span>
          </a>

          <div className="header-actions">
            <span className="secure-label">
              <span className="status-dot" />
              Admin session active
            </span>

            <button
              className="secondary-button logout-button"
              onClick={handleLogout}
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </header>

        <section className="dashboard-content">
          <div className="page-heading">
            <div>
              <p className="eyebrow">OVERVIEW / APPLICATIONS</p>
              <h1>
                Team <span>management.</span>
              </h1>
              <p className="muted heading-description">
                Review registrations and build the next
                generation of Embrione.
              </p>
            </div>

            <button
              className="secondary-button refresh-button"
              onClick={loadMembers}
              disabled={loading}
            >
              <RefreshCw
                size={16}
                className={loading ? "spin" : ""}
              />
              Refresh
            </button>
          </div>

          {error && (
            <div className="notice error-notice dashboard-notice">
              <XCircle size={18} />
              <span>{error}</span>
              <button
                className="notice-close"
                onClick={() => setError("")}
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {message && (
            <div className="notice success-notice dashboard-notice">
              <CheckCircle2 size={18} />
              <span>{message}</span>
              <button
                className="notice-close"
                onClick={() => setMessage("")}
                aria-label="Dismiss message"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <section className="stats-grid">
            <StatCard
              label="Total applications"
              value={counts.all}
              icon={<Users size={20} />}
              detail="All submissions"
              accent="neutral"
            />

            <StatCard
              label="Awaiting review"
              value={counts.pending}
              icon={<Clock3 size={20} />}
              detail="Needs your attention"
              accent="amber"
            />

            <StatCard
              label="Approved members"
              value={counts.approved}
              icon={<CheckCircle2 size={20} />}
              detail="Part of the team"
              accent="green"
            />

            <StatCard
              label="Rejected"
              value={counts.rejected}
              icon={<XCircle size={20} />}
              detail="Not approved"
              accent="red"
            />
          </section>

          <section className="applications-panel">
            <div className="panel-heading">
              <div>
                <div className="panel-title-row">
                  <Activity size={19} />
                  <h2>Applications</h2>
                </div>
                <p className="muted">
                  Review candidate profiles and manage their status.
                </p>
              </div>

              <span className="result-count">
                {visibleMembers.length}{" "}
                {visibleMembers.length === 1
                  ? "application"
                  : "applications"}
              </span>
            </div>

            <div className="toolbar">
              <div className="filter-tabs">
                {filters.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`filter-tab ${
                      filter === item ? "active" : ""
                    }`}
                  >
                    <span>
                      {item === "all"
                        ? "All"
                        : item.charAt(0).toUpperCase() +
                          item.slice(1)}
                    </span>

                    <span className="tab-count">
                      {counts[item]}
                    </span>
                  </button>
                ))}
              </div>

              <div className="search-box">
                <Search size={17} />
                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search applicants..."
                  aria-label="Search applicants"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="empty-state">
                <RefreshCw className="spin" size={27} />
                <h3>Loading applications</h3>
                <p>Fetching the latest registrations...</p>
              </div>
            ) : visibleMembers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Users size={25} />
                </div>
                <h3>
                  {search
                    ? "No matching applicants"
                    : filter === "pending"
                      ? "You're all caught up"
                      : "No applications here yet"}
                </h3>
                <p>
                  {search
                    ? "Try a different name, email, SRN, or domain."
                    : "Applications matching this filter will appear here."}
                </p>

                {search && (
                  <button
                    className="secondary-button"
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="application-list">
                {visibleMembers.map((member) => (
                  <article
                    className="application-card"
                    key={member.id}
                  >
                    <div className="member-main">
                      <img
                        className="member-avatar"
                        src={
                          member.photo_url ||
                          `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(member.name)}`
                        }
                        alt={`${member.name}'s profile`}
                      />

                      <div className="member-identity">
                        <div className="member-name-row">
                          <h3>{member.name}</h3>
                          <StatusBadge status={member.status} />
                        </div>

                        <p className="member-position">
                          {member.position || "Applicant"}
                          {member.domain
                            ? ` · ${member.domain}`
                            : ""}
                        </p>

                        <p className="member-email">
                          {member.email}
                        </p>
                      </div>
                    </div>

                    <div className="member-details">
                      <Detail
                        label="SRN"
                        value={member.srn}
                      />
                      <Detail
                        label="Branch"
                        value={member.branch}
                      />
                      <Detail
                        label="Semester"
                        value={String(member.semester)}
                      />
                      <Detail
                        label="Submitted"
                        value={
                          member.created_at
                            ? new Date(
                                member.created_at
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "—"
                        }
                      />
                    </div>

                    {member.bio && (
                      <p className="member-bio">{member.bio}</p>
                    )}

                    <div className="card-footer">
                      <div className="social-links">
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label={`${member.name}'s LinkedIn`}
                          >
                            <FaLinkedin size={16} />
                            LinkedIn
                          </a>
                        )}

                        {member.github_url && (
                          <a
                            href={member.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-link"
                            aria-label={`${member.name}'s GitHub`}
                          >
                            <FaGithub size={16} />
                            GitHub
                          </a>
                        )}
                      </div>

                      {member.status === "pending" ? (
                        <div className="review-actions">
                          <button
                            className="reject-button"
                            onClick={() =>
                              changeStatus(member, "rejected")
                            }
                            disabled={busyId === member.id}
                          >
                            <X size={16} />
                            Reject
                          </button>

                          <button
                            className="approve-button"
                            onClick={() =>
                              changeStatus(member, "approved")
                            }
                            disabled={busyId === member.id}
                          >
                            {busyId === member.id ? (
                              <RefreshCw
                                size={16}
                                className="spin"
                              />
                            ) : (
                              <Check size={16} />
                            )}
                            Approve
                          </button>
                        </div>
                      ) : (
                        <span className="reviewed-label">
                          {member.status === "approved" ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {member.status === "approved"
                            ? "Approved"
                            : "Rejected"}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <footer className="dashboard-footer">
            <span>EMBRIONE · ADMIN CONSOLE</span>
            <span>
              <ShieldCheck size={14} />
              Secure review workspace
            </span>
          </footer>
        </section>
      </main>
    </>
  );
}

function StatCard({
  label,
  value,
  icon,
  detail,
  accent,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  detail: string;
  accent: string;
}) {
  return (
    <article className={`stat-card accent-${accent}`}>
      <div className="stat-top">
        <span className="stat-label">{label}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <strong className="stat-value">{value}</strong>
      <span className="stat-detail">{detail}</span>
    </article>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const icon =
    status === "approved" ? (
      <CheckCircle2 size={13} />
    ) : status === "rejected" ? (
      <XCircle size={13} />
    ) : (
      <Clock3 size={13} />
    );

  return (
    <span className={`status-badge status-${status}`}>
      {icon}
      {status}
    </span>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value || "—"}</strong>
    </div>
  );
}

function AdminStyles() {
  return (
    <style jsx global>{`
      @import url("https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap");

      :root {
        --admin-bg: #08090c;
        --admin-panel: #101217;
        --admin-panel-2: #14161c;
        --admin-border: rgba(255, 255, 255, 0.085);
        --admin-text: #f3f4f6;
        --admin-muted: #888d9b;
        --admin-accent: #b8ff65;
      }

      .admin-screen,
      .admin-screen * {
        box-sizing: border-box;
      }

      .admin-screen {
        min-height: 100vh;
        background:
          radial-gradient(
            ellipse at 50% -20%,
            rgba(184, 255, 101, 0.075),
            transparent 45%
          ),
          var(--admin-bg);
        color: var(--admin-text);
        font-family: "DM Sans", sans-serif;
      }

      .admin-screen button,
      .admin-screen input {
        font: inherit;
      }

      .admin-screen button {
        cursor: pointer;
      }

      .admin-screen button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .admin-screen a {
        color: inherit;
        text-decoration: none;
      }

      .muted {
        color: var(--admin-muted);
      }

      .eyebrow {
        color: var(--admin-accent);
        font: 500 10px "DM Mono", monospace;
        letter-spacing: 2px;
      }

      .centered {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 14px;
      }

      .loading-orb,
      .brand-mark {
        display: grid;
        place-items: center;
        color: var(--admin-accent);
        background: rgba(184, 255, 101, 0.09);
        border: 1px solid rgba(184, 255, 101, 0.22);
        border-radius: 17px;
      }

      .loading-orb {
        width: 62px;
        height: 62px;
      }

      .login-screen {
        position: relative;
        display: grid;
        place-items: center;
        padding: 28px 18px;
        overflow: hidden;
      }

      .login-decoration {
        position: absolute;
        width: 300px;
        height: 300px;
        border: 1px solid rgba(184, 255, 101, 0.09);
        border-radius: 50%;
        pointer-events: none;
      }

      .decoration-one {
        top: -170px;
        left: -100px;
      }

      .decoration-two {
        right: -180px;
        bottom: -180px;
        width: 430px;
        height: 430px;
      }

      .login-card {
        position: relative;
        z-index: 1;
        width: 100%;
        max-width: 435px;
        padding: 38px;
        background: rgba(16, 18, 23, 0.94);
        border: 1px solid var(--admin-border);
        border-radius: 24px;
        box-shadow: 0 30px 100px rgba(0, 0, 0, 0.35);
      }

      .brand-mark {
        width: 58px;
        height: 58px;
        margin-bottom: 28px;
      }

      .login-card h1,
      .page-heading h1 {
        margin: 14px 0;
        font-family: "Space Grotesk", sans-serif;
        font-size: clamp(36px, 6vw, 48px);
        line-height: 1.08;
        letter-spacing: -2px;
      }

      .login-card h1 span,
      .page-heading h1 span {
        color: var(--admin-accent);
      }

      .login-description {
        margin: 0 0 28px;
        color: var(--admin-muted);
        font-size: 14px;
        line-height: 1.8;
      }

      .login-form {
        display: flex;
        flex-direction: column;
        gap: 11px;
      }

      .login-form label {
        margin-top: 8px;
        color: #d8dbe2;
        font-size: 12px;
        font-weight: 600;
      }

      .input-wrap {
        display: flex;
        align-items: center;
        gap: 11px;
        min-width: 0;
        padding: 0 14px;
        color: #858b98;
        background: #0b0d11;
        border: 1px solid var(--admin-border);
        border-radius: 11px;
      }

      .input-wrap:focus-within {
        border-color: rgba(184, 255, 101, 0.6);
      }

      .input-wrap input {
        width: 100%;
        min-width: 0;
        height: 47px;
        color: white;
        background: transparent;
        border: 0;
        outline: none;
        font-size: 13px;
      }

      .input-wrap input::placeholder {
        color: #5d6270;
      }

      .password-toggle,
      .notice-close,
      .search-box button {
        display: grid;
        flex-shrink: 0;
        place-items: center;
        padding: 5px;
        color: #8b91a0;
        background: transparent;
        border: 0;
      }

      .primary-button,
      .approve-button,
      .reject-button,
      .secondary-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 9px;
        min-height: 40px;
        padding: 0 15px;
        border-radius: 10px;
        font-size: 12px;
        font-weight: 700;
        transition:
          background 0.2s,
          border-color 0.2s,
          transform 0.2s;
      }

      .primary-button {
        color: #10130b;
        background: var(--admin-accent);
        border: 1px solid var(--admin-accent);
      }

      .primary-button:hover,
      .approve-button:hover {
        background: #d0ff9b;
        transform: translateY(-1px);
      }

      .login-button {
        min-height: 48px;
        margin-top: 13px;
      }

      .login-footer {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        margin-top: 25px;
        padding-top: 20px;
        color: var(--admin-muted);
        border-top: 1px solid var(--admin-border);
        font: 10px "DM Mono", monospace;
      }

      .status-dot {
        display: inline-block;
        width: 7px;
        height: 7px;
        flex-shrink: 0;
        background: var(--admin-accent);
        border-radius: 50%;
        box-shadow: 0 0 12px rgba(184, 255, 101, 0.4);
      }

      .notice {
        display: flex;
        align-items: flex-start;
        gap: 10px;
        padding: 12px 14px;
        border: 1px solid;
        border-radius: 10px;
        font-size: 12px;
        line-height: 1.6;
      }

      .notice span {
        flex: 1;
        overflow-wrap: anywhere;
      }

      .error-notice {
        color: #ff9999;
        background: rgba(255, 86, 86, 0.07);
        border-color: rgba(255, 86, 86, 0.2);
      }

      .success-notice {
        color: #caff9b;
        background: rgba(184, 255, 101, 0.06);
        border-color: rgba(184, 255, 101, 0.2);
      }

      .dashboard-screen {
        padding-bottom: 25px;
      }

      .dashboard-header {
        position: sticky;
        top: 0;
        z-index: 5;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        min-height: 76px;
        padding: 13px max(5%, calc((100% - 1320px) / 2));
        background: rgba(8, 9, 12, 0.91);
        border-bottom: 1px solid var(--admin-border);
        backdrop-filter: blur(20px);
      }

      .dashboard-brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .brand-icon {
        display: grid;
        width: 42px;
        height: 42px;
        place-items: center;
        color: var(--admin-accent);
        background: rgba(184, 255, 101, 0.08);
        border: 1px solid rgba(184, 255, 101, 0.2);
        border-radius: 12px;
      }

      .dashboard-brand strong,
      .dashboard-brand small {
        display: block;
      }

      .dashboard-brand strong {
        font: 700 13px "Space Grotesk", sans-serif;
        letter-spacing: 1.5px;
      }

      .dashboard-brand small {
        margin-top: 4px;
        color: var(--admin-muted);
        font: 9px "DM Mono", monospace;
        letter-spacing: 1.3px;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .secure-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #a2a7b3;
        font-size: 11px;
      }

      .secondary-button {
        color: #e5e7eb;
        background: #15171d;
        border: 1px solid var(--admin-border);
      }

      .secondary-button:hover {
        background: #20232b;
        border-color: rgba(255, 255, 255, 0.18);
      }

      .dashboard-content {
        width: min(1180px, 90%);
        margin: 0 auto;
      }

      .page-heading {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 20px;
        padding: 49px 0 30px;
      }

      .page-heading h1 {
        margin: 12px 0;
        font-size: clamp(32px, 4.5vw, 45px);
      }

      .heading-description {
        margin: 0;
        font-size: 13px;
        line-height: 1.7;
      }

      .refresh-button {
        flex-shrink: 0;
        margin-bottom: 5px;
      }

      .dashboard-notice {
        margin-bottom: 16px;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 14px;
        margin-bottom: 30px;
      }

      .stat-card {
        min-width: 0;
        padding: 20px;
        background: linear-gradient(
          145deg,
          #14161c,
          #0e1014
        );
        border: 1px solid var(--admin-border);
        border-radius: 15px;
      }

      .stat-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }

      .stat-label {
        color: #a2a7b3;
        font-size: 11px;
      }

      .stat-icon {
        display: grid;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        place-items: center;
        color: #d3d7e0;
        background: rgba(255, 255, 255, 0.045);
        border-radius: 10px;
      }

      .accent-amber .stat-icon {
        color: #ffc86b;
        background: rgba(255, 200, 107, 0.09);
      }

      .accent-green .stat-icon {
        color: var(--admin-accent);
        background: rgba(184, 255, 101, 0.09);
      }

      .accent-red .stat-icon {
        color: #ff8585;
        background: rgba(255, 100, 100, 0.09);
      }

      .stat-value {
        display: block;
        margin-top: 17px;
        font: 600 34px "Space Grotesk", sans-serif;
        letter-spacing: -1px;
      }

      .stat-detail {
        display: block;
        margin-top: 5px;
        color: #777d8b;
        font-size: 10px;
      }

      .applications-panel {
        overflow: hidden;
        background: rgba(16, 18, 23, 0.75);
        border: 1px solid var(--admin-border);
        border-radius: 17px;
      }

      .panel-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 23px 24px;
      }

      .panel-title-row {
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--admin-accent);
      }

      .panel-title-row h2 {
        margin: 0;
        color: var(--admin-text);
        font: 600 17px "Space Grotesk", sans-serif;
      }

      .panel-heading p {
        margin: 8px 0 0;
        font-size: 11px;
        line-height: 1.6;
      }

      .result-count {
        flex-shrink: 0;
        padding: 7px 10px;
        color: #bfc4ce;
        background: #1b1e25;
        border: 1px solid var(--admin-border);
        border-radius: 8px;
        font: 10px "DM Mono", monospace;
      }

      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 0 24px 20px;
        border-bottom: 1px solid var(--admin-border);
      }

      .filter-tabs {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }

      .filter-tab {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 34px;
        padding: 0 10px;
        color: #9096a3;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 8px;
        font-size: 11px;
      }

      .filter-tab:hover {
        color: white;
        background: rgba(255, 255, 255, 0.035);
      }

      .filter-tab.active {
        color: var(--admin-accent);
        background: rgba(184, 255, 101, 0.07);
        border-color: rgba(184, 255, 101, 0.18);
      }

      .tab-count {
        color: #a2a7b3;
        font: 10px "DM Mono", monospace;
      }

      .filter-tab.active .tab-count {
        color: var(--admin-accent);
      }

      .search-box {
        display: flex;
        align-items: center;
        gap: 9px;
        width: 245px;
        min-width: 160px;
        padding: 0 11px;
        color: #828896;
        background: #0b0d11;
        border: 1px solid var(--admin-border);
        border-radius: 9px;
      }

      .search-box:focus-within {
        border-color: rgba(184, 255, 101, 0.45);
      }

      .search-box input {
        width: 100%;
        min-width: 0;
        height: 37px;
        color: white;
        background: transparent;
        border: 0;
        outline: none;
        font-size: 11px;
      }

      .search-box input::placeholder {
        color: #656b78;
      }

      .application-list {
        display: grid;
        gap: 12px;
        padding: 18px;
      }

      .application-card {
        padding: 20px;
        background: #111319;
        border: 1px solid var(--admin-border);
        border-radius: 13px;
        transition: border-color 0.2s;
      }

      .application-card:hover {
        border-color: rgba(255, 255, 255, 0.15);
      }

      .member-main {
        display: flex;
        align-items: center;
        gap: 14px;
      }

      .member-avatar {
        width: 57px;
        height: 57px;
        flex-shrink: 0;
        object-fit: cover;
        background: #222630;
        border: 1px solid var(--admin-border);
        border-radius: 13px;
      }

      .member-identity {
        min-width: 0;
      }

      .member-name-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 9px;
      }

      .member-name-row h3 {
        margin: 0;
        font: 600 16px "Space Grotesk", sans-serif;
        overflow-wrap: anywhere;
      }

      .member-position {
        margin: 5px 0 0;
        color: #c2c6d0;
        font-size: 11px;
      }

      .member-email {
        margin: 5px 0 0;
        color: #858b98;
        font-size: 11px;
        overflow-wrap: anywhere;
      }

      .status-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 8px;
        border: 1px solid;
        border-radius: 6px;
        font: 10px "DM Mono", monospace;
        text-transform: capitalize;
      }

      .status-pending {
        color: #ffc86b;
        background: rgba(255, 200, 107, 0.07);
        border-color: rgba(255, 200, 107, 0.18);
      }

      .status-approved {
        color: var(--admin-accent);
        background: rgba(184, 255, 101, 0.07);
        border-color: rgba(184, 255, 101, 0.18);
      }

      .status-rejected {
        color: #ff8a8a;
        background: rgba(255, 100, 100, 0.07);
        border-color: rgba(255, 100, 100, 0.18);
      }

      .member-details {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-top: 20px;
        padding: 16px 0;
        border-top: 1px solid var(--admin-border);
        border-bottom: 1px solid var(--admin-border);
      }

      .detail-item {
        display: grid;
        gap: 7px;
        min-width: 0;
      }

      .detail-item span {
        color: #777d8b;
        font: 9px "DM Mono", monospace;
        text-transform: uppercase;
        letter-spacing: 0.7px;
      }

      .detail-item strong {
        color: #e0e3e9;
        font-size: 11px;
        font-weight: 500;
        overflow-wrap: anywhere;
      }

      .member-bio {
        margin: 15px 0 0;
        color: #a7acb8;
        font-size: 12px;
        line-height: 1.8;
        overflow-wrap: anywhere;
      }

      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: 17px;
      }

      .social-links,
      .review-actions {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
      }

      .social-link {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        min-height: 34px;
        padding: 0 10px;
        color: #c1c6d1 !important;
        background: #191c23;
        border: 1px solid var(--admin-border);
        border-radius: 8px;
        font-size: 10px;
      }

      .social-link:hover {
        color: var(--admin-accent) !important;
        border-color: rgba(184, 255, 101, 0.25);
      }

      .approve-button {
        color: #11140d;
        background: var(--admin-accent);
        border: 1px solid var(--admin-accent);
      }

      .reject-button {
        color: #ff9696;
        background: rgba(255, 100, 100, 0.055);
        border: 1px solid rgba(255, 100, 100, 0.2);
      }

      .reject-button:hover {
        background: rgba(255, 100, 100, 0.12);
      }

      .reviewed-label {
        display: inline-flex;
        align-items: center;
        gap: 7px;
        color: #a2a7b3;
        font-size: 11px;
        text-transform: capitalize;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 250px;
        padding: 30px 20px;
        color: #858b98;
        text-align: center;
      }

      .empty-icon {
        display: grid;
        width: 53px;
        height: 53px;
        place-items: center;
        color: #b8bfcb;
        background: #191c23;
        border: 1px solid var(--admin-border);
        border-radius: 15px;
      }

      .empty-state h3 {
        margin: 16px 0 7px;
        color: #e9ebf0;
        font: 600 16px "Space Grotesk", sans-serif;
      }

      .empty-state p {
        max-width: 330px;
        margin: 0 0 16px;
        font-size: 11px;
        line-height: 1.7;
      }

      .dashboard-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 12px;
        padding: 25px 0;
        color: #656b78;
        font: 9px "DM Mono", monospace;
        letter-spacing: 0.6px;
      }

      .dashboard-footer span:last-child {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .dashboard-footer svg {
        color: var(--admin-accent);
      }

      .spin {
        animation: admin-spin 1s linear infinite;
      }

      @keyframes admin-spin {
        to {
          transform: rotate(360deg);
        }
      }

      @media (max-width: 850px) {
        .stats-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .toolbar {
          align-items: stretch;
          flex-direction: column;
        }

        .search-box {
          width: 100%;
        }

        .filter-tabs {
          gap: 4px;
        }

        .member-details {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 560px) {
        .login-card {
          padding: 27px 22px;
        }

        .dashboard-header {
          min-height: 68px;
          padding: 12px 5%;
        }

        .dashboard-brand strong {
          font-size: 11px;
        }

        .dashboard-brand small {
          font-size: 8px;
        }

        .brand-icon {
          width: 37px;
          height: 37px;
        }

        .header-actions {
          gap: 8px;
        }

        .secure-label {
          display: none;
        }

        .logout-button {
          min-height: 36px;
          padding: 0 10px;
          font-size: 10px;
        }

        .dashboard-content {
          width: 92%;
        }

        .page-heading {
          align-items: flex-start;
          padding: 34px 0 24px;
        }

        .page-heading h1 {
          font-size: 32px;
          letter-spacing: -1.5px;
        }

        .heading-description {
          font-size: 11px;
        }

        .refresh-button {
          min-height: 35px;
          padding: 0 10px;
          font-size: 10px;
        }

        .stats-grid {
          gap: 9px;
          margin-bottom: 20px;
        }

        .stat-card {
          padding: 14px;
        }

        .stat-label {
          font-size: 10px;
        }

        .stat-icon {
          width: 29px;
          height: 29px;
        }

        .stat-value {
          margin-top: 13px;
          font-size: 29px;
        }

        .stat-detail {
          font-size: 9px;
        }

        .panel-heading {
          align-items: flex-start;
          padding: 19px 15px;
        }

        .panel-heading p {
          max-width: 240px;
        }

        .result-count {
          font-size: 9px;
        }

        .toolbar {
          padding: 0 14px 15px;
        }

        .filter-tab {
          min-height: 32px;
          padding: 0 7px;
          font-size: 10px;
        }

        .application-list {
          gap: 10px;
          padding: 10px;
        }

        .application-card {
          padding: 14px;
        }

        .member-avatar {
          width: 47px;
          height: 47px;
        }

        .member-name-row h3 {
          font-size: 14px;
        }

        .member-details {
          gap: 14px 9px;
        }

        .card-footer {
          align-items: flex-start;
          flex-direction: column;
        }

        .review-actions {
          width: 100%;
        }

        .review-actions button {
          flex: 1;
        }

        .dashboard-footer {
          font-size: 8px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-screen *,
        .admin-screen *::before,
        .admin-screen *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}
