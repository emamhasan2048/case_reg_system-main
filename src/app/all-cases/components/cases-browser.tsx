"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CaseView } from "@/lib/cases";
import { badgeTone } from "@/lib/violations";
import { CaseActions } from "./case-actions";

type StatusFilter = "all" | "pending" | "completed";

export function CasesBrowser({ cases }: { cases: CaseView[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filteredCases = useMemo(() => {
    const search = query.trim().toLowerCase();

    return cases.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesSearch =
        !search ||
        item.driverName.toLowerCase().includes(search) ||
        item.registrationNumber.toLowerCase().includes(search) ||
        item.licenseNumber.toLowerCase().includes(search) ||
        item.vehicleModel.toLowerCase().includes(search) ||
        item.violationCode.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [cases, query, status]);

  return (
    <>
      <div className="card mb-5 grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
        <input
          className="field"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by driver, reg. number, license, model, violation..."
          type="search"
          value={query}
        />
        <div className="flex flex-wrap gap-2">
          <FilterButton active={status === "all"} onClick={() => setStatus("all")}>
            All
          </FilterButton>
          <FilterButton active={status === "pending"} onClick={() => setStatus("pending")}>
            Pending
          </FilterButton>
          <FilterButton active={status === "completed"} onClick={() => setStatus("completed")}>
            Completed
          </FilterButton>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_1.2fr] border-b border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-sm font-extrabold text-[var(--muted)] max-lg:hidden">
          <div>Driver name</div>
          <div>Reg. number</div>
          <div>Date</div>
          <div>Violation</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {filteredCases.length === 0 ? (
          <div className="p-8 text-center text-sm font-bold text-[var(--muted)]">No cases match your filters.</div>
        ) : (
          filteredCases.map((item) => (
            <div
              className="grid gap-3 border-b border-[#333331] px-5 py-3 text-sm font-bold last:border-b-0 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr_0.9fr_1.2fr] lg:items-center"
              key={item.id}
            >
              <div className="truncate">{item.driverName}</div>
              <Link className="text-[#7fb1ef]" href={`/cases/${item.registrationNumber}`}>
                {item.registrationNumber}
              </Link>
              <div>{item.violationDate}</div>
              <div>
                <span className={`rounded-full px-3 py-1 text-base font-extrabold ${badgeTone(item.violationCode)}`}>
                  {item.violationCode}
                </span>
              </div>
              <CaseActions id={item.id} initialStatus={item.status} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={`rounded-md border px-3 py-2 text-xs font-extrabold transition ${
        active
          ? "border-[#7fb1ef] bg-[#7fb1ef] text-[#101412]"
          : "border-[#50504d] bg-[#2c2c2a] text-[var(--muted)] hover:border-[#7fb1ef]"
      }`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
