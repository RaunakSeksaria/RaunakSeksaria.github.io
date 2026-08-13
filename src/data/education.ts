export type Institution = {
  name: string;
  place: string;
  period: string;
  detail: string;
  /** Right-aligned results, rendered mono. */
  results: string[];
  href?: string;
};

export const education: Institution[] = [
  {
    name: 'International Institute of Information Technology',
    place: 'Hyderabad, India',
    period: '2023 - 2028 (expected)',
    detail: 'B.Tech in Computer Science + MS in Computational Natural Sciences by Research',
    results: ['CGPA 9.01'], // resume.tex: "CGPA : 9.01"
    href: 'https://www.iiit.ac.in/',
  },
  {
    name: "St. James' School",
    place: 'Kolkata, India',
    period: '2008 - 2023',
    detail: 'ICSE Class 10 and ISC Class 12, Science stream',
    results: ['ICSE 98%', 'ISC 97.75%'], // resume.tex: "ICSE Class 10 : 98% | ISC Class 12 : 97.75%"
    href: 'http://stjamesschoolkolkata.com/',
  },
];

export const certifications = [
  {
    title: 'Supervised Machine Learning: Regression and Classification',
    issuer: 'DeepLearning.AI · Stanford University',
  },
  {
    title: 'Machine Learning, Neural Networks & Data Science',
    issuer: 'Consulting & Analytics Club, IIT Guwahati',
  },
];

export const coursework = [
  'Data Structures and Algorithms',
  'Design and Analysis of Algorithms',
  'Design and Analysis of Software Systems (OOP Principles)',
  'Database Management Systems',
  'Computer Systems Organisation',
  'Operating Systems and Networks',
  'Machine Learning',
  'Linear Algebra',
  'Probability and Random Processes',
  'Principles of Information Security',
  'Principles of Programming Languages',
];
