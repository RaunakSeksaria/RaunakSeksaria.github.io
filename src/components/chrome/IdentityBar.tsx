import Link from 'next/link';
import { profile } from '@/data/profile';

/**
 * The title bar. Sticky rather than fixed, so it yields vertical space on a
 * phone once you start reading.
 */
export default function IdentityBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-rule bg-canvas/95 backdrop-blur-[2px]">
      {/*
        Fixed 48px tall from sm upwards so the sticky spine in Browser can offset
        against a known height rather than an approximation.
      */}
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-2.5 sm:h-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0 sm:px-6">
        <Link
          href="/"
          className="mono text-sm font-medium tracking-tight text-ink transition-colors hover:text-accent"
        >
          {profile.name}
        </Link>

        <p className="mono flex flex-wrap items-baseline gap-x-2 text-xs text-dim">
          <span>{profile.institution}</span>
          <span aria-hidden="true" className="text-faint">
            &middot;
          </span>
          <span>{profile.period}</span>
          <span aria-hidden="true" className="text-faint">
            &middot;
          </span>
          <span>CGPA {profile.cgpa}</span>
        </p>
      </div>
    </header>
  );
}
