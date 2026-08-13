import Browser from '@/components/chrome/Browser';

/**
 * A server component now. All interactivity lives inside Browser, which is the
 * only client boundary on this route.
 */
export default function Home() {
  return <Browser />;
}
