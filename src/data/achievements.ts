export type Achievement = {
  title: string;
  detail?: string;
  /** Right-aligned mono result. */
  result?: string;
  issuer?: string;
};

export const achievements: Achievement[] = [
  {
    title: "Dean's List, IIIT Hyderabad",
    // List 2 = top 10% (Semester 2, Spring '24); List 3 = top 15% (Semester 1, Monsoon '23)
    detail:
      "List 2 (top 10%) for Spring '24, and List 3 (top 15%) for Monsoon '23, among 300+ students.",
  },
  {
    title: 'JEE Advanced',
    result: 'Rank 4543',
  },
  {
    title: 'JEE Mains',
    result: '99 percentile',
  },
  {
    title: 'WBJEE',
    result: 'Rank 288',
  },
  {
    title: "The Bishop's Medal for Academic Excellence",
    detail: 'Highest scorer in the Science stream across the school, ISC 2023.',
    issuer: "St. James' School, Kolkata",
  },
  {
    title: 'The Chippendale Award for Creative Writing and Composition',
    issuer: "St. James' School, Kolkata",
  },
  {
    title: 'Senior Diploma with Distinction in Art and Painting',
    issuer: 'Bangiya Sangit Parishad, Rabindra Bharati University',
  },
];
