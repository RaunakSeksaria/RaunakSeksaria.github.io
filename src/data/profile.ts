export const profile = {
  name: 'Raunak Seksaria',
  /** Terse and factual. No "enthusiast", no "passionate". */
  disciplines: ['Systems', 'Performance', 'Graph learning'],
  degree: 'B.Tech in Computer Science + MS in Computational Natural Sciences by Research',
  institution: 'IIIT Hyderabad',
  period: '2023 - 2028 (expected)',
  cgpa: '9.01', // resume.tex: "CGPA : 9.01"
  /**
   * The one line that has to earn attention. Every clause maps to a real repo,
   * so the tone stays curious rather than boastful: C-Shell, the bytecode VM
   * that replaced a tree-walker, S.H.A.M. over UDP, MiniCrypt's hand-typed AES
   * S-box, and perf/rdtsc in the bytecode benchmarks.
   */
  statement:
    'coding is cool. nerd that loves building stuff, because I am cool :)',
  emails: [
    'seksariaraunak@gmail.com',
    'raunak.seksaria@research.iiit.ac.in',
  ],
  phone: '+91 7003121509',
  location: 'Kolkata, India',
};

/**
 * Counts shown on the overview. Each must be checkable by a reader who clicks
 * through, so keep these in step with the data below and do not add a figure
 * that cannot be counted on the site itself.
 */
export const stats = [
  // 5 featured + 5 other, plus Product-Labs and Parent_Diaries from the roles.
  { label: 'public repositories', value: '12' },
  { label: 'written up in depth', value: '5' },
  { label: 'merged MDN PR', value: '1' }, // mdn/content#37826
];
