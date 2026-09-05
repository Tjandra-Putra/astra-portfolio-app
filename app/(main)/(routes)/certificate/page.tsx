"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Award, ArrowUpRight, ShieldCheck, CalendarDays, Hash } from "lucide-react";
import Loader from "@/components/layout/loader";
import { CertificateFrame } from "@/components/certificate-frame";
import { getJSON, syncVersion } from "@/lib/data-client";

const CertificatePage = () => {
  const [certificates, setCertificates] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const userInfo = useSelector((state: any) => state.userReducer);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const changed = await syncVersion(String(userInfo.id));
      const response = await getJSON<any[]>(`/api/certificate/${userInfo.id}`, changed ? { force: true } : {});
      const visible = response.filter((c: any) => c.visible);
      visible.sort((a: any, b: any) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime());
      setCertificates(visible);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <div className="grid gap-3.5">
      {/* ══ Masthead panel ═══════════════════════════════════ */}
      <header className="glass pad-lg rise relative overflow-hidden">
        <span className="beam" />
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-xl">
            <span className="tt-mono inline-flex items-center gap-2">
              <span className="pin" /> 03 — Credentials
            </span>
            <h1 className="tt-h1 mt-5">
              Licenses &amp; <span className="acc">certificates.</span>
            </h1>
            <p className="tt-body mt-4">
              Shown, not claimed — every credential here carries the document and the issuer&apos;s source.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {!loading && certificates.length > 0 && (
              <div className="text-right">
                <p className="tt-num text-[2.2rem]">{String(certificates.length).padStart(2, "0")}</p>
                <p className="tt-unit mt-1">on record</p>
              </div>
            )}
            <span className="glass-lite grid h-12 w-12 place-items-center rounded-tile">
              <Award className="h-[18px] w-[18px] text-ink" strokeWidth={1.75} />
            </span>
          </div>
        </div>
      </header>

      {/* ══ Gallery ══════════════════════════════════════════ */}
      {loading ? (
        <div className="bento">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass pad sm:col-span-3 lg:col-span-4">
              <div className="glass-lite shimmer aspect-[4/3] w-full rounded-tile" />
              <div className="glass-lite shimmer mt-5 h-5 w-2/3 rounded-xs" />
              <div className="glass-lite shimmer mt-2.5 h-4 w-1/3 rounded-xs" />
            </div>
          ))}
        </div>
      ) : certificates.length > 0 ? (
        <div className="bento">
          {certificates.map((c, i) => (
            <article
              key={c.id}
              className="glass pad reveal flex flex-col sm:col-span-3 lg:col-span-4"
              style={{ transitionDelay: `${Math.min(i, 5) * 70}ms` }}
            >
              {/* Fixed-ratio document frame — identical for every credential */}
              <CertificateFrame url={c.certificateImageUrl} title={c.title} />

              <div className="mt-5 flex items-start gap-3">
                <span className="tt-mono mt-1 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="min-w-0 flex-1">
                  <h2 className="tt-h2">{c.title}</h2>
                  <p className="tt-sub mt-1.5">{c.issueingOrganisation}</p>
                </div>
              </div>

              <div className="glass-lite pad-sm mt-4 grid gap-3">
                <div className="flex items-center justify-between gap-4">
                  <span className="tt-mono inline-flex items-center gap-2">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} /> Issued
                  </span>
                  <span className="font-mono text-[0.8125rem] font-medium text-ink">
                    {new Date(c.issuedDate).toLocaleDateString("en-SG")}
                  </span>
                </div>

                {c.certificateId && (
                  <>
                    <hr className="rule" />
                    <div className="flex items-start justify-between gap-4">
                      <span className="tt-mono inline-flex shrink-0 items-center gap-2">
                        <Hash className="h-3.5 w-3.5" strokeWidth={2} /> ID
                      </span>
                      <span className="break-all text-right font-mono text-[0.8125rem] font-medium text-ink">
                        {c.certificateId}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5 pt-1">
                {c.certificateImageUrl && (
                  <Link href={c.certificateImageUrl} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
                    View document
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                )}
                {c.certificateUrl && (
                  <Link href={c.certificateUrl} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
                    Verify source
                  </Link>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <section className="glass pad-lg reveal grid place-items-center text-center">
          <span className="glass-lite mb-4 grid h-12 w-12 place-items-center rounded-tile">
            <Award className="h-5 w-5 text-muted-ink" strokeWidth={1.75} />
          </span>
          <p className="tt-h3">No certificates published yet</p>
          <p className="tt-sub mt-1.5 max-w-xs">
            Licenses and certificates will appear here once they are added and set to visible.
          </p>
        </section>
      )}
    </div>
  );
};

export default CertificatePage;
