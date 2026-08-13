import './globals.css';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ThemeProvider } from '@/context/ThemeContext';
import { profile } from '@/data/profile';

export const metadata: Metadata = {
  title: `${profile.name} - ${profile.disciplines.join(', ')}`,
  description:
    'Distributed storage, a zero-allocation bytecode VM, query-plan work and graph models - with the measurements that back them.',
  openGraph: {
    title: `${profile.name} - ${profile.disciplines.join(', ')}`,
    description:
      'Distributed storage, a zero-allocation bytecode VM, query-plan work and graph models - with the measurements that back them.',
    type: 'website',
  },
};

/**
 * Sets the theme class before first paint. Without this, ThemeProvider applies
 * the class in an effect and a dark-first design flashes light on every load.
 *
 * Defaults to dark when there is no signal, but an explicit OS preference for
 * light is honoured.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var prefersLight=window.matchMedia('(prefers-color-scheme: light)').matches;if(t==='dark'||(!t&&!prefersLight)){document.documentElement.classList.add('dark-mode');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
