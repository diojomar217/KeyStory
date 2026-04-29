"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { RsvpRecord } from "@/lib/db/rsvps";
import StatsCards from "./StatsCards";
import Filters from "./Filters";
import GuestList from "./GuestList";
import { Download, Search, Sparkles } from "lucide-react";

type FilterKey = "all" | "yes" | "no" | "godparent";
type SortKey = "recent" | "oldest" | "name";

export default function HostDashboardClient({
  initialRsvps,
  slug,
  siteId,
  analyticsEnabled = null,
}: {
  initialRsvps: RsvpRecord[];
  slug: string;
  siteId?: string;
  analyticsEnabled?: boolean | null;
}) {
  if (process.env.NODE_ENV !== 'production') {
    try {
      // Debug: log initial props
      // eslint-disable-next-line no-console
      console.log('HostDashboardClient init', { initialRsvpsLength: (initialRsvps || []).length, siteId, slug });
    } catch (e) {
      // ignore
    }
  }
  const [rsvps, setRsvps] = useState<RsvpRecord[]>(initialRsvps || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("recent");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      try {
        // eslint-disable-next-line no-console
        console.log('HostDashboardClient mounted, will refresh RSVPs for', { siteId, slug });
      } catch (e) {}
    }

    let mounted = true;

    async function refresh() {
      try {
        setLoading(true);
        const query = siteId ? `site_id=${encodeURIComponent(siteId)}` : `slug=${encodeURIComponent(slug)}`;
        const res = await fetch(`/api/rsvp?${query}`);
        const data = await res.json();

        if (process.env.NODE_ENV !== 'production') {
          try {
            // eslint-disable-next-line no-console
            console.log('HostDashboardClient fetched', { siteId, slug, rsvps: data && data.rsvps ? data.rsvps.length : null });
          } catch (e) {}
        }

        if (!mounted) return;

        if (data && Array.isArray(data.rsvps)) {
          setRsvps(data.rsvps);
          setError(null);
        } else if (data && data.error) {
          setError(data.error.toString());
        }
      } catch (err: any) {
        if (mounted) setError(err?.message || "Failed to load RSVPs");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    refresh();

    const iv = setInterval(refresh, 30 * 1000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [slug, siteId]);

  const totals = useMemo(() => {
    const total = rsvps.length;
    const yes = rsvps.filter((r) => r.attendance === "yes").length;
    const no = rsvps.filter((r) => r.attendance === "no").length;
    const maybe = rsvps.filter((r) => r.attendance === "maybe").length;
    const companions = rsvps.reduce((acc, r) => acc + (r.companions || 0), 0);
    const companionsForYes = rsvps.reduce(
      (acc, r) => acc + ((r.attendance === "yes") ? (r.companions || 0) : 0),
      0
    );
    const totalAttendees = yes + companionsForYes;

    return { total, yes, no, maybe, companions, totalAttendees };
  }, [rsvps]);

  const processed = useMemo(() => {
    let list = [...(rsvps || [])];

    if (filter === "yes") list = list.filter((r) => r.attendance === "yes");
    if (filter === "no") list = list.filter((r) => r.attendance === "no");
    if (filter === "godparent") {
      list = list.filter(
        (r) => (r.godparent_confirmation || "").toLowerCase() === "yes"
      );
    }

    if (sort === "recent") {
      list.sort(
        (a, b) =>
          (b.created_at ? new Date(b.created_at).getTime() : 0) -
          (a.created_at ? new Date(a.created_at).getTime() : 0)
      );
    } else if (sort === "oldest") {
      list.sort(
        (a, b) =>
          (a.created_at ? new Date(a.created_at).getTime() : 0) -
          (b.created_at ? new Date(b.created_at).getTime() : 0)
      );
    } else if (sort === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    return list;
  }, [rsvps, filter, sort]);

  const searched = useMemo(() => {
    if (!search.trim()) return processed;

    const q = search.trim().toLowerCase();
    return processed.filter((r) => {
      return (
        (r.name || "").toLowerCase().includes(q) ||
        (r.message || "").toLowerCase().includes(q) ||
        (r.contact_number || "").toLowerCase().includes(q)
      );
    });
  }, [processed, search]);

  function exportCsv(rows: RsvpRecord[]) {
    try {
      const escapeCell = (v: any) => {
        if (v === null || v === undefined) return "";
        const s = String(v);
        return `"${s.replace(/"/g, '""')}"`;
      };

      const header = [
        "Name",
        "Attendance",
        "Companions",
        "Godparent",
        "Message",
        "Created At",
      ];

      const lines = [header.map(escapeCell).join(",")];

      for (const r of rows) {
        const cols = [
          r.name,
          r.attendance,
          r.companions || 0,
          r.godparent_confirmation || "",
          r.message || "",
          r.created_at || "",
        ];
        lines.push(cols.map(escapeCell).join(","));
      }

      const blob = new Blob([lines.join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug || "rsvps"}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export CSV failed", err);
    }
  }

  const sortButtonClass = (value: SortKey) =>
    [
      "rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
      sort === value
        ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_10px_25px_rgba(244,114,182,0.28)]"
        : "border border-[#eadfdc] bg-white/90 text-[#9a6c66] hover:bg-rose-50",
    ].join(" ");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff6f7_0%,#fdf8f7_35%,#f7f2f1_100%)] px-6 py-8 xl:px-10 2xl:px-14">
      <div className="mx-auto w-full max-w-[1800px]">
        <div className="mb-8">
          <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#fff6f7] via-white to-[#fff9f7] px-8 py-10 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.95),transparent_55%)] pointer-events-none" />
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-400 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Host RSVP Dashboard
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#b03052] sm:text-5xl">
                {slug}
              </h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_minmax(0,1fr)]">
          <aside>
            <div className="rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
              <div className="border-b border-[#efe5e2] pb-4">
                <h3 className="text-2xl font-semibold tracking-tight text-[#3e3134]">
                  Overview
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Quick summary of guest activity
                </p>
              </div>

              <div className="mt-5">
                <StatsCards totals={totals} />
              </div>

              <div className="mt-6">
                <label className="mb-2 block text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Search guests
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, message, contact..."
                    className="w-full rounded-2xl border border-[#eadfdc] bg-white/90 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-rose-200 focus:ring-4 focus:ring-rose-100/70"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="mb-3 block text-[11px] uppercase tracking-[0.22em] text-slate-400">
                  Filters
                </label>
                <Filters active={filter} onChange={(f) => setFilter(f)} />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => exportCsv(searched)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c7924d] to-[#deb57a] px-4 py-3 text-sm font-medium text-white shadow-[0_12px_30px_rgba(200,155,93,0.28)] transition hover:scale-[1.01]"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </aside>

          <main>
            <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_80px_rgba(15,23,42,0.10)] backdrop-blur-xl min-h-[760px]">
              <div className="flex flex-col gap-4 border-b border-[#efe5e2] pb-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h2 className="text-3xl font-semibold tracking-tight text-[#3e3134]">
                    Guest Responses
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-800">
                      {searched.length}
                    </span>{" "}
                    guest{searched.length === 1 ? "" : "s"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-sm text-slate-400">Sort</span>
                  <button
                    type="button"
                    onClick={() => setSort("recent")}
                    className={sortButtonClass("recent")}
                  >
                    Recent
                  </button>
                  <button
                    type="button"
                    onClick={() => setSort("oldest")}
                    className={sortButtonClass("oldest")}
                  >
                    Oldest
                  </button>
                  <button
                    type="button"
                    onClick={() => setSort("name")}
                    className={sortButtonClass("name")}
                  >
                    Name
                  </button>
                </div>
              </div>

              {loading && (
                <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50/70 px-4 py-3 text-sm text-rose-600">
                  Refreshing RSVP list…
                </div>
              )}

              {error && (
                <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  Error loading RSVPs: {error}
                </div>
              )}

              <div className="mt-6">
                <GuestList rsvps={searched} />
              </div>

              <div className="mt-10 text-center text-xs tracking-wide text-slate-400">
                Made with care — KeyStory
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}