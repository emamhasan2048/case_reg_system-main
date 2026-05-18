import Link from "next/link";
import { getCases, getCasesForPage } from "@/lib/cases";
import { badgeTone } from "@/lib/violations";
import { AppNav } from "../nav";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

function getParam(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function QueriesPage({ searchParams }: Props) {
  const params = await searchParams;
  const { cases, databaseError } = await getCasesForPage();

  const registration = getParam(params, "registration").trim().toUpperCase();
  const model = getParam(params, "model").trim().toLowerCase();
  const color = getParam(params, "color").trim().toLowerCase();
  const license = getParam(params, "license").trim().toUpperCase();
  const showOffenders = getParam(params, "show") === "offenders";
  const showStats = getParam(params, "show") === "stats";

  const byRegistration = registration
    ? cases.filter((item) => item.registrationNumber.toUpperCase() === registration)
    : [];
  const byModelColor =
    model || color
      ? cases.filter(
          (item) =>
            (!model || item.vehicleModel.toLowerCase().includes(model)) &&
            (!color || item.color.toLowerCase().includes(color)),
        )
      : [];
  const byLicense = license ? cases.filter((item) => item.licenseNumber.toUpperCase() === license) : [];

  const offenders = Array.from(new Map(cases.map((item) => [item.licenseNumber, item])).values()).sort((a, b) =>
    a.driverName.localeCompare(b.driverName),
  );

  const stats = Array.from(
    cases
      .reduce((map, item) => {
        const key = `${item.vehicleModel}-${item.manufactureYear}`;
        const current = map.get(key) ?? { model: item.vehicleModel, year: item.manufactureYear, count: 0 };
        current.count += 1;
        map.set(key, current);
        return map;
      }, new Map<string, { model: string; year: number; count: number }>())
      .values(),
  ).sort((a, b) => b.count - a.count || a.model.localeCompare(b.model));

  return (
    <main className="shell">
      <AppNav />
      <h1 className="mb-6 text-2xl font-extrabold">Queries</h1>

      {databaseError && <DatabaseError />}

      <div className="space-y-5">
        <QueryCard icon="▣" title="Who owns a vehicle with registration number?">
          <form className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input className="field" name="registration" placeholder="e.g. LTU-4821" defaultValue={registration} />
            <button className="nav-button justify-center" type="submit">
              Search
            </button>
          </form>
          {registration && <OwnerResults cases={byRegistration} />}
        </QueryCard>

        <QueryCard icon="◉" title="Who owns a vehicle by model & color?">
          <form className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
            <input className="field" name="model" placeholder="Model e.g. VW Golf" defaultValue={getParam(params, "model")} />
            <input className="field" name="color" placeholder="Color e.g. Gray" defaultValue={getParam(params, "color")} />
            <button className="nav-button justify-center" type="submit">
              Search
            </button>
          </form>
          {(model || color) && <OwnerResults cases={byModelColor} />}
        </QueryCard>

        <QueryCard icon="▤" title="Violations committed by a driver (license no.)">
          <form className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input className="field" name="license" placeholder="e.g. LT-00241" defaultValue={license} />
            <button className="nav-button justify-center" type="submit">
              Search
            </button>
          </form>
          {license && <ViolationResults cases={byLicense} />}
        </QueryCard>

        <QueryCard icon="♙" title="List of offenders (drivers with violations)">
          <form>
            <input name="show" type="hidden" value="offenders" />
            <button className="nav-button" type="submit">
              Show offenders
            </button>
          </form>
          {showOffenders && <OffenderResults cases={offenders} />}
        </QueryCard>

        <QueryCard icon="▥" title="Number of vehicles by model and year">
          <form>
            <input name="show" type="hidden" value="stats" />
            <button className="nav-button" type="submit">
              Show stats
            </button>
          </form>
          {showStats && <StatsResults stats={stats} />}
        </QueryCard>
      </div>
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

function QueryCard({ children, icon, title }: { children: React.ReactNode; icon: string; title: string }) {
  return (
    <section className="card p-5">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[var(--muted)]">
        <span>{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function OwnerResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  const owners = Array.from(new Map(cases.map((item) => [item.registrationNumber, item])).values());

  if (owners.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {owners.map((item) => (
        <Link className="rounded-lg border border-[#3d3d3a] bg-[#242422] p-4 text-sm font-bold" href={`/cases/${item.registrationNumber}`} key={item.id}>
          <div className="text-base font-extrabold">{item.driverName}</div>
          <div className="mt-1 text-[#7fb1ef]">{item.registrationNumber}</div>
          <div className="mt-2 text-[var(--muted)]">
            {item.vehicleModel} · {item.color} · {item.manufactureYear}
          </div>
        </Link>
      ))}
    </div>
  );
}

function ViolationResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  if (cases.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#3d3d3a]">
      {cases.map((item) => (
        <Link className="grid gap-2 border-b border-[#333331] p-4 text-sm font-bold last:border-b-0 md:grid-cols-[1fr_0.7fr_0.7fr_0.7fr]" href={`/cases/${item.registrationNumber}`} key={item.id}>
          <span>{item.driverName}</span>
          <span className="text-[#7fb1ef]">{item.registrationNumber}</span>
          <span>{item.violationDate}</span>
          <span>
            <span className={`rounded-full px-3 py-1 text-xs ${badgeTone(item.violationCode)}`}>{item.violationCode}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function OffenderResults({ cases }: { cases: Awaited<ReturnType<typeof getCases>> }) {
  if (cases.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 grid gap-3 md:grid-cols-2">
      {cases.map((item) => (
        <div className="rounded-lg border border-[#3d3d3a] bg-[#242422] p-4 text-sm font-bold" key={item.licenseNumber}>
          <div className="text-base font-extrabold">{item.driverName}</div>
          <div className="mt-1 text-[var(--muted)]">{item.licenseNumber}</div>
        </div>
      ))}
    </div>
  );
}

function StatsResults({ stats }: { stats: { model: string; year: number; count: number }[] }) {
  if (stats.length === 0) return <EmptyResult />;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-[#3d3d3a]">
      {stats.map((item) => (
        <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-[#333331] p-4 text-sm font-bold last:border-b-0" key={`${item.model}-${item.year}`}>
          <span>{item.model}</span>
          <span className="text-[var(--muted)]">{item.year}</span>
          <span className="text-[#7fb1ef]">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyResult() {
  return <div className="mt-4 rounded-lg border border-[#3d3d3a] bg-[#242422] p-4 text-sm font-bold text-[var(--muted)]">No matching data found.</div>;
}
