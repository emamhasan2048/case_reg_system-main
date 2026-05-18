import Link from "next/link";
import { getCasesForPage } from "@/lib/cases";
import { badgeTone, formatViolation, violationOptions } from "@/lib/violations";
import { AppNav } from "../nav";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const { cases, databaseError } = await getCasesForPage();
  const completed = cases.filter((item) => item.status === "completed").length;
  const pending = cases.length - completed;
  const latestCases = cases.slice(0, 5);
  const completionRate = cases.length ? Math.round((completed / cases.length) * 100) : 0;

  const violationCounts = violationOptions
    .map((item) => ({
      ...item,
      count: cases.filter((trafficCase) => trafficCase.violationCode === item.code).length,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <main className="shell">
      <AppNav />

      <div className="mb-7">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Modern overview</p>
        <h1 className="text-2xl font-extrabold">Case activity dashboard</h1>
      </div>

      {databaseError && <DatabaseError />}

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <MetricCard label="Total cases" value={cases.length} />
        <MetricCard label="Pending" value={pending} tone="amber" />
        <MetricCard label="Completed" value={completed} tone="green" />
        <MetricCard label="Completion" value={`${completionRate}%`} tone="blue" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="card overflow-hidden">
          <div className="border-b border-[var(--border)] px-5 py-4">
            <h2 className="text-base font-extrabold">Recent cases</h2>
          </div>
          {latestCases.length === 0 ? (
            <EmptyState />
          ) : (
            latestCases.map((item) => (
              <Link
                className="grid gap-2 border-b border-[#333331] px-5 py-4 text-sm font-bold last:border-b-0 md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr]"
                href={`/cases/${item.registrationNumber}`}
                key={item.id}
              >
                <div>
                  <div className="font-extrabold">{item.driverName}</div>
                  <div className="mt-1 text-xs text-[var(--muted)]">{item.registrationNumber}</div>
                </div>
                <div>{item.violationDate}</div>
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${badgeTone(item.violationCode)}`}>
                    {item.violationCode}
                  </span>
                </div>
                <div className={item.status === "completed" ? "text-emerald-300" : "text-amber-300"}>
                  {item.status === "completed" ? "Completed" : "Pending"}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="card p-5">
          <h2 className="mb-4 text-base font-extrabold">Violation breakdown</h2>
          {violationCounts.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-4">
              {violationCounts.map((item) => {
                const percent = Math.max(8, Math.round((item.count / cases.length) * 100));

                return (
                  <div key={item.code}>
                    <div className="mb-2 flex items-center justify-between gap-3 text-sm font-bold">
                      <span>{formatViolation(item.code)}</span>
                      <span className="text-[var(--muted)]">{item.count}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#30302e]">
                      <div className="h-full rounded-full bg-[#7fb1ef]" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function DatabaseError() {
  return (
    <div className="mb-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">
      Database connection reached Atlas, but authentication failed. Update the Database Access user/password in .env.local, then restart the app.
    </div>
  );
}

function MetricCard({ label, value, tone = "neutral" }: { label: string; value: number | string; tone?: "neutral" | "amber" | "green" | "blue" }) {
  const tones = {
    neutral: "text-white",
    amber: "text-amber-300",
    green: "text-emerald-300",
    blue: "text-[#7fb1ef]",
  };

  return (
    <div className="card p-5">
      <div className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className={`text-3xl font-extrabold ${tones[tone]}`}>{value}</div>
    </div>
  );
}

function EmptyState() {
  return <div className="p-5 text-sm font-bold text-[var(--muted)]">No cases yet. Register a case to see data here.</div>;
}
