export type Activity = {
  title: string;
  org?: string;
  period?: string;
  bullets: string[];
};

export const activities: Activity[] = [
  {
    title: 'Co-founder',
    org: 'Katran (Onaya Foundation)',
    period: 'Dec 2020 - Mar 2023',
    bullets: [
      'Upcycled 10,000 m+ of waste fabric, distributed 8,000+ dresses to marginalised children, and uplifted 40+ marginalised artisans.',
      'Helped raise ₹3+ lakh across 15+ fundraising events, including debates, extempore competitions and nationwide plantation drives.',
      'Featured in 12+ publications, including The India Times, The Telegraph, The Better India and Global Indian.',
    ],
  },
  {
    title: 'Clubs and societies',
    org: 'IIIT Hyderabad',
    bullets: [
      'Programming Club (2024) - helped organise 4+ competitive programming events.',
      "Pentaprism, the Photography Club ('23, '24).",
      "Cyclorama, the Film Club ('24).",
      "Ping-IIIT, the independent student media body ('24).",
    ],
  },
  {
    title: 'Leadership and public speaking',
    org: "St. James' School, Kolkata",
    bullets: [
      'Student Council member and School Prefect.',
      'Secretary of the Mathematics Club; Director of the Science Club; Director of the Model United Nations Society.',
      "Chaired committees at JacoMUN '22 and '23, among the largest MUN events in India, with 600+ delegates.",
      '20+ debates and MUNs with podium finishes at national level; won the 16th East India Debate by the Assam Valley School',
      "Named Best Artist at St. James' School.",
    ],
  },
];
