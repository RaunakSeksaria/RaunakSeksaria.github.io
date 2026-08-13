import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { featured } from '@/data/projects';
import { profile } from '@/data/profile';
import type { SpineGroup } from '@/data/timeline';
import CaseStudyView from '@/components/chrome/CaseStudyView';
import CommitSpine from '@/components/chrome/CommitSpine';
import IdentityBar from '@/components/chrome/IdentityBar';
import StatusBar from '@/components/chrome/StatusBar';

type Params = { slug: string };

/** One static page per featured project; nothing else is routable here. */
export function generateStaticParams(): Params[] {
  return featured.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const project = featured.find((candidate) => candidate.slug === params.slug);
  if (!project) return {};

  const title = `${project.title} - ${profile.name}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: { title, description: project.summary, type: 'article' },
  };
}

/** The spine on a case study navigates between the featured five. */
const featuredGroups: SpineGroup[] = [
  {
    label: 'featured work',
    entries: featured.map((project) => ({
      id: project.slug,
      label: project.title,
      href: `/work/${project.slug}/`,
      content: { view: 'project', slug: project.slug },
    })),
  },
];

export default function WorkPage({ params }: { params: Params }) {
  const project = featured.find((candidate) => candidate.slug === params.slug);
  if (!project) notFound();

  return (
    <>
      <IdentityBar />

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <nav aria-label="Breadcrumb" className="mono py-4 text-xs text-dim">
          <Link href="/" className="transition-colors hover:text-accent">
            ~
          </Link>
          <span aria-hidden="true" className="text-faint">
            /
          </span>
          <Link href="/#other-work" className="transition-colors hover:text-accent">
            work
          </Link>
          <span aria-hidden="true" className="text-faint">
            /
          </span>
          <span className="text-ink">{project.slug}</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-10">
          <div className="border-b border-rule pb-5 lg:sticky lg:top-[49px] lg:h-fit lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6 lg:pt-2">
            <CommitSpine groups={featuredGroups} selectedId={project.slug} />
            <Link
              href="/"
              className="mono mt-2 inline-flex items-center gap-2 text-xs text-dim transition-colors hover:text-accent"
            >
              <span aria-hidden="true">&larr;</span> back to the index
            </Link>
          </div>

          <main className="py-6">
            <CaseStudyView project={project} />
          </main>
        </div>
      </div>

      <StatusBar context={`~/work/${project.slug}`} />
    </>
  );
}
