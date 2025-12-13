import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Heat: Pedal to the Metal',
};

export default function Layout({children}: {children: React.ReactNode}) {
  return children;
}
