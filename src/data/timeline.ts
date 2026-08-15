import { roles } from './experience';
import { featured, other } from './projects';

/** What the right-hand pane renders for a given spine node. */
export type View =
  | { view: 'overview' }
  | { view: 'role'; roleId: string }
  | { view: 'project'; slug: string }
  | { view: 'otherWork' }
  | { view: 'education' }
  | { view: 'skills' }
  | { view: 'achievements' }
  | { view: 'activities' }
  | { view: 'coursework' }
  | { view: 'contact' };

export type SpineEntry = {
  id: string;
  label: string;
  /** Dim, right-aligned in the spine. */
  meta?: string;
  /** ○ sub-lines beneath the node - the reason to open it. */
  children?: string[];
  /** Present only for nodes that navigate to their own page. */
  href?: string;
  content: View;
};

export type SpineGroup = {
  label: string;
  entries: SpineEntry[];
};

const roleMeta: Record<string, { children: string[] }> = {
  researcher: { children: ['geopolitical networks, blocs and cooperation'] },
  ta: { children: ['275+ students, 10+ tutorials'] },
  'product-labs': { children: ['measured lag 21.6 s → ~3 s'] },
  'parent-diaries': { children: ['team of 4 · Whisper · Socket.IO'] },
};

const featuredHooks: Record<string, string[]> = {
  'shared-file-system': ['46 integration tests, ASan in CI'],
  'bytecode-engine': ['~30× a tree-walker, zero allocations'],
  'ews-financial-networks': ['where an interbank market fragments'],
  'fraud-detection': ['0.79 illicit-F1, and a collapse at step 43'],
  minicrypt: ['no third-party crypto dependencies'],
  // Second tier now, but still written up at /work/relational-dbms.
  'relational-dbms': ['48 ms → 1.3 ms, 67× fewer rows'],
};

export const spine: SpineGroup[] = [
  {
    label: 'head',
    entries: [{ id: 'overview', label: 'Overview', content: { view: 'overview' } }],
  },
  {
    label: 'experience',
    entries: roles.map((role) => ({
      id: role.id,
      label: role.title,
      meta: role.period,
      children: roleMeta[role.id]?.children,
      content: { view: 'role', roleId: role.id } as View,
    })),
  },
  {
    label: 'featured work',
    entries: featured.map((project) => ({
      id: project.slug,
      label: project.title,
      children: featuredHooks[project.slug],
      href: `/work/${project.slug}/`,
      content: { view: 'project', slug: project.slug } as View,
    })),
  },
  {
    label: 'other work',
    entries: [
      {
        id: 'other-work',
        label: `${other.length} more repositories`,
        content: { view: 'otherWork' },
      },
    ],
  },
  {
    label: 'background',
    entries: [
      { id: 'education', label: 'Education', content: { view: 'education' } },
      { id: 'skills', label: 'Skills & open source', content: { view: 'skills' } },
      { id: 'achievements', label: 'Achievements', content: { view: 'achievements' } },
      { id: 'activities', label: 'Activities', content: { view: 'activities' } },
      { id: 'coursework', label: 'Coursework', content: { view: 'coursework' } },
    ],
  },
  {
    label: 'contact',
    entries: [{ id: 'contact', label: 'Get in touch', content: { view: 'contact' } }],
  },
];

/** Flat order, used for j/k navigation and the [n/total] status indicator. */
export const spineOrder: SpineEntry[] = spine.flatMap((group) => group.entries);
