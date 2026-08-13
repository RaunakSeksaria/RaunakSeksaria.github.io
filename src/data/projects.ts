import type { Project } from './types';

/**
 * The featured five get a case study at /work/<slug>.
 *
 * Numbers here were checked against the source repos, not against the résumé.
 * Where the two disagreed the repo won; the trailing comments say where each
 * figure lives so a later edit can re-check it.
 */
export const featured: Project[] = [
  {
    slug: 'shared-file-system',
    title: 'Shared File System',
    repoUrl: 'https://github.com/RaunakSeksaria/Shared-file-system',
    stack: ['C', 'POSIX threads', 'TCP sockets', 'pytest', 'ASan', 'CI'],
    summary:
      'A distributed document store in C: a metadata name server, replicated storage servers, and a REPL client over a custom line-based TCP protocol, built so several people can edit one file at once and so a server can die mid-session without the reader noticing.',
    highlights: [
      'Built a metadata name server, replicated storage servers, and a REPL client over a custom line-based TCP protocol.',
      'Enabled concurrent multi-user editing through per-sentence write locks with stable IDs, and atomic, crash-safe file writes.',
      'Implemented heartbeat failure detection, primary-backup replication, and transparent read failover to promoted replicas.',
    ],
    caseStudy: {
      problem:
        'Two people editing the same document should not have to take turns, and a storage server dying should not cost a reader their request. Those two goals pull in opposite directions: fine-grained concurrency means more shared mutable state, and more shared state is exactly what makes failover hard to get right.',
      approach: [
        {
          kind: 'prose',
          text:
            'The name server owns metadata, access-control lists and the storage-server registry; storage servers own file bytes and are paired primary-to-backup. Everything speaks one \\n-terminated line per message, TYPE|ID|USERNAME|ROLE|PAYLOAD, which makes the whole protocol readable in a packet capture and testable from a shell.',
        },
        {
          kind: 'bullets',
          items: [
            'Write locks are held per sentence rather than per file, keyed by a persisted stable ID so a held lock survives edits that renumber the surrounding text.',
            'Writes go to a temp file, fsync, then rename - so a crash mid-write leaves the previous version intact rather than a truncated one.',
            'The name server is thread-per-connection; storage servers use a fixed pool of 8 workers.', // include/ss/ss_server.h:12
            'EXEC runs a forked child under CPU, address-space and output-size rlimits, a wall-clock timeout, a scrubbed environment and process-group cleanup.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Property', 'Value', 'Where'],
            rows: [
              ['Integration tests', '46', 'tests/, 20 files'],
              ['CI runs of the suite', '2', 'plain, then under ASan'],
              ['Failure detection', '~30 s', '15 s timeout × 3 missed, checked every 5 s'],
              ['Storage-server workers', '8', 'include/ss/ss_server.h:12'],
              ['Protocol line limit', '2048 B', 'include/common/protocol.h:20'],
            ],
            numeric: [1],
            note:
              'The pytest suite spins up a real cluster on ephemeral ports; CI additionally re-runs all of it under AddressSanitizer, and gates on -Werror plus gcc -fanalyzer.',
          },
        },
        {
          kind: 'note',
          text:
            'There is deliberately no throughput or latency figure here: the repo has no performance benchmark, so there is nothing honest to quote.',
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'per-sentence locking was the whole concurrency story',
            found:
              'locking an entry and locking the structure that holds it are different problems. A lock protects a sentence\'s contents, but nothing stops the entry itself from being reclaimed underneath a holder - reference counting is what would actually close that gap, and the README says so rather than pretending otherwise.',
          },
        },
        {
          kind: 'prose',
          text:
            'Two bugs in the git history came from the same root: a use-after-free in the access-request path, and a dead realloc branch beside it. Both were lifetime bugs, not synchronisation bugs, which is what pushed the limitation above into the README instead of out of sight.',
        },
      ],
      limitations: [
        'Failure detection takes ~30 s by construction; a shorter heartbeat interval would trade false positives for latency.',
        'Entry lifetime and entry contents are protected separately, and only the second is complete.',
        'Replication is primary-backup with read failover, not consensus - a partition can still strand a writer.',
      ],
    },
  },

  {
    slug: 'bytecode-engine',
    title: 'Zero-Allocation Bytecode Engine',
    repoUrl: 'https://github.com/RaunakSeksaria/Lambda_Interpreter',
    stack: ['C++20', 'perf', 'clang-tidy', 'ASan/UBSan', 'CI', 'Racket'],
    disclosure:
      'The repo is named Lambda_Interpreter: it holds both this C++ engine and the older Racket λ-calculus interpreter that now serves as its differential-test oracle.',
    summary:
      'A stack VM that compiles S-expression signals to bytecode and evaluates them without allocating, checked against a Racket interpreter as an oracle and benchmarked with hardware counters.',
    highlights: [
      'Built a zero-allocation C++ stack VM compiling S-expression signals to bytecode with compile-time lexical addressing.',
      'Benchmarked at roughly 30× a reference tree-walker via rdtsc and perf counters, gated by differential tests, sanitizers and CI.',
      'Enforced the zero-allocation claim with a test that interposes global operator new and fails if evaluation allocates at all.',
    ],
    caseStudy: {
      problem:
        'A tree-walking interpreter re-does structural work on every evaluation: it chases pointers through the AST, looks names up in an environment, and allocates as it goes. For an expression that is evaluated repeatedly on a hot path, all of that is waste that can be moved to compile time.',
      approach: [
        {
          kind: 'prose',
          text:
            'The pipeline is lexer → parser → compiler → VM. The compiler resolves every variable to a slot index at compile time, so the VM never does a name lookup, and it precomputes the maximum stack depth, local count and store size, so the VM never grows anything at run time.',
        },
        {
          kind: 'bullets',
          items: [
            'Zero-allocation is a tested property, not a claim: tests/alloc_audit.cpp interposes global operator new, new[] and the nothrow forms, and fails the build if run() allocates.',
            'Semantics are pinned by differential testing - a 31-case corpus is evaluated by the Racket interpreter to regenerate golden output, then compared against the VM in CI.',
            'Built under -Wall -Wextra -Wpedantic -Wshadow -Wconversion -Wsign-conversion -Wold-style-cast -Werror, with clang-tidy, cppcheck, ASan/UBSan and valgrind targets.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Signal', 'ns/eval', 'Cycles', 'vs tree-walker'],
            rows: [
              ['light', '34', '74', '~36×'],
              ['branchy', '26', '58', '~32×'],
              ['heavy', '865', '1892', '~33×'],
            ],
            numeric: [1, 2, 3],
            note:
              'i5-1340P, thread-pinned, TSC ≈ 2.19 GHz, p50 of a rdtsc + perf_event_open harness. Reproduce with `make bench`. The repo calls these numbers illustrative of the shape rather than absolutes, and benchmarks are deliberately outside CI - so treat the ratio, not the digits, as the result.',
          },
        },
        {
          kind: 'table',
          table: {
            columns: ['Dispatch', 'light', 'branchy', 'heavy'],
            rows: [
              ['switch - cycles', '85', '58', '2402'],
              ['computed-goto - cycles', '74', '58', '1892'],
              ['switch - instructions', '330', '215', '11113'],
              ['computed-goto - instructions', '257', '171', '7504'],
            ],
            numeric: [1, 2, 3],
          },
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'computed-goto threading would be a general win over a switch',
            found:
              'about 21% on the long loop and nothing distinguishable from noise on short signals. The gain tracks retired instruction count - 7504 against 11113 on the heavy case - not branch mispredictions, which is the mechanism the folklore usually credits.',
          },
        },
        {
          kind: 'prose',
          text:
            'That result also decided the honest way to report the headline speedup. The native-code comparison for the heavy signal is omitted entirely, because the optimizer collapses that loop and the ratio would be measuring the compiler rather than the VM.',
        },
      ],
      limitations: [
        'Benchmarks are excluded from CI, so the performance numbers are reproducible but not regression-gated.',
        'Figures come from a single machine and are quoted as ratios for that reason.',
        'The language is deliberately small - signals, not a general-purpose language.',
      ],
    },
  },

  {
    slug: 'relational-dbms',
    title: 'Relational Database with Transactional CLI',
    repoUrl: 'https://github.com/RaunakSeksaria/Relational-DBMS',
    stack: ['Python', 'MySQL 8.4', 'pymysql', 'podman'],
    disclosure:
      'Originally a course project with three teammates. The SQL views, window analytics, performance work and containerised setup are mine, added later.',
    summary:
      'A normalised MySQL schema with a transactional Python CLI over hand-written parameterised SQL, and a performance study of its reporting queries done with EXPLAIN ANALYZE.',
    highlights: [
      'Designed a 3NF schema - 18 tables, 22 foreign keys, 3 CHECK constraints - with a 13-operation CLI over parameterised SQL, every write guarded by commit/rollback.', // counted in sql/schema.sql; menu at script.py:388-404
      'Wrote recursive CTEs for arbitrary-depth hierarchies exposed as SQL views, plus window analytics - RANK/DENSE_RANK, LAG/LEAD, NTILE, running totals, top-N-per-group - in a dedicated analytics query set and two CLI reports.',
      'Cut a monthly report from 48 ms to 1.3 ms on 200k rows by making the date predicate sargable, reading 67× fewer rows.', // docs/performance.md:42-51
    ],
    caseStudy: {
      problem:
        'A monthly report over a 200,000-row meetings table was taking tens of milliseconds and reading every row to return about 3,000. The obvious cause was a missing index on the date column.',
      approach: [
        {
          kind: 'prose',
          text:
            'Rather than adding the index and moving on, each variant was timed with EXPLAIN ANALYZE over three runs on MySQL 8.4, recording both wall time and rows actually read. The dataset is generated by a committed script that arranges members as a binary tree, so the recursive CTE has real depth to traverse instead of a flat star.',
        },
        {
          kind: 'pairs',
          pairs: [
            ['Schema', '18 tables, 22 foreign keys, 3 CHECK constraints, 6 ON DELETE CASCADE'],
            ['CLI', '13 operations, all SQL parameter-bound, writes wrapped in commit/rollback'],
            ['Views', '3, including a recursive-CTE member hierarchy'],
            ['Benchmark set', '200,000 generated meetings, ~1.5% selected by the report'],
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Query variant', 'Time', 'Rows read'],
            rows: [
              ['YEAR()/MONTH() filter, no index', '39.1 ms', '200,000'],
              ['YEAR()/MONTH() filter, with index', '48.2 ms', '200,000'],
              ['Half-open range, with index', '1.32 ms', '3,000'],
            ],
            numeric: [1, 2],
            note:
              'EXPLAIN ANALYZE actual time, MySQL 8.4.9, three runs. Quoting 48.2 → 1.32 ms is the like-for-like pair, both with the index present; against the un-indexed baseline the same rewrite is 39.1 → 1.32 ms.',
          },
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'the report was slow because the date column had no index',
            found:
              'the index on its own changed nothing - 39.1 ms became 48.2 ms, marginally worse. Wrapping the column in YEAR() and MONTH() made the predicate non-sargable, so the planner could not use the index at all. Rewriting it as a half-open range unlocked the range scan and dropped rows read from 200,000 to 3,000.',
          },
        },
        {
          kind: 'prose',
          text:
            'Two further optimizations were measured and then deliberately not applied: a correlated-subquery rewrite worth about 20%, judged not worth the readability cost, and an index on a text column that made a leading-wildcard LIKE slower (61.3 ms → 104 ms) because a quarter of the rows matched. Knowing which optimization not to make is the point of measuring first.',
        },
      ],
      limitations: [
        'No automated test suite - verification is by diffing the output of all six read operations before and after a change, which has caught two regressions.',
        'Single-node MySQL; nothing here addresses replication or contention under concurrent writers.',
        'Timings come from one machine and one dataset shape.',
      ],
    },
  },

  {
    slug: 'fraud-detection',
    title: 'Bitcoin Fraud Detection',
    repoUrl: 'https://github.com/RaunakSeksaria/Elliptic-Fraud-GNN',
    stack: ['Python', 'PyTorch Geometric', 'XGBoost', 'scikit-learn', 'pytest'],
    summary:
      'A leakage-free benchmark of graph neural networks against feature-only baselines for illicit-transaction detection on the Elliptic Bitcoin graph, plus a per-time-step analysis of what happens when the underlying market changes.',
    highlights: [
      'Benchmarked GCN and GraphSAGE against class-weighted XGBoost on the 203,769-node, 234,355-edge Elliptic Bitcoin transaction graph under a temporal train/test split.', // asserted in tests/test_data.py:12-14
      'Found gradient-boosted trees on the raw features beat both GNNs - 0.79 illicit-F1 and 1.00 precision@100 against 0.55 and 0.54 - reproducing the published result rather than contradicting it.', // results/metrics.json
      'Quantified complete model collapse after a dark-market shutdown at time step 43, with no recovery through step 49.', // SHUTDOWN_STEP, src/evaluate.py:29
    ],
    caseStudy: {
      problem:
        'Illicit-transaction detection looks like the textbook case for a graph neural network: the fraud signal is relational, and money moves in traceable structures. The question was whether message passing actually beats a strong feature-only baseline on the standard benchmark - and whether either survives the market changing underneath it.',
      approach: [
        {
          kind: 'prose',
          text:
            'Four models on identical splits: class-weighted logistic regression, class-weighted XGBoost, a 2-layer GCN and a 2-layer GraphSAGE. Fixed seed, CPU-only, no hyperparameter search - the comparison is between model families on equal footing, not a hunt for a best score.',
        },
        {
          kind: 'bullets',
          items: [
            'The split is temporal, never random: train on time steps 1-34, test on 35-49, with 30-34 held out for early stopping.',
            'Scaler statistics are fit on training steps only, so no test-set information reaches the features.',
            'Structural non-leakage is asserted by a test, not assumed: no edge crosses a time step, so message passing cannot pull information forward in time.',
            'Per-model predictions are committed as .npz, so anyone can recompute every metric without retraining.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Model', 'Illicit F1', 'precision@100'],
            rows: [
              ['XGBoost (class-weighted)', '0.795', '1.00'],
              ['GCN', '0.553', '0.32'],
              ['GraphSAGE', '0.535', '0.75'],
              ['Logistic regression', '0.303', '0.29'],
            ],
            numeric: [1, 2],
            note:
              'From the committed results/metrics.json - the README table is generated from that file rather than typed by hand, so the site and the repo cannot drift apart.',
          },
        },
        {
          kind: 'pairs',
          pairs: [
            ['Graph', '203,769 nodes · 234,355 edges · 165 features · 49 time steps'],
            ['Labels', '4,545 illicit · 42,019 licit · 157,205 unknown (excluded)'],
            ['Split', 'train steps 1-34 (3,462 illicit) · test 35-49 (1,083 illicit)'],
          ],
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'message passing over the transaction graph would beat feature-only baselines',
            found:
              'XGBoost on the raw features won by 0.24 F1. The 165 engineered features already summarise each node\'s local neighbourhood, so message passing mostly adds a second, noisier copy of information the trees already had.',
          },
        },
        {
          kind: 'finding',
          finding: {
            suspected: 'F1 was enough to rank the two GNNs against each other',
            found:
              'GCN and GraphSAGE sit within 0.02 F1 of each other but 0.43 apart on precision@100 - 0.32 against 0.75. For a system that feeds a human review queue, the top of the ranking is the product, so these two models are not close at all.',
          },
        },
        {
          kind: 'prose',
          text:
            'The sharpest result is temporal. Every model holds between 0.78 and 0.97 per-step F1 through step 42, then drops to zero at step 43 when a dark market shuts down, and none recovers through step 49. The failure is distribution shift, not architecture - which argues for monitoring and retraining cadence over model choice.',
        },
      ],
      limitations: [
        'Features are anonymised, so nothing here explains which behaviours the models keyed on.',
        '157,205 unlabelled nodes are excluded from evaluation entirely.',
        'Single seed, no hyperparameter search, fixed threshold, vanilla 2-layer models - this measures families, not tuned ceilings.',
        'No CI in this repo; the tests exist but nothing runs them automatically, and 9 of 15 skip without the downloaded dataset.',
      ],
    },
  },

  {
    slug: 'minicrypt',
    title: 'MiniCrypt',
    repoUrl: 'https://github.com/RaunakSeksaria/MiniCrypt',
    stack: ['Python', 'FastAPI', 'React'],
    summary:
      'The Minicrypt reduction chain implemented from scratch in pure Python - no third-party cryptographic libraries - behind a FastAPI and React explorer that computes reduction paths between primitives and runs the attacks live.',
    highlights: [
      'Implemented AES, RSA, ElGamal, HMAC, Miller-Rabin and 1-of-2 Oblivious Transfer with no third-party cryptographic dependencies.',
      'Built an explorer that finds reduction paths between primitives by BFS over a typed edge table carrying theorem metadata, with a factory that builds primitives from either an AES or a discrete-log foundation so reductions stay foundation-agnostic.',
      'Implemented GMW-style secure two-party computation over 1-of-2 OT, with comparator, equality and adder circuits.',
    ],
    caseStudy: {
      problem:
        'Cryptography courses present the Minicrypt world as a graph of reductions - one-way functions give pseudorandom generators, which give pseudorandom functions, which give block ciphers and MACs. The proofs are constructive, so the graph ought to be executable rather than just drawn on a board.',
      approach: [
        {
          kind: 'prose',
          text:
            'Every primitive is hand-rolled: AES with its own S-box, RCON and GF(2⁸) MixColumns; RSA with PKCS#1 v1.5 padding; ElGamal; an HMAC built over a discrete-log collision-resistant hash rather than a library digest; Miller-Rabin with safe-prime generation. The reduction graph is a typed edge table annotated with the theorem behind each edge, and shortest paths between primitives come from BFS over it.',
        },
        {
          kind: 'bullets',
          items: [
            'The attacks go well past a demo set: Håstad broadcast, Bleichenbacher padding oracle, RSA signature-homomorphism forgery, HMAC timing attack and length extension, Merkle-Damgård collision propagation, an ElGamal small-subgroup distinguisher, and Floyd cycle-finding against naive birthday search.',
            'Secure AND is realised through OT with XOR and NOT free and local, which is GMW rather than garbled circuits - there is no Yao construction here.',
            '24 tests run in CI alongside ruff and a frontend lint and build; the Python job installs no dependencies at all, which is itself the proof that the crypto has none.',
          ],
        },
      ],
      measured: [
        {
          kind: 'pairs',
          pairs: [
            ['Primitives in the reduction graph', 'OWF, PRG, PRF, PRP, MAC, CRHF, HMAC'],
            ['Crypto modules', '23, pure Python'],
            ['Third-party crypto dependencies', 'none'],
            ['Tests / CI', '24 tests, run in GitHub Actions with ruff'],
          ],
        },
        {
          kind: 'note',
          text:
            'One honest caveat, since the repo\'s own rules forbid hash shortcuts: stdlib hashlib appears in exactly two places - a truncated SHA-256 used as a deliberately weak toy hash for the birthday-attack experiment, and an optional toggle in the length-extension demo. Neither is a third-party dependency, and neither backs a primitive.',
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'implementing the primitives would be the hard part',
            found:
              'the primitives are mostly transcription; keeping the reductions foundation-agnostic is what forced real design. Building each primitive from either an AES or a discrete-log root means no reduction may assume a concrete construction underneath it, which is the actual content of the theorems.',
          },
        },
      ],
      limitations: [
        'Textbook implementations for teaching, not constant-time or side-channel-hardened - nothing here should protect anything real.',
        'The explorer runs locally; there is no deployment, and no screenshots are committed yet.',
        'GMW only; no garbled-circuit implementation.',
      ],
    },
  },
];

