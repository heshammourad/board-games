import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Mansions of Madness: Second Edition',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return children;
}
