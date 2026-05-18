import Link from "next/link";

export default function NotFound() {
  return (
    <main className="shell">
      <h1 className="mb-4 text-2xl font-extrabold">Case not found</h1>
      <Link className="text-sm font-bold text-[#7fb1ef]" href="/all-cases">
        Back to all cases
      </Link>
    </main>
  );
}
