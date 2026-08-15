import type { Project } from './types';

/**
 * The featured five get a case study at /work/<slug>.
 *
 * Numbers here were checked against the source repos, not against the résumé.
 * Where the two disagreed the repo won; the trailing comments say where each
 * figure lives so a later edit can re-check it.
 */
const catalogue: Project[] = [
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
            'No throughput or latency figure appears here: the repo has no performance benchmark, so there is no measured number to quote.',
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'per-sentence locking was the whole concurrency story',
            found:
              'locking an entry and locking the structure that holds it are different problems. A lock protects a sentence\'s contents, but nothing stops the entry itself from being reclaimed underneath a holder - reference counting is what closes that gap, and it is recorded as open work in the README.',
          },
        },
        {
          kind: 'prose',
          text:
            'Two bugs in the git history came from the same root: a use-after-free in the access-request path, and a dead realloc branch beside it. Both were lifetime bugs rather than synchronisation bugs, which is what identified the gap above as the one worth recording.',
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
            'That result also set how the headline speedup is reported. The native-code comparison for the heavy signal is omitted, because the optimizer collapses that loop and the ratio would be measuring the compiler rather than the VM.',
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
            'Scope note: stdlib hashlib appears in exactly two places - a truncated SHA-256 used as a deliberately weak toy hash for the birthday-attack experiment, and an optional toggle in the length-extension demo. Neither is a third-party dependency, and neither backs a primitive.',
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
  {
    slug: 'c-shell',
    title: 'C-Shell',
    repoUrl: 'https://github.com/RaunakSeksaria/C-Shell',
    stack: ['C99', 'POSIX', 'pytest', 'pexpect', 'gcc -fanalyzer'],
    summary:
      'A POSIX shell in C built as tokenize, parse, then execute: pipelines, I/O redirection, sequencing, background jobs and signal handling, with the whole thing driven in tests through a real pseudo-terminal.',
    highlights: [
      'Implemented 12+ commands and sub-commands across 8 built-ins, covering directory navigation, listing, job control, signal delivery and on-disk history.', // dispatch chain, src/execute.c:177-198
      'Wired pipelines by forking one child per stage and connecting them with dup2, with redirection resolved before exec so the child starts with the right descriptors.',
      'Caught SIGINT and SIGTSTP in the shell and forwarded them to the foreground job rather than dying, which is the part that makes it usable interactively.',
    ],
    caseStudy: {
      problem:
        'A shell is a small program with an unusually large surface: every feature is a place where a process, a file descriptor or a signal can be left in the wrong state. Getting it to work once is easy; getting it to stay correct while you add pipelines and job control is the actual exercise.',
      approach: [
        {
          kind: 'prose',
          text:
            'The pipeline is literal: input is tokenized, parsed into commands split on sequencing and pipes, then executed. Keeping those three phases apart is what stops redirection, backgrounding and piping from turning into one tangled special case, since each phase only has to know about its own grammar.',
        },
        {
          kind: 'bullets',
          items: [
            'Built-ins dispatch from a single chain: directory navigation with a cd alias, listing, history, job listing, foreground and background, signal delivery and help.',
            'Redirection handles <, > and >>, with the last of a given kind winning, applied with dup2 onto the standard descriptors.',
            'Sequencing splits on ; and a trailing & marks the command as background, so job control and sequencing are parse-time concerns rather than execution-time ones.',
            'History is file-backed and capped, so it survives across sessions.',
            'There is deliberately no exit built-in: the shell ends on EOF, the same way a real one does.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Property', 'Value'],
            rows: [
              ['Built-ins', '8, plus a cd alias'],
              ['Integration tests', '82+, each on a real PTY'],
              ['Source files', '15 .c and .h pairs'],
              ['Warnings', '-Wall -Wextra -Werror'],
              ['Static analysis', 'gcc -fanalyzer over every source'],
            ],
            numeric: [1],
            note:
              'Tests drive the shell through pexpect on a pseudo-terminal rather than by piping into stdin, which is the only way to exercise job control and signal forwarding honestly. Some assert on stdout and stderr separately.',
          },
        },
        {
          kind: 'note',
          text: 'No CI runs any of this; `make check` is a local gate, not a hosted one.',
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected: 'compiling clean under -Wall -Wextra -Werror meant the memory handling was sound',
            found:
              'the static analyzer disagreed at every allocation site. It cannot know that a malloc succeeded, so each one became a possible null dereference downstream. Funnelling all allocation through abort-on-out-of-memory wrappers marked as never returning null gave the analyzer the fact it was missing, and the tree went quiet.',
          },
        },
      ],
      limitations: [
        'A teaching shell, not a login shell: no job control beyond foreground and background, no scripting language, no completion.',
        'No CI, so the analyzer and test gates only run when someone remembers to run them.',
      ],
    },
  },
  {
    slug: 'reliable-udp',
    title: 'Reliable UDP Transport & Packet Sniffer',
    repoUrl: 'https://github.com/RaunakSeksaria/Networking',
    stack: ['C99', 'UDP sockets', 'libpcap', 'BPF', 'select()'],
    summary:
      'Two halves of the same question. S.H.A.M. rebuilds a reliable, connection-oriented byte stream on top of UDP; C-Shark is a libpcap sniffer that decodes the frames going past, so you can watch the first one actually work.',
    highlights: [
      'Built a byte-oriented transport with a three-way handshake, four-way teardown and cumulative acknowledgements, where sequence numbers count bytes rather than packets.', // sham.h:13, README:51-52
      'Recovered loss with a 10-packet sliding window and 500 ms per-packet retransmission timers, so one lost packet costs one retransmission rather than the whole window.', // SLIDING_WINDOW_SIZE 10, RTO_TIMEOUT_MS 500 - sham.h:30-31
      'Wrote a libpcap sniffer decoding Ethernet, IPv4, IPv6, ARP, TCP and UDP, with BPF filters and hex-dump inspection of the raw frame.',
    ],
    caseStudy: {
      problem:
        'UDP gives you datagrams that may vanish, duplicate or arrive out of order. Turning that into something a file transfer can trust means rebuilding, by hand, the parts of TCP that usually come for free: connection setup, ordering, acknowledgement, retransmission and flow control.',
      approach: [
        {
          kind: 'prose',
          text:
            'The header is twelve bytes: sequence number, acknowledgement number, flags and an advertised window. Sequence numbers count bytes of the stream rather than packets, and acknowledgements are cumulative and name the next byte expected, which is the same contract TCP offers and it makes the receiver logic much simpler than per-packet accounting would.',
        },
        {
          kind: 'bullets',
          items: [
            'A three-way handshake opens the connection and a four-way teardown closes it, with SYN, ACK and FIN as flag bits.',
            'The sender may have ten packets outstanding at once, each with its own retransmission timer, and buffers out-of-order arrivals at the receiver rather than discarding them.',
            'Chat mode multiplexes the socket and standard input through select(), so typing and receiving do not block each other.',
            'The sniffer opens the interface non-blocking and selects over both the capture descriptor and stdin, so it can be exited cleanly mid-capture instead of needing a signal.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Parameter', 'Value'],
            rows: [
              ['Sliding window', '10 packets'],
              ['Retransmission timeout', '500 ms, per packet'],
              ['Data chunk', '1024 B'],
              ['Retries before giving up', '5'],
              ['Header', '12 B'],
              ['Sniffer capture buffer', '10,000 packets, deep-copied'],
            ],
            numeric: [1],
            note:
              'All constants read from sham.h rather than from the write-up. There is no throughput or loss-recovery benchmark in the repo, so no performance figure is quoted here.',
          },
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected:
              'Go-Back-N was the natural design: on a timeout, resend everything from the lost packet onward',
            found:
              'a cumulative acknowledgement already tells you which packets arrived, even the ones after the gap. Giving every packet its own timer and retiring it when an acknowledgement covers its range means a single loss costs a single retransmission instead of the entire window behind it.',
          },
        },
      ],
      limitations: [
        'The receiver-advertised window is only computed on the file-transfer receive path; the handshake, chat and acknowledgement paths advertise a fixed value.',
        'IPv6 extension headers are decoded one level deep and not followed further.',
        'Tests are shell scripts that generate traffic, not assertions, and there is no CI.',
      ],
    },
  },
  {
    slug: 'ews-financial-networks',
    title: 'Early Warning Signals for Liquidity Fragmentation',
    repoUrl: 'https://github.com/RaunakSeksaria/EWS-Financial-Networks',
    stack: ['Python', 'PyTorch', 'PyTorch Geometric', 'NetworkX', 'SciPy'],
    disclosure:
      'Course project for Dynamical Processes in Complex Networks, built with two teammates. The write-up in final-results/ is committed to the repo.',
    summary:
      'An inter-bank lending model where a slowly rising funding cost drives the network from an integrated state into a fragmented one, plus a spatio-temporal predictor that estimates where that tipping point sits before it is reached.',
    highlights: [
      'Built an inter-bank liquidity model in which each node holds a short-term liquidity buffer and network-mediated outflows are gated by three behavioural response functions: lender willingness, borrower credit risk, and a contagion multiplier.',
      'Used the giant component of the thresholded active lending graph as the order parameter, so the critical funding cost is a measurable quantity per simulation rather than a label.',
      'Validated the pipeline first by reproducing two published figures on a Wilson-Cowan system before applying it to the financial model.',
    ],
    caseStudy: {
      problem:
        'Most early-warning work tells you that a system is close to a tipping point without telling you where the tipping point is. For an inter-bank market the useful question is sharper: at what funding cost does lending stop being a connected market and fragment into isolated institutions?',
      approach: [
        {
          kind: 'prose',
          text:
            'Each institution holds a scalar liquidity buffer. A slowly rising exogenous funding cost shrinks the inflow term, while local leakage and a cubic saturation term act on the buffer directly. The interesting part is the network term: outflows to a neighbour are gated by three sigmoidal response functions, one for whether the lender is willing to lend at all, one for how risky the borrower has become, and a multiplier that amplifies losses when a neighbour is already critically stressed.',
        },
        {
          kind: 'bullets',
          items: [
            'The order parameter is structural, not statistical: at each step an active lending graph is built by thresholding effective edge weights, and the collapse of its giant component identifies the critical funding cost.',
            'Swapping the sigmoids for Hill-type activation functions leaves both the transition location and the fragmentation pattern intact, which says the behaviour comes from the economic structure rather than the choice of curve.',
            'The predictor is the architecture from Liu et al., Physical Review X 14, 031009 (2024): a graph isomorphism network over each snapshot, global pooling into one vector per step, a GRU across the observation window, and an MLP head regressing the critical value.',
            'Before trusting it on the financial model, the pipeline was checked against that paper on a Wilson-Cowan system, reproducing both the connectivity collapse and the way anticipation accuracy varies with how far ahead you look.',
          ],
        },
      ],
      measured: [
        {
          kind: 'table',
          table: {
            columns: ['Configuration', 'Critical funding cost'],
            rows: [
              ['Full model, coupling and contagion', '0.565'],
              ['Coupling only, contagion removed', '0.625'],
              ['Full model, independent network seed', '0.563'],
              ['No coupling', 'no fragmentation'],
            ],
            numeric: [1],
            note:
              'Ablation over the four configurations. Removing contagion pushes fragmentation substantially later, while regenerating the network with a different seed leaves it essentially unchanged, so the amplification mechanism matters more here than the particular graph drawn.',
          },
        },
        {
          kind: 'prose',
          text:
            'The transition itself is sharp rather than gradual. The giant component holds at full connectivity across a wide pre-critical range and then collapses discontinuously, and the derivative of the order parameter spikes at exactly that point.',
        },
        {
          kind: 'table',
          table: {
            columns: ['Predictor metric', 'Value'],
            rows: [
              ['R²', '0.209'],
              ['MAE', '0.038'],
              ['RMSE', '0.048'],
              ['Pearson r', '0.713'],
              ['Spearman ρ', '0.663'],
              ['Within ±0.02 of true', '35.2%'],
              ['Within ±0.05 of true', '71.2%'],
              ['Test windows', '1049'],
            ],
            numeric: [1],
            note: 'From the committed liquidity/eval_metrics.json, on a simulation-level split so no window from a training simulation appears in the test set. The ranking correlations are the honest headline here: the model orders simulations by fragility far better than it pins the exact value, and roughly seven in ten predictions land within 0.05 of the true critical funding cost.', // liquidity/eval_metrics.json
          },
        },
        {
          kind: 'table',
          table: {
            columns: ['Lead distance', 'MAE'],
            rows: [
              ['0.70', '0.0388'],
              ['0.80', '0.0388'],
              ['0.90', '0.0411'],
              ['0.95', '0.0357'],
              ['0.98', '0.0338'],
            ],
            numeric: [0, 1],
            note: 'Error against how far ahead of the transition the observation window sits. It stays flat rather than degrading as the window moves earlier, which is the property that makes it an early warning rather than a late detector.', // liquidity/eval_metrics.json, mae_by_lead
          },
        },
      ],
      surprised: [
        {
          kind: 'finding',
          finding: {
            suspected:
              'a market crash could be modelled directly, taking the failure of a Cholesky factorisation on the correlation matrix as the signal that the system had broken',
            found:
              'the transition was barely visible, the graph structure became untrustworthy precisely when the failure occurred, and there was no ground truth to train against. Crashes are fat-tailed and rare enough that ordinary market dynamics never generate them. Moving to liquidity fragmentation fixed all three problems at once: the order parameter is observable throughout, and every simulation carries its own known critical value to learn from.',
          },
        },
      ],
      limitations: [
        'Everything is synthetic. The model is calibrated against the shape of behaviour described in the contagion literature, not against real inter-bank data.',
        'Predictions track the true critical value across simulations but with visible spread, driven by stochastic initial conditions and network heterogeneity.',
        'No CI in this repo, and the tests are CPU smoke tests that assert the split invariant rather than a full evaluation suite.',
      ],
    },
  },
  {
    slug: 'buy-sell-rent',
    title: 'Buy, Sell, Rent platform',
    repoUrl: 'https://github.com/RaunakSeksaria/Buy_Sell_Rent_iiit',
    stack: ['Next.js', 'TypeScript', 'Express', 'MongoDB', 'Mongoose'],
    disclosure:
      'Course project for Design and Analysis of Software Systems at IIIT Hyderabad.',
    summary:
      'A campus marketplace for buying, selling and renting items between students, with institutional single sign-on, an order lifecycle that needs both parties to agree, and a chatbot on the support page.',
    highlights: [
      'Built twelve routes across the App Router frontend, from search and item pages through cart, sell, orders and delivery to profile and support.',
      'Modelled the domain as Item, Order and User, with route modules and an auth middleware separating concerns on the Express side.',
      'Authenticated against the institute CAS single sign-on alongside JWT sessions and bcrypt-hashed local accounts.',
    ],
    caseStudy: {
      problem:
        'A campus marketplace has a trust problem that a public one does not: buyers and sellers already share an institution, so the interesting work is not payments but proving who someone is and making a handover between two students verifiable.',
      approach: [
        {
          kind: 'prose',
          text:
            'The frontend is Next.js with the App Router in TypeScript; the backend is a separate Express service in TypeScript over MongoDB through Mongoose, so the two halves deploy and reason independently. Three models carry the whole domain: User, Item and Order.',
        },
        {
          kind: 'bullets',
          items: [
            'Identity leans on the institute CAS single sign-on rather than a bespoke account system, with JWT sessions and bcrypt for the local path.',
            'The order lifecycle is deliberately two-sided: a seller marks an item delivered and the buyer confirms, so neither party can close a transaction alone.',
            'Twelve page routes cover the full loop: search and item, sell, cart, orders, deliver_items, profile, support, login and signup.',
            'The support page is backed by its own chatbot route rather than a static FAQ.',
          ],
        },
      ],
      measured: [
        {
          kind: 'pairs',
          pairs: [
            ['Frontend', 'Next.js App Router, TypeScript, 12 page routes'],
            ['Backend', 'Express + TypeScript, 4 route modules, auth middleware'],
            ['Data', 'MongoDB via Mongoose; User, Item and Order models'],
            ['Auth', 'CAS single sign-on, JWT sessions, bcrypt'],
          ],
        },
        {
          kind: 'note',
          text: 'No test suite and no CI in this repo, so nothing here is quoted as a measured figure.',
        },
      ],
      surprised: [
        {
          kind: 'prose',
          text:
            'The part that took the most care was not any single feature but the seam between two services that disagree about who the user is. CAS hands back an institutional identity while the application wants its own session and its own user record, so every protected route has to reconcile the two before it can answer.',
        },
      ],
      limitations: [
        'Coursework rather than a deployed product: there is no hosting, no payment handling and no dispute process.',
        'No automated tests, so behaviour is verified by using it.',
        'CAS ties the login path to one institution, which is the point here but would need replacing anywhere else.',
      ],
    },
  },
  {
    slug: 'computational-modelling',
    title: 'Computational modelling of scientific problems',
    repoUrl:
      'https://github.com/RaunakSeksaria/Computational-modelling-of-scientific-problems',
    stack: ['Python', 'NumPy', 'Matplotlib', 'SymPy', 'Jupyter'],
    disclosure:
      'Coursework for Computing in Sciences II at IIIT Hyderabad, plus a protein visualisation report from Biomolecular Structures.',
    summary:
      'Seven scientific problems worked from the mathematics up in Python notebooks, from the statistics of a coin toss through Monte Carlo integration and Fourier epicycles to protein structure visualisation.',
    highlights: [
      'Derived and simulated coin-toss statistics and random walks against the Gaussian and Poisson limits, and the Cramér large-deviation result.',
      'Evaluated integrals by Monte Carlo, including importance sampling rather than uniform sampling alone.',
      'Reconstructed 1D periodic functions and 2D closed curves as sums of rotating epicycles from their Fourier coefficients.',
    ],
    caseStudy: {
      problem:
        'Scientific computing is easy to fake: call a library, plot the output, move on. The point of this set was the opposite, taking problems where the analytical result is known and building the numerics until they agree with it.',
      approach: [
        {
          kind: 'bullets',
          items: [
            'Coin tosses and random walks, checked against the Gaussian and Poisson limits and the Cramér large-deviation theorem.',
            'Monte Carlo integration, both simple and with importance sampling, where the comparison between the two is the lesson.',
            'Fourier analysis expressed as epicycles, reconstructing 1D periodic functions and tracing 2D closed curves from their coefficients.',
            'The prey-predator system as an exercise in nonlinear dynamics, and the logistic map through its phase plot and polynomial roots.',
            'Balancing chemical equations by solving for stoichiometric coefficients rather than by inspection.',
            'Protein structure visualisation in VMD driven by TCL from the Tk console, including an AlphaFold3 prediction for a generated sequence.',
          ],
        },
      ],
      measured: [
        {
          kind: 'pairs',
          pairs: [
            ['Topics', '7, each as a self-contained notebook'],
            ['Tools', 'Python, NumPy, Matplotlib, SymPy, Jupyter'],
            ['Beyond Python', 'VMD with TCL scripting, AlphaFold3'],
          ],
        },
        {
          kind: 'note',
          text: 'A coursework collection rather than an engineered artefact, so it carries no benchmarks, tests or CI, and none are claimed.',
        },
      ],
      surprised: [
        {
          kind: 'prose',
          text:
            'Fourier analysis is normally taught as an equation and a spectrum. Rendering the same coefficients as a chain of rotating circles that traces out an arbitrary closed curve makes the claim of the transform visible in a way the algebra does not, and it is the piece from this set that has stayed most useful since.',
        },
      ],
      limitations: [
        'Coursework: the problems come with known answers, which is the point but also the ceiling.',
        'Notebooks rather than reusable modules, so nothing here is packaged for import.',
      ],
    },
  },
];

/**
 * Which projects lead. Reordering the site is a one-line edit here rather than
 * a move of seventy lines above; everything not listed falls to the second
 * tier, in catalogue order.
 */
const FEATURED_SLUGS = [
  'shared-file-system',
  'bytecode-engine',
  'ews-financial-networks',
  'fraud-detection',
  'minicrypt',
] as const;

export const featured: Project[] = FEATURED_SLUGS.map((slug) => {
  const project = catalogue.find((entry) => entry.slug === slug);
  if (!project) throw new Error(`Featured slug has no project: ${slug}`);
  return project;
});

export const other: Project[] = catalogue.filter(
  (project) => !FEATURED_SLUGS.some((slug) => slug === project.slug),
);

export const allProjects = catalogue;

/** Anything with a case study gets its own page under /work. */
export const casedProjects = catalogue.filter((project) => project.caseStudy);
