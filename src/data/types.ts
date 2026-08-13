/**
 * Shared shapes for the site's content.
 *
 * Rule for everyone editing src/data/*: every quantified claim carries a
 * trailing comment naming the file it came from in the source repo. If you
 * cannot cite it, it does not go on the site.
 */

/** A measured table. Numbers render right-aligned with tabular figures. */
export type Measurement = {
  columns: string[];
  rows: string[][];
  /** Which columns hold numbers, 0-indexed. Those get right-aligned. */
  numeric?: number[];
  /** Method / hardware / reproduction note, rendered dim beneath the table. */
  note?: string;
};

/**
 * The signature element: what was expected against what the measurement
 * actually said. Rendered as a two-line diff.
 */
export type Finding = {
  suspected: string;
  found: string;
};

/** One block in a "diff" pane. */
export type Block =
  | { kind: 'prose'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'table'; table: Measurement }
  | { kind: 'finding'; finding: Finding }
  | { kind: 'pairs'; pairs: [string, string][] }
  | { kind: 'note'; text: string };

/** A case study, shown on /work/<slug>. */
export type CaseStudy = {
  problem: string;
  approach: Block[];
  measured: Block[];
  surprised: Block[];
  limitations: string[];
};

export type Project = {
  slug: string;
  title: string;
  /** Shown dim next to the title in the spine. */
  period?: string;
  repoUrl: string;
  /** Rendered as dim mono joined by "·". Never as tinted chips. */
  stack: string[];
  summary: string;
  highlights: string[];
  /** Set only for the featured five; drives /work/<slug>. */
  caseStudy?: CaseStudy;
  /** Honest disclosure rendered beneath the title (team credit, repo naming). */
  disclosure?: string;
};

export type Role = {
  id: string;
  title: string;
  org: string;
  period: string;
  stack?: string[];
  repoUrl?: string;
  bullets: string[];
  finding?: Finding;
  /** Extra detail that no résumé variant carries, but the repo supports. */
  aside?: string;
};

/** A node in the commit spine. */
export type SpineNode = {
  id: string;
  label: string;
  meta?: string;
  /** Sub-lines rendered as ○ beneath the node. */
  children?: string[];
  /** When set, selecting the node navigates instead of swapping the pane. */
  href?: string;
};
