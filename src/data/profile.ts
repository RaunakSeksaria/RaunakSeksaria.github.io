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

/** Verifiable counts for the status bar. Update alongside the data below. */
export const stats = [
  { label: 'repos', value: '10' }, // featured 5 + other 5, all public and linked
  { label: 'negative results', value: '3' }, // dispatch study, sargable rewrite, GNNs vs XGBoost
  { label: 'merged MDN PR', value: '1' }, // mdn/content#37826
];
