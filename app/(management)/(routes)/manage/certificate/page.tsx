"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { Award, Eye, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";

type Filter = "all" | "visible" | "hidden";

const ManageCertificatePage = () => {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);

  // Toolbar state — filters the already-fetched array, no extra requests.
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const fetchCertificates = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/manage/certificate");
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCertificateHandler = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this certificate?");
    if (!confirmed) return;

    try {
      setButtonLoading(true);
      await axios.delete(`/api/manage/certificate/${id}`);
      // Drop the row locally. Previously the request succeeded and the record
      // stayed on screen until a manual reload, which reads as a failed delete.
      setCertificates((current) => current.filter((item: any) => item.id !== id));
      toast.success("Certificate deleted successfully");
    } catch (error) {
      console.error("Error deleting certificate:", error);
      toast.error("Could not delete. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();

    return certificates
      .slice()
      .sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime())
      .filter((certificate) => {
        if (filter === "visible" && !certificate?.visible) return false;
        if (filter === "hidden" && certificate?.visible) return false;
        if (!q) return true;
        return [certificate.title, certificate.issueingOrganisation]
          .filter(Boolean)
          .some((value: string) => value.toLowerCase().includes(q));
      });
  }, [certificates, query, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "visible", label: "Visible" },
    { key: "hidden", label: "Hidden" },
  ];

  return (
    <div className="grid gap-3">
      {/* ══ Header ══════════════════════════════════════════ */}
      <header className="glass pad rise flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="tt-mono">Certificates</p>
          <h1 className="tt-h2 mt-1.5">Licences &amp; certifications</h1>
        </div>
        <Link href="/manage/certificate/add" className="btn btn-acc btn-sm shrink-0">
          <Plus className="h-4 w-4" strokeWidth={2} /> Add
        </Link>
      </header>

      {/* ══ Toolbar ═════════════════════════════════════════ */}
      <div className="glass pad-sm rise flex flex-wrap items-center justify-between gap-3" style={{ animationDelay: "60ms" }}>
        <div className="relative min-w-0 flex-1 sm:max-w-[22rem]">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-ink"
            strokeWidth={1.75}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search certificates, issuers"
            aria-label="Search certificates"
            className="field field-icon"
          />
        </div>

        <div className="seg" role="group" aria-label="Filter by visibility">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              aria-pressed={filter === key}
              className={`seg-btn ${filter === key ? "is-on" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Records ═════════════════════════════════════════ */}
      <section className="glass pad rise" style={{ animationDelay: "120ms" }}>
        {loading ? (
          <div className="grid gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-lite shimmer h-[62px] rounded-tile" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="glass-well pad-lg grid place-items-center rounded-tile text-center">
            <span className="glass-bright grid h-12 w-12 place-items-center rounded-tile">
              <Award className="h-5 w-5 text-ink" strokeWidth={1.75} />
            </span>
            <p className="tt-h3 mt-4">{certificates.length === 0 ? "No certificates yet" : "No matches"}</p>
            <p className="tt-sub mt-1.5 max-w-sm">
              {certificates.length === 0
                ? "Add a certification and it appears on your public page."
                : "Nothing matches this search and filter. Try a different term."}
            </p>
            {certificates.length === 0 ? (
              <Link href="/manage/certificate/add" className="btn btn-acc btn-sm mt-4">
                <Plus className="h-4 w-4" strokeWidth={2} /> Add a certificate
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setFilter("all");
                }}
                className="btn btn-glass btn-sm mt-4"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="glass-lite rows overflow-hidden rounded-tile">
            {rows.map((certificate) => (
              <div key={certificate.id} className="rowitem">
                <span className="glass-well grid h-9 w-9 shrink-0 place-items-center rounded-xs">
                  <Award className="h-4 w-4 text-ink" strokeWidth={1.75} />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.875rem] font-medium text-ink">{certificate.title}</p>
                  {certificate.issueingOrganisation && (
                    <p className="tt-sub mt-0.5 truncate">{certificate.issueingOrganisation}</p>
                  )}
                </div>

                {certificate.issuedDate && (
                  <span className="tt-mono hidden shrink-0 md:block">
                    {new Date(certificate.issuedDate).toLocaleDateString("en-SG")}
                  </span>
                )}

                <span className={`chip hidden shrink-0 sm:inline-flex ${certificate?.visible ? "" : "chip-acc"}`}>
                  {certificate?.visible ? (
                    <React.Fragment>
                      <Eye className="h-3 w-3" strokeWidth={1.75} /> Visible
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <EyeOff className="h-3 w-3" strokeWidth={1.75} /> Hidden
                    </React.Fragment>
                  )}
                </span>

                <div className="flex shrink-0 items-center gap-1.5">
                  <Link
                    href={`/manage/certificate/${certificate.id}/edit`}
                    className="iconbtn iconbtn-sm"
                    aria-label={`Edit ${certificate.title}`}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteCertificateHandler(certificate.id)}
                    disabled={buttonLoading}
                    className="iconbtn iconbtn-sm"
                    aria-label={`Delete ${certificate.title}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ManageCertificatePage;
