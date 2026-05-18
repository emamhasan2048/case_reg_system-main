import { createCase } from "@/lib/cases";
import { violationOptions } from "@/lib/violations";
import Link from "next/link";
import { AppNav } from "./nav";

type Props = {
  searchParams: Promise<{ error?: string; success?: string }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const { error, success } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <main className="shell">
      <AppNav />

      <form action={createCase} className="max-w-[1296px]">
        <h1 className="mb-6 text-2xl font-extrabold">Register new case</h1>

        {success === "1" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-emerald-700 bg-emerald-950/40 px-4 py-3 text-sm font-extrabold text-emerald-200">
            <span>Case registered successfully.</span>
            <Link className="rounded-md border border-emerald-700 px-3 py-1.5 hover:bg-emerald-900/40" href="/all-cases">
              View all cases
            </Link>
          </div>
        )}

        {error === "database" && (
          <div className="mb-6 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm font-extrabold text-red-200">
            Case could not be registered because the database connection failed. Check your MongoDB URI, DNS, and network access, then try again.
          </div>
        )}

        <h2 className="mb-4 text-lg font-bold text-[var(--muted)]">Driver information</h2>
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <label>
            <span className="label">Full name</span>
            <input className="field" name="driverName" placeholder="e.g. Aleksas Jonaitis" required />
          </label>
          <label>
            <span className="label">License number</span>
            <input className="field" name="licenseNumber" placeholder="e.g. LT-00241" required />
          </label>
          <label className="md:col-span-2">
            <span className="label">Address</span>
            <input className="field" name="address" placeholder="e.g. Vilnius, Gedimino 5" required />
          </label>
        </div>

        <h2 className="mb-4 mt-7 text-lg font-bold text-[var(--muted)]">Vehicle information</h2>
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <label>
            <span className="label">Registration number</span>
            <input className="field" name="registrationNumber" placeholder="e.g. LTU-4821" required />
          </label>
          <label>
            <span className="label">Model</span>
            <input className="field" name="vehicleModel" placeholder="e.g. VW Golf" required />
          </label>
          <label>
            <span className="label">Color</span>
            <input className="field" name="color" placeholder="e.g. Gray" required />
          </label>
          <label>
            <span className="label">Year of manufacture</span>
            <input className="field" name="manufactureYear" placeholder="e.g. 2019" required type="number" min="1950" max="2035" />
          </label>
        </div>

        <h2 className="mb-4 mt-7 text-lg font-bold text-[var(--muted)]">Violation details</h2>
        <div className="grid gap-x-5 gap-y-4 md:grid-cols-2">
          <label>
            <span className="label">Violation code</span>
            <select className="field" name="violationCode" defaultValue="NB-04" required>
              {violationOptions.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code} - {item.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="label">Violation date</span>
            <input className="field" name="violationDate" defaultValue={today} required type="date" />
          </label>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button className="nav-button" type="submit">
            ✓ Register case
          </button>
          <button className="nav-button" type="reset">
            Clear
          </button>
        </div>
      </form>
    </main>
  );
}
