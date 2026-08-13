/**
 * Union of the two résumé variants: resume.tex adds SQL, scikit-learn and
 * LangChain; the compiled PDF adds FastAPI, NetworkX, FFmpeg and libpcap.
 * A website has no one-page limit, so it carries both.
 */
export const skillGroups: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['Python', 'C++', 'C', 'JavaScript', 'Java', 'SQL'],
  },
  {
    label: 'Web',
    items: ['React', 'React Native', 'Next.js', 'Flask', 'FastAPI', 'Express.js'],
  },
  {
    label: 'Libraries',
    items: [
      'NumPy',
      'Pandas',
      'NetworkX',
      'PyTorch',
      'PyTorch Geometric',
      'scikit-learn',
      'XGBoost',
      'LangChain',
      'FFmpeg',
      'libpcap',
    ],
  },
  {
    label: 'Databases',
    items: ['MySQL', 'SQLite', 'MongoDB'],
  },
  {
    label: 'Testing & tools',
    items: [
      'pytest',
      'Valgrind',
      'ASan/UBSan',
      'perf',
      'clang-tidy',
      'gcc -fanalyzer',
      'Git',
      'Linux',
      'GitHub Actions',
      'Bash',
      'Wireshark',
      'Postman',
    ],
  },
];

export const openSource = [
  {
    project: 'MDN Web Docs',
    contribution: 'Improved the JavaScript closures guide.',
    prLabel: 'mdn/content#37826',
    href: 'https://github.com/mdn/content/pull/37826', // verified live, merged
  },
];
