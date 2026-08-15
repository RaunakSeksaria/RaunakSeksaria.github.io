/**
 * The command line's brain.
 *
 * Everything here is pure: no DOM, no React, no router. The component feeds in
 * a line of input plus the current directory and gets back output lines and an
 * effect to apply. That keeps the interesting logic testable and stops the
 * filesystem from becoming a second, drifting copy of the content - every node
 * below is derived from src/data.
 */

import { profile } from '@/data/profile';
import { allProjects, casedProjects, featured } from '@/data/projects';
import { roles } from '@/data/experience';
import { certifications, coursework, education } from '@/data/education';
import { openSource, skillGroups } from '@/data/skills';
import { achievements } from '@/data/achievements';
import { activities } from '@/data/activities';
import type { Block } from '@/data/types';

export type Effect =
  | { type: 'none' }
  | { type: 'select'; id: string }
  | { type: 'navigate'; href: string }
  | { type: 'theme' }
  | { type: 'resume' }
  | { type: 'clear' };

export type Line = { text: string; tone?: 'dim' | 'error' | 'accent' };

export type Result = {
  cwd: string;
  lines: Line[];
  effect: Effect;
};

type Node = {
  name: string;
  dir: boolean;
  /** Other spellings that should resolve here, e.g. the human title. */
  aliases?: string[];
  /** Spine entry to select when this is `cat`-ed or `cd`-ed into. */
  selectId?: string;
  /** Route to push on `open`. */
  href?: string;
  /** Right-hand annotation in `ls`. */
  note?: string;
  children?: Node[];
};

/* ------------------------------------------------------------------ */
/* The tree                                                            */
/* ------------------------------------------------------------------ */

/** Lowercase, punctuation to hyphens, so "Buy, Sell, Rent" finds buy-sell-rent. */
const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const workChildren: Node[] = allProjects.map((project) => ({
  name: project.slug,
  dir: false,
  aliases: [slugify(project.title)],
  // Non-featured projects have no spine row of their own; they live in the
  // "other work" pane, so that is what `cat` should surface.
  selectId: featured.some((f) => f.slug === project.slug) ? project.slug : 'other-work',
  href: casedProjects.some((c) => c.slug === project.slug)
    ? `/work/${project.slug}/`
    : undefined,
  note: project.stack.slice(0, 3).join(' '),
}));

const experienceChildren: Node[] = roles.map((role) => ({
  name: role.id,
  dir: false,
  selectId: role.id,
  note: role.period,
}));

const root: Node = {
  name: '~',
  dir: true,
  children: [
    { name: 'experience', dir: true, children: experienceChildren },
    { name: 'work', dir: true, selectId: 'other-work', children: workChildren },
    { name: 'education', dir: false, selectId: 'education' },
    { name: 'skills', dir: false, selectId: 'skills' },
    { name: 'achievements', dir: false, selectId: 'achievements' },
    { name: 'activities', dir: false, selectId: 'activities' },
    { name: 'coursework', dir: false, selectId: 'coursework' },
    { name: 'contact', dir: false, selectId: 'contact' },
    { name: 'resume.pdf', dir: false, note: 'download' },
  ],
};

/* ------------------------------------------------------------------ */
/* Search index                                                        */
/* ------------------------------------------------------------------ */

/** Flatten a case study's blocks into plain searchable strings. */
function blockText(blocks: Block[]): string[] {
  return blocks.flatMap((block) => {
    switch (block.kind) {
      case 'prose':
      case 'note':
        return [block.text];
      case 'bullets':
        return block.items;
      case 'pairs':
        return block.pairs.map(([key, value]) => `${key}: ${value}`);
      case 'finding':
        return [block.finding.suspected, block.finding.found];
      case 'table':
        return [
          ...block.table.rows.map((row) => row.join('  ')),
          ...(block.table.note ? [block.table.note] : []),
        ];
      default:
        return [];
    }
  });
}

/**
 * Everything grep can see, keyed by the same paths the tree uses so a hit tells
 * you exactly what to `cat` or `open` next.
 */
