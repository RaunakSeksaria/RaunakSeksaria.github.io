import type { Project } from '@/data/types';
import { BlockList, SectionHead, StackLine } from './Blocks';

/**
 * A case study, in the order a reader actually wants it: what the problem was,
 * what was built, what the measurements said, what contradicted the
 * expectation, and what the result does not cover.
 */
export default function CaseStudyView({ project }: { project: Project }) {
  const study = project.caseStudy;
  if (!study) return null;

  return (
    <article className="space-y-9">
      <header className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="text-xl font-medium tracking-tight text-ink">{project.title}</h1>
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mono shrink-0 text-xs text-dim transition-colors hover:text-accent"
          >
            repo <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
        <StackLine stack={project.stack} />
        {project.disclosure && (
          <p className="prose-block border-l-2 border-rule pl-3 text-xs leading-relaxed text-dim">
            {project.disclosure}
          </p>
        )}
      </header>

      <section className="space-y-3">
        <SectionHead label="problem" />
        <p className="prose-block text-sm leading-relaxed">{study.problem}</p>
      </section>

      <section className="space-y-3">
        <SectionHead label="approach" />
        <BlockList blocks={study.approach} />
      </section>

      <section className="space-y-3">
        <SectionHead label="what I measured" />
        <BlockList blocks={study.measured} />
      </section>

      <section className="space-y-3">
        <SectionHead label="what the measurements showed" />
        <BlockList blocks={study.surprised} />
      </section>

      <section className="space-y-3">
        <SectionHead label="limitations" />
        <ul className="prose-block space-y-2 text-sm text-dim">
          {study.limitations.map((limitation) => (
            <li key={limitation} className="flex gap-2.5">
              <span aria-hidden="true" className="mono select-none text-faint">
                &#9702;
              </span>
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
