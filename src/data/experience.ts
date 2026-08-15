import type { Role } from './types';

export const roles: Role[] = [
  {
    id: 'researcher',
    title: 'Undergraduate Researcher',
    org: 'Prof. C. Hens, CCNSB, IIIT-H',
    period: 'May 2025 - Ongoing',
    stack: ['Kernel PCA', 'NetworkX', 'Matplotlib'],
    bullets: [
      'Looking at Geopolitical Networks and how countries cluster into blocs, and how that affects their cooperation with other blocs.',
    ],
  },
  {
    id: 'ta',
    title: 'Teaching Assistant',
    org: 'IIIT-H - Discrete Structures',
    period: 'Aug 2025 - Dec 2025',
    stack: ['Proofs', 'Graph Theory', 'Group Theory'],
    bullets: [
      "Conducted 10+ tutorial classes and graded assignments and exams for the Discrete Structures course, taken by 275+ students.",
    ],
  },
  {
    id: 'product-labs',
    title: 'Software Developer Intern',
    org: 'Product Labs, IIIT-H',
    period: 'May 2025 - Jun 2025',
    stack: ['Python (asyncio)', 'FFmpeg', 'Flask'],
    repoUrl: 'https://github.com/RaunakSeksaria/Product-Labs',
    bullets: [
      'Architected a pipeline that re-broadcasts YouTube livestreams with the audio dubbed into a regional language, under 10 s of latency.',
      'Engineered a concurrent asyncio pipeline chaining ASR, NMT and TTS models over 5 s FFmpeg stream chunks, with typed failures falling back to untranslated audio so the stream never stalls.', // CHUNK_SECONDS = 5, src/main.py:32
      'Served the translated stream to browsers via MPEG-DASH with Flask, syncing dubbed audio to video by rewriting fragment decode timestamps at the MP4 box level.', // src/dash_output_stream.py, tests/test_dash_boxes.py
    ],
    finding: {
      suspected: 'the lag was the model APIs - three network round-trips per chunk',
      found:
        'a backlog reading ffmpeg stderr at 10 lines/s against ~18 emitted; one chunk sat 12 s in the queue. Removing it took measured lag from 21.6 s to ~3 s - and exposed a second bug the backlog had been masking, where video chunks had no partial-write guard.',
    },
    aside:
      'Each 5 s chunk is encoded independently, so its decode timestamps restart at zero and the browser plays one segment then stalls. Fixing that meant hand-parsing and rewriting tfdt boxes in the fragmented MP4 - covered by tests/test_dash_boxes.py.',
  },
  {
    id: 'parent-diaries',
    title: 'Technical Lead',
    org: 'Parent Diaries (HopeLog)',
    period: 'Jan 2025 - Apr 2025',
    stack: ['MongoDB', 'Express', 'Node', 'React Native (Expo)', 'Whisper', 'Socket.IO'],
    repoUrl: 'https://github.com/RaunakSeksaria/Parent_Diaries',
    bullets: [
      'Led a team of 4 on the end-to-end development of a cross-platform (iOS/Android) parenting app, exercising the REST API with Postman and documenting it in a committed OpenAPI spec served at /api-docs.', // code/backend/swagger.yaml
      'Built a multilingual speech-to-speech advisor over Whisper, GPT-4o and TTS - Whisper auto-detects the spoken language and the reply comes back in kind.', // controllers/{asr,llm,tts}.js
      'Extracted growth milestones from chat transcripts with a few-shot prompt built around three exemplar pairs, including a negative example, and a constrained output grammar.', // controllers/milestone.js:16
      'Implemented Google OAuth with JWT sessions, real-time doctor-parent chat over Socket.IO with auth on the handshake, cron-driven vaccination reminder emails, growth tracking and a parent forum.', // src/socket/socketManager.js:32
    ],
  },
];