const searchIndex: { path: string; lines: string[] }[] = [
  ...allProjects.map((project) => ({
    path: `work/${project.slug}`,
    lines: [
      project.title,
      project.summary,
      project.stack.join('  '),
      ...(project.disclosure ? [project.disclosure] : []),
      ...project.highlights,
      ...(project.caseStudy
        ? [
            project.caseStudy.problem,
            ...blockText(project.caseStudy.approach),
            ...blockText(project.caseStudy.measured),
            ...blockText(project.caseStudy.surprised),
            ...project.caseStudy.limitations,
          ]
        : []),
    ],
  })),
  ...roles.map((role) => ({
    path: `experience/${role.id}`,
    lines: [
      `${role.title} - ${role.org}`,
      ...(role.stack ?? []),
      ...role.bullets,
      ...(role.finding ? [role.finding.suspected, role.finding.found] : []),
      ...(role.aside ? [role.aside] : []),
    ],
  })),
  {
    path: 'education',
    lines: [
      ...education.map((item) => `${item.name}, ${item.detail} (${item.results.join(', ')})`),
      ...certifications.map((item) => `${item.title} - ${item.issuer}`),
    ],
  },
  { path: 'coursework', lines: coursework },
  {
    path: 'skills',
    lines: [
      ...skillGroups.map((group) => `${group.label}: ${group.items.join('  ')}`),
      ...openSource.map((item) => `${item.project} ${item.prLabel} ${item.contribution}`),
    ],
  },
  {
    path: 'achievements',
    lines: achievements.map((item) =>
      [item.title, item.result, item.detail, item.issuer].filter(Boolean).join(' - '),
    ),
  },
  {
    path: 'activities',
    lines: activities.flatMap((activity) => [
      `${activity.title}${activity.org ? ` - ${activity.org}` : ''}`,
      ...activity.bullets,
    ]),
  },
];

/** A window of text around the match, so a hit reads as a result not a path. */
function snippet(line: string, needle: string): string {
  const at = line.toLowerCase().indexOf(needle);
  if (line.length <= 96) return line;
  const start = Math.max(0, at - 30);
  const end = Math.min(line.length, start + 96);
  return `${start > 0 ? '...' : ''}${line.slice(start, end).trim()}${end < line.length ? '...' : ''}`;
}

/* ------------------------------------------------------------------ */
/* Paths                                                               */
/* ------------------------------------------------------------------ */

/** A cwd is stored as segments below root, e.g. ['work']. */
export type Cwd = string[];

export const formatCwd = (cwd: Cwd) => (cwd.length ? `~/${cwd.join('/')}` : '~');

function walk(segments: string[]): Node | undefined {
  let node: Node = root;
  for (const segment of segments) {
    if (!node.children) return undefined;
    const next = node.children.find((child) => child.name === segment);
    if (!next) return undefined;
    node = next;
  }
  return node;
}

