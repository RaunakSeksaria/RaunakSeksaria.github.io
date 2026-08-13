import Link from 'next/link';
import { profile, stats } from '@/data/profile';
import { roles } from '@/data/experience';
import { featured, other } from '@/data/projects';
import { education, certifications, coursework } from '@/data/education';
import { skillGroups, openSource } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { activities } from '@/data/activities';
import { socialMediaIcons } from '@/data/socialMedia';
import type { View } from '@/data/timeline';
import { BlockList, Finding, SectionHead, StackLine } from './Blocks';

/** Title row for a pane: heading, dim meta, optional outbound link. */
function PaneHeader({
  title,
  meta,
  link,
}: {
  title: string;
  meta?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-lg font-medium leading-snug text-ink">{title}</h1>
        {link && (
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mono shrink-0 text-xs text-dim transition-colors hover:text-accent"
          >
            {link.label} <span aria-hidden="true">&#8599;</span>
          </a>
        )}
      </div>
      {meta && <p className="mono mt-1 text-xs text-dim">{meta}</p>}
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="prose-block space-y-2 text-sm">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span aria-hidden="true" className="mono select-none text-faint">
            &#9702;
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DiffPane({ view }: { view: View }) {
  switch (view.view) {
    case 'overview':
      return (
        <article className="space-y-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-ink">{profile.name}</h1>
            <p className="mono mt-1.5 text-xs text-dim">
              {profile.disciplines.join(' · ')}
            </p>
          </div>

          <p className="prose-block text-[15px] leading-relaxed">{profile.statement}</p>

          <div>
            <SectionHead label="at a glance" />
            <dl className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
              <div>
                <dt className="mono text-[11px] uppercase tracking-wider text-faint">
                  degree
                </dt>
                <dd className="mt-0.5 text-sm">{profile.degree}</dd>
              </div>
              <div>
                <dt className="mono text-[11px] uppercase tracking-wider text-faint">
                  based in
                </dt>
                <dd className="mt-0.5 text-sm">{profile.location}</dd>
              </div>
            </dl>
          </div>

          <p className="mono flex flex-wrap gap-x-4 gap-y-1 border-t border-rule pt-4 text-xs text-dim">
            {stats.map((stat) => (
              <span key={stat.label}>
                <span className="text-ink">{stat.value}</span> {stat.label}
              </span>
            ))}
          </p>
        </article>
      );

    case 'role': {
      const role = roles.find((candidate) => candidate.id === view.roleId);
      if (!role) return null;
      return (
        <article className="space-y-5">
          <PaneHeader
            title={role.title}
            meta={`${role.org} · ${role.period}`}
            link={role.repoUrl ? { href: role.repoUrl, label: 'repo' } : undefined}
          />
          {role.stack && <StackLine stack={role.stack} />}
          <Bullets items={role.bullets} />
          {role.finding && <Finding finding={role.finding} />}
          {role.aside && (
            <p className="prose-block border-l-2 border-rule pl-3 text-xs leading-relaxed text-dim">
              {role.aside}
            </p>
          )}
        </article>
      );
    }

    case 'project': {
      const project = featured.find((candidate) => candidate.slug === view.slug);
      if (!project) return null;
      return (
        <article className="space-y-5">
          <PaneHeader
            title={project.title}
            link={{ href: project.repoUrl, label: 'repo' }}
          />
          <StackLine stack={project.stack} />
          {project.disclosure && (
            <p className="prose-block border-l-2 border-rule pl-3 text-xs leading-relaxed text-dim">
              {project.disclosure}
            </p>
          )}
          <p className="prose-block text-sm leading-relaxed">{project.summary}</p>
          <Bullets items={project.highlights} />
          {project.caseStudy && (
            <Link
              href={`/work/${project.slug}/`}
              className="mono inline-flex items-center gap-2 text-xs text-accent transition-opacity hover:opacity-80"
            >
              read the case study <span aria-hidden="true">&rarr;</span>
            </Link>
          )}
        </article>
      );
    }

    case 'otherWork':
      return (
        <article className="space-y-6">
          <PaneHeader
            title="Other repositories"
            meta="Public, linked, without a full case study"
          />
          <ul className="space-y-5">
            {other.map((project) => (
              <li key={project.slug} className="border-b border-rule pb-5 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-sm font-medium text-ink">{project.title}</h2>
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mono shrink-0 text-xs text-dim transition-colors hover:text-accent"
                  >
                    repo <span aria-hidden="true">&#8599;</span>
                  </a>
                </div>
                <div className="mt-1.5">
                  <StackLine stack={project.stack} />
                </div>
                <p className="prose-block mt-2 text-sm leading-relaxed text-dim">
                  {project.summary}
                </p>
              </li>
            ))}
          </ul>
        </article>
      );

    case 'education':
      return (
        <article className="space-y-6">
          <PaneHeader title="Education" />
          <ul className="space-y-5">
            {education.map((school) => (
              <li key={school.name} className="border-b border-rule pb-5 last:border-0 last:pb-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-sm font-medium text-ink">
                    {school.href ? (
                      <a
                        href={school.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-accent"
                      >
                        {school.name}
                      </a>
                    ) : (
                      school.name
                    )}
                  </h2>
                  <p className="mono shrink-0 text-xs text-accent">
                    {school.results.join(' · ')}
                  </p>
                </div>
                <p className="mono mt-1 text-xs text-faint">
                  {school.place} · {school.period}
                </p>
                <p className="prose-block mt-2 text-sm text-dim">{school.detail}</p>
              </li>
            ))}
          </ul>

          <div>
            <SectionHead label="certifications" />
            <ul className="mt-3 space-y-2">
              {certifications.map((certification) => (
                <li key={certification.title} className="text-sm">
                  {certification.title}
                  <span className="mono mt-0.5 block text-xs text-faint">
                    {certification.issuer}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      );

    case 'skills':
      return (
        <article className="space-y-6">
          <PaneHeader title="Skills" />
          <dl className="space-y-4">
            {skillGroups.map((group) => (
              <div key={group.label}>
                <dt className="mono text-[11px] uppercase tracking-wider text-faint">
                  {group.label}
                </dt>
                <dd className="mono mt-1 text-sm leading-relaxed text-ink">
                  {group.items.join('  ·  ')}
                </dd>
              </div>
            ))}
          </dl>

          <div>
            <SectionHead label="open source" />
            <ul className="mt-3 space-y-2">
              {openSource.map((entry) => (
                <li key={entry.prLabel} className="text-sm">
                  <a
                    href={entry.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition-colors hover:text-accent"
                  >
                    {entry.project}
                    <span className="mono ml-2 text-xs text-accent">
                      {entry.prLabel} <span aria-hidden="true">&#8599;</span>
                    </span>
                  </a>
                  <span className="mt-0.5 block text-sm text-dim">{entry.contribution}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      );

    case 'achievements':
      return (
        <article className="space-y-5">
          <PaneHeader title="Achievements" />
          <ul className="space-y-3.5">
            {achievements.map((achievement) => (
              <li key={achievement.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h2 className="text-sm text-ink">{achievement.title}</h2>
                  {achievement.result && (
                    <p className="mono shrink-0 text-xs text-accent">{achievement.result}</p>
                  )}
                </div>
                {achievement.detail && (
                  <p className="prose-block mt-1 text-sm text-dim">{achievement.detail}</p>
                )}
                {achievement.issuer && (
                  <p className="mono mt-0.5 text-xs text-faint">{achievement.issuer}</p>
                )}
              </li>
            ))}
          </ul>
        </article>
      );

    case 'activities':
      return (
        <article className="space-y-6">
          <PaneHeader title="Activities" />
          <ul className="space-y-5">
            {activities.map((activity) => (
              <li key={activity.title} className="border-b border-rule pb-5 last:border-0 last:pb-0">
                <h2 className="text-sm font-medium text-ink">{activity.title}</h2>
                <p className="mono mt-0.5 text-xs text-faint">
                  {[activity.org, activity.period].filter(Boolean).join(' · ')}
                </p>
                <div className="mt-2.5">
                  <Bullets items={activity.bullets} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      );

    case 'coursework':
      return (
        <article className="space-y-5">
          <PaneHeader title="Relevant coursework" meta="IIIT Hyderabad" />
          <ul className="mono grid gap-y-1.5 text-sm sm:grid-cols-2">
            {coursework.map((course) => (
              <li key={course} className="flex gap-2.5">
                <span aria-hidden="true" className="select-none text-faint">
                  &#9702;
                </span>
                <span className="text-dim">{course}</span>
              </li>
            ))}
          </ul>
        </article>
      );

    case 'contact':
      return (
        <article className="space-y-6">
          <PaneHeader title="Get in touch" />
          <dl className="space-y-3">
            {profile.emails.map((email) => (
              <div key={email}>
                <dt className="mono text-[11px] uppercase tracking-wider text-faint">
                  email
                </dt>
                <dd className="mono mt-0.5 text-sm">
                  <a
                    href={`mailto:${email}`}
                    className="text-ink transition-colors hover:text-accent"
                  >
                    {email}
                  </a>
                </dd>
              </div>
            ))}
            <div>
              <dt className="mono text-[11px] uppercase tracking-wider text-faint">phone</dt>
              <dd className="mono mt-0.5 text-sm">
                <a
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  className="text-ink transition-colors hover:text-accent"
                >
                  {profile.phone}
                </a>
              </dd>
            </div>
          </dl>

          <div>
            <SectionHead label="elsewhere" />
            <ul className="mt-3 space-y-2">
              {socialMediaIcons.map((social) => (
                <li key={social.name} className="mono text-sm">
                  <span className="text-faint">{social.name.toLowerCase()}</span>{' '}
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink transition-colors hover:text-accent"
                  >
                    {social.handle} <span aria-hidden="true">&#8599;</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </article>
      );
  }
}

/** Re-exported so the case-study route can reuse the block renderer. */
export { BlockList };
