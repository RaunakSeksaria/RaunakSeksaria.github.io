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

const workChildren: Node[] = allProjects.map((project) => ({
  name: project.slug,
  dir: false,
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

/** Also rendered on the overview, so the interface teaches itself on landing. */
export const COMMANDS = [
  ['ls', 'list what is here'],
  ['cd', 'change directory'],
  ['cat', 'show an entry in the pane'],
  ['open', 'open a full write-up'],
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

    case 'ls': {
      const { segments, node } = resolve(cwd, arg);
      if (!node) return { ...still, lines: [{ text: `ls: no such path: ${arg}`, tone: 'error' }] };
      if (!node.dir) return { ...still, lines: [{ text: formatCwd(segments) }] };
      return { ...still, lines: listing(node) };
    }

    case 'cd': {
      const { segments, node } = resolve(cwd, arg ?? '~');
      if (!node) {
        const here = walk(cwd);
        const suggestion = nearest(arg ?? '', (here?.children ?? []).map((c) => c.name));
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
      const { node } = resolve(cwd, arg);
      if (!node) {
        const here = walk(cwd);
        const suggestion = nearest(arg, (here?.children ?? []).map((c) => c.name));
        return {
          ...still,
          lines: [
            { text: `cat: no such entry: ${arg}`, tone: 'error' },
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
      const { node } = resolve(cwd, arg);
      if (!node?.href) {
        return {
          ...still,
          lines: [
            { text: `open: nothing written up for ${arg}`, tone: 'error' },
            { text: 'try: ls work', tone: 'dim' },
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
  const matches = names.filter((name) => name.startsWith(namePart));

  if (matches.length === 1) {
    const head = parts.slice(0, -1).join(' ');
    const completed = (dirPart ? `${dirPart}/` : '') + matches[0];
    return { value: `${head} ${completed}`, candidates: [] };
  }
  return { value: input, candidates: matches };
}
