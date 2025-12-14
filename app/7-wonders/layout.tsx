import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: '7 Wonders',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return children;
}