/** Public, linked, but not given a case study. */
export const other: Project[] = [
  {
    slug: 'c-shell',
    title: 'C-Shell',
    repoUrl: 'https://github.com/RaunakSeksaria/C-Shell',
    stack: ['C99', 'POSIX', 'pytest', 'pexpect', 'gcc -fanalyzer'],
    summary:
      'A tokenize-parse-execute POSIX shell with pipelines, I/O redirection, sequencing and background execution. 12+ commands and sub-commands across 8 built-ins cover directory navigation, listing, job control, signal delivery and on-disk history. 82+ tests drive a real PTY through pexpect, and every source file is kept clean under gcc -fanalyzer with -Werror.',
    highlights: [],
  },
  {
    slug: 'reliable-udp',
    title: 'Reliable UDP Transport & Packet Sniffer',
    repoUrl: 'https://github.com/RaunakSeksaria/Networking',
    stack: ['C99', 'UDP sockets', 'libpcap', 'BPF', 'select()'],
    summary:
      'Two projects. S.H.A.M. is a connection-oriented byte stream over UDP with a three-way handshake, four-way teardown, cumulative byte ACKs, a 10-packet sliding window and 500 ms per-packet retransmission timers - per-packet rather than Go-Back-N, so recovering one loss does not resend the tail. C-Shark is a libpcap sniffer decoding Ethernet, IPv4, IPv6, ARP, TCP and UDP with BPF filters and hex-dump inspection.', // SLIDING_WINDOW_SIZE 10, RTO_TIMEOUT_MS 500 - sham.h:30-31
    highlights: [],
  },
  {
    slug: 'ews-financial-networks',
    title: 'Early Warning Signals for Liquidity-Network Fragmentation',
    repoUrl: 'https://github.com/RaunakSeksaria/EWS-Financial-Networks',
    stack: ['Python', 'PyTorch', 'PyTorch Geometric', 'NetworkX'],
    summary:
      'Reproduced a GIN-GRU tipping-point predictor from Physical Review X 14, 031009 (2024) on Wilson-Cowan dynamics, then designed an original inter-bank liquidity-fragmentation ODE model and trained the same predictor on it. The useful result was a negative one: window-level splitting had inflated R² to 0.68, and the honest simulation-level split gives 0.21 - so the no-leakage split is now an asserted test invariant.',
    highlights: [],
  },
  {
    slug: 'buy-sell-rent',
    title: 'Buy, Sell, Rent platform',
    repoUrl: 'https://github.com/RaunakSeksaria/Buy_Sell_Rent_iiit',
    stack: ['Next.js', 'Tailwind CSS', 'Express.js', 'MongoDB'],
    summary:
      'A full-stack platform for intra-college transactions - listing, buying, selling and renting items within the campus.',
    highlights: [],
  },
  {
    slug: 'computational-modelling',
    title: 'Computational modelling of scientific problems',
    repoUrl:
      'https://github.com/RaunakSeksaria/Computational-modelling-of-scientific-problems',
    stack: ['Python', 'NumPy', 'Matplotlib'],
    summary:
      'Random walks, prey-predator systems, logistic-map steady-state analysis, Monte-Carlo evaluation of multi-dimensional integrals, Fourier analysis built from complex epicycles, and protein visualisation.',
    highlights: [],
  },
];

export const allProjects = [...featured, ...other];
