import Link from "next/link";
import { notFound } from "next/navigation";
import { getCasesByRegistration } from "@/lib/cases";
import { badgeTone } from "@/lib/violations";
import { AppNav } from "@/app/nav";

type Props = {
  params: Promise<{ registration: string }>;
};

export const dynamic = "force-dynamic";

export default async function CaseDetailsPage({ params }: Props) {
  const { registration } = await params;
  const cases = await getCasesByRegistration(decodeURIComponent(registration));

  if (cases.length === 0) notFound();

  const first = cases[0];

  return (
    <main className="shell">
      <AppNav />

      <Link className="mb-5 inline-block text-sm font-extrabold text-[var(--muted)]" href="/all-cases">
        ← Back to all cases
      </Link>

      <section className="card overflow-hidden">
        <header className="flex items-center gap-4 border-b border-[var(--border)] p-6">
          <div className="grid size-12 place-items-center rounded-full bg-[#24476f] text-base font-extrabold text-[#b9d0f2]">
            {first.driverName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold leading-tight">{first.driverName}</h1>
            <div className="text-sm font-bold text-[var(--muted)]">
              {first.registrationNumber} · {first.licenseNumber}
            </div>
          </div>
        </header>

        <div className="p-6">
          <h2 className="mb-4 text-lg font-extrabold text-[var(--muted)]">Driver & vehicle details</h2>

          <div className="mb-7 grid gap-y-4 text-sm font-extrabold md:grid-cols-2">
            <Detail label="Full name" value={first.driverName} />
            <Detail label="License no." value={first.licenseNumber} />
            <Detail label="Address" value={first.address} />
            <Detail label="Reg. number" value={first.registrationNumber} />
            <Detail label="Vehicle model" value={first.vehicleModel} />
            <Detail label="Color" value={first.color} />
            <Detail label="Year" value={String(first.manufactureYear)} />
            <Detail label="Total violations" value={String(cases.length)} />
          </div>

          <h2 className="mb-3 text-lg font-extrabold text-[var(--muted)]">All violations linked to this registration</h2>
          <div className="overflow-hidden rounded-2xl border border-[var(--border)]">
            <div className="grid grid-cols-[0.4fr_1fr_1fr] bg-[var(--panel-soft)] px-5 py-3 text-sm font-extrabold text-[var(--muted)]">
              <div>#</div>
              <div>Violation code</div>
              <div>Date</div>
            </div>
            {cases.map((item, index) => (
              <div className="grid grid-cols-[0.4fr_1fr_1fr] border-t border-[#333331] px-5 py-3 text-sm font-extrabold" key={item.id}>
                <div>{index + 1}</div>
                <div>
                  <span className={`rounded-full px-3 py-1 text-base ${badgeTone(item.violationCode)}`}>{item.violationCode}</span>
                </div>
                <div>{item.violationDate}</div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm font-extrabold text-[var(--muted)]">
            {cases.length} violation(s) recorded for {first.registrationNumber}
          </p>
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[var(--muted)]">{label}</div>
      <div>{value}</div>
    </div>
  );
}
