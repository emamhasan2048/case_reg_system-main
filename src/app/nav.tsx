import Link from "next/link";

export function AppNav() {
  return (
    <header className="mb-9 border-b border-[#333331] pb-5">
      <div className="app-topbar">
        <Link className="flex items-center gap-3" href="/">
          <span className="brand-mark">FC</span>
          <span>
            <span className="block text-base font-extrabold">Future Cases</span>
            <span className="block text-xs font-bold text-[var(--muted)]">Traffic registry system</span>
          </span>
        </Link>
      </div>

      <nav className="flex flex-wrap gap-3">
        <Link className="nav-button" href="/">
          <span className="text-xl leading-none">+</span>
          Register case
        </Link>
        <Link className="nav-button" href="/all-cases">
          <span className="text-lg leading-none">☷</span>
          All cases
        </Link>
        <Link className="nav-button" href="/overview">
          <span className="text-lg leading-none">◈</span>
          Overview
        </Link>
        <Link className="nav-button" href="/queries">
          <span className="text-lg leading-none">⌕</span>
          Queries
        </Link>
      </nav>
    </header>
  );
}