/** Resolve an argument against the cwd, honouring `~`, `.`, `..` and absolutes. */
function resolve(cwd: Cwd, arg?: string): { segments: string[]; node?: Node } {
  if (!arg || arg === '.') return { segments: cwd, node: walk(cwd) };

  const raw = arg.replace(/\/+$/, '');
  const absolute = raw === '~' || raw.startsWith('~/') || raw.startsWith('/');
  const parts = raw.replace(/^~\/?|^\//, '').split('/').filter(Boolean);

  const segments = absolute ? [] : [...cwd];
  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') segments.pop();
    else segments.push(part);
  }
  return { segments, node: walk(segments) };
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Find a node anywhere in the tree by its bare name.
 *
 * `cat` and `open` fall back to this when a path does not resolve against the
 * current directory. With ten projects nobody thinks in directories, so
 * `open minicrypt` has to work from anywhere - requiring `cd work` first would
 * be pedantry rather than fidelity.
 */
function findByName(name: string): Node | undefined {
  // People type the title they can see, not the slug, and they type spaces.
  const wanted = slugify(name);
  const queue: Node[] = [...(root.children ?? [])];
  while (queue.length) {
    const node = queue.shift() as Node;
    if (node.name === name || node.name === wanted || node.aliases?.includes(wanted)) {
      return node;
    }
    if (node.children) queue.push(...node.children);
  }
  return undefined;
}

/** Every name in the tree, for suggestions and completion. */
function allNames(): string[] {
  const names: string[] = [];
  const queue: Node[] = [...(root.children ?? [])];
  while (queue.length) {
    const node = queue.shift() as Node;
    names.push(node.name);
    if (node.children) queue.push(...node.children);
  }
  return names;
}

function distance(a: string, b: string): number {
  const grid = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      grid[i][j] = Math.min(
        grid[i - 1][j] + 1,
        grid[i][j - 1] + 1,
        grid[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return grid[a.length][b.length];
}

function nearest(word: string, options: string[]): string | undefined {
  let best: string | undefined;
  let bestScore = Infinity;
  for (const option of options) {
    const score = distance(word, option);
    if (score < bestScore) {
      bestScore = score;
      best = option;
    }
  }
  // Only suggest when it is plausibly a typo rather than a different word.
  return bestScore <= Math.max(2, Math.floor(word.length / 2)) ? best : undefined;
}

/**
 * Also rendered on the overview, so the interface teaches itself on landing.
 *
 * The cat/open distinction is the one people trip over, so both descriptions
 * name what actually happens rather than describing the verb.
 */
export const COMMANDS = [
  ['ls', 'list what is here'],
  ['cd', 'change directory, e.g. cd work'],
  ['cat', 'preview an entry in the panel, without leaving this page'],
  ['open', 'go to the full write-up on its own page, e.g. open minicrypt'],
  ['grep', 'search everything on this site, e.g. grep pytest'],
  ['pwd', 'print the current path'],
  ['whoami', 'the short version'],
  ['resume', 'download the PDF'],
  ['theme', 'switch light and dark'],
  ['help', 'this list'],
  ['clear', 'clear the output'],
] as const;

const listing = (node: Node): Line[] => {
  if (!node.children?.length) return [{ text: '(empty)', tone: 'dim' }];
  const width = Math.max(...node.children.map((child) => child.name.length));
  return node.children.map((child) => ({
    text: `${(child.name + (child.dir ? '/' : '')).padEnd(width + 3)}${child.note ?? ''}`,
    tone: child.dir ? 'accent' : undefined,
  }));
};

/* ------------------------------------------------------------------ */
/* Commands                                                            */
/* ------------------------------------------------------------------ */

export function run(input: string, cwd: Cwd): Result {
  const trimmed = input.trim();
  const still = { cwd: formatCwd(cwd), effect: { type: 'none' } as Effect };

  if (!trimmed) return { ...still, lines: [] };

  const [command, ...args] = trimmed.split(/\s+/);
  const arg = args[0];

  switch (command) {
    case 'help':
      return {
        ...still,
        lines: [
          { text: 'commands', tone: 'accent' },
          ...COMMANDS.map(([name, description]) => ({
            text: `  ${name.padEnd(9)}${description}`,
          })),
          { text: 'tab completes, up and down walk history', tone: 'dim' },
        ],
      };

    case 'clear':
      return { ...still, lines: [], effect: { type: 'clear' } };

    case 'pwd':
      return { ...still, lines: [{ text: formatCwd(cwd) }] };

    case 'whoami':
      return {
        ...still,
        lines: [
          { text: profile.name, tone: 'accent' },
          { text: profile.disciplines.join(' · '), tone: 'dim' },
          { text: `${profile.degree}, ${profile.institution}` },
        ],
      };

    case 'resume':
      return { ...still, lines: [{ text: 'downloading resume.pdf', tone: 'dim' }], effect: { type: 'resume' } };

    case 'theme':
      return { ...still, lines: [], effect: { type: 'theme' } };

    case 'grep': {
      const needle = args.join(' ').trim().toLowerCase();
      if (!needle) {
        return { ...still, lines: [{ text: 'grep: needs something to look for', tone: 'error' }] };
      }

      const lines: Line[] = [];
      let files = 0;
      let total = 0;

      for (const entry of searchIndex) {
        const hits = entry.lines.filter((line) => line.toLowerCase().includes(needle));
        if (!hits.length) continue;
        total += hits.length;
        files += 1;
        if (lines.length < 24) {
          lines.push({ text: entry.path, tone: 'accent' });
          for (const hit of hits.slice(0, 2)) {
            lines.push({ text: `  ${snippet(hit, needle)}` });
          }
          if (hits.length > 2) {
            lines.push({ text: `  and ${hits.length - 2} more here`, tone: 'dim' });
          }
        }
      }

      if (!total) {
        return { ...still, lines: [{ text: `grep: nothing matches ${needle}`, tone: 'dim' }] };
      }
      lines.push({
        text: `${total} match${total === 1 ? '' : 'es'} across ${files} entr${files === 1 ? 'y' : 'ies'}`,
        tone: 'dim',
      });
      return { ...still, lines };
    }

    case 'ls': {
      const { segments, node } = resolve(cwd, arg);
      if (!node) return { ...still, lines: [{ text: `ls: no such path: ${arg}`, tone: 'error' }] };
      if (!node.dir) return { ...still, lines: [{ text: formatCwd(segments) }] };
      return { ...still, lines: listing(node) };
    }

    case 'cd': {
      const { segments, node } = resolve(cwd, arg ?? '~');
      if (!node) {
        const suggestion = nearest(arg ?? '', allNames());
        return {
          ...still,
          lines: [
            { text: `cd: no such directory: ${arg}`, tone: 'error' },
            ...(suggestion ? [{ text: `did you mean ${suggestion}?`, tone: 'dim' as const }] : []),
          ],
        };
      }
      if (!node.dir) {
        return {
          ...still,
          lines: [{ text: `cd: not a directory: ${node.name}`, tone: 'error' }],
          effect: node.selectId ? { type: 'select', id: node.selectId } : { type: 'none' },
        };
      }
      return {
        cwd: formatCwd(segments),
        lines: [],
        effect: node.selectId ? { type: 'select', id: node.selectId } : { type: 'none' },
      };
    }

    case 'cat': {
      if (!arg) return { ...still, lines: [{ text: 'cat: needs a name', tone: 'error' }] };
      const query = args.join(' ');
      const node = resolve(cwd, arg).node ?? findByName(query);
      if (!node) {
        const suggestion = nearest(slugify(query), allNames());
        return {
          ...still,
          lines: [
            { text: `cat: no such entry: ${query}`, tone: 'error' },
            ...(suggestion ? [{ text: `did you mean ${suggestion}?`, tone: 'dim' as const }] : []),
          ],
        };
      }
      if (node.name === 'resume.pdf') {
        return { ...still, lines: [{ text: 'downloading resume.pdf', tone: 'dim' }], effect: { type: 'resume' } };
      }
      if (!node.selectId) return { ...still, lines: [{ text: `cat: ${node.name} is a directory`, tone: 'error' }] };
      return {
        ...still,
        lines: [{ text: `showing ${node.name}`, tone: 'dim' }],
        effect: { type: 'select', id: node.selectId },
      };
    }

    case 'open': {
      if (!arg) return { ...still, lines: [{ text: 'open: needs a name', tone: 'error' }] };
      const query = args.join(' ');
      const node = resolve(cwd, arg).node ?? findByName(query);
      if (!node?.href) {
        const suggestion = nearest(slugify(query), allNames());
        return {
          ...still,
          lines: [
            { text: `open: no write-up for ${query}`, tone: 'error' },
            {
              text: suggestion ? `did you mean ${suggestion}?` : 'try: ls work',
              tone: 'dim',
            },
          ],
        };
      }
      return { ...still, lines: [], effect: { type: 'navigate', href: node.href } };
    }

    default: {
      const suggestion = nearest(command, COMMANDS.map(([name]) => name));
      return {
        ...still,
        lines: [
          { text: `${command}: command not found`, tone: 'error' },
          {
            text: suggestion ? `did you mean ${suggestion}?` : 'type help for the list',
            tone: 'dim',
          },
        ],
      };
    }
  }
}

/* ------------------------------------------------------------------ */
/* Completion                                                          */
/* ------------------------------------------------------------------ */

/** Tab completion over the command name or the path argument. */
export function complete(input: string, cwd: Cwd): { value: string; candidates: string[] } {
  const parts = input.split(/\s+/);
  const commandNames = COMMANDS.map(([name]) => name);

  if (parts.length <= 1) {
    const matches = commandNames.filter((name) => name.startsWith(parts[0] ?? ''));
    if (matches.length === 1) return { value: `${matches[0]} `, candidates: [] };
    return { value: input, candidates: matches };
  }

  const partial = parts[parts.length - 1];
  const slash = partial.lastIndexOf('/');
  const dirPart = slash === -1 ? '' : partial.slice(0, slash);
  const namePart = slash === -1 ? partial : partial.slice(slash + 1);

  const { node } = resolve(cwd, dirPart || '.');
  const names = (node?.children ?? []).map((child) => child.name + (child.dir ? '/' : ''));
  let matches = names.filter((name) => name.startsWith(namePart));

  // cat and open resolve names from anywhere, so completion has to as well,
  // otherwise tab contradicts what the command will happily accept.
  if (!matches.length && !dirPart && (parts[0] === 'cat' || parts[0] === 'open')) {
    matches = allNames().filter((name) => name.startsWith(namePart));
  }

  if (matches.length === 1) {
    const head = parts.slice(0, -1).join(' ');
    const completed = (dirPart ? `${dirPart}/` : '') + matches[0];
    return { value: `${head} ${completed}`, candidates: [] };
  }
  return { value: input, candidates: matches };
}
