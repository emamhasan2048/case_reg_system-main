import { getCasesForPage } from "@/lib/cases";
import { AppNav } from "../nav";
import { CasesBrowser } from "./components/cases-browser";

export const dynamic = "force-dynamic";

export default async function AllCasesPage() {
  const { cases, databaseError } = await getCasesForPage();
  const pending = cases.filter((item) => item.status === "pending").length;
  const completed = cases.length - pending;
  const uniqueVehicles = new Set(cases.map((item) => item.registrationNumber)).size;

  return (
    <main className="shell">
      <AppNav />

      <div className="mb-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#7fb1ef]">Case control</p>
        <h1 className="text-2xl font-extrabold">All registered cases</h1>
      </div>

      {databaseError && <DatabaseError />}

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <Stat label="Total cases" value={cases.length} />
        <Stat label="Pending" value={pending} tone="text-amber-300" />
        <Stat label="Completed" value={completed} tone="text-emerald-300" />
        <Stat label="Vehicles" value={uniqueVehicles} tone="text-[#7fb1ef]" />
      </div>

      <CasesBrowser cases={cases} />
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

function Stat({ label, value, tone = "text-white" }: { label: string; value: number; tone?: string }) {
  return (
    <div className="soft-card p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className={`mt-2 text-2xl font-extrabold ${tone}`}>{value}</div>
    </div>
  );
}
