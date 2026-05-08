import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Security & Privacy | DocChat AI',
  alternates: { canonical: '/security' }
};

export default function DocumentsRedirect() {
  redirect('/security');
}
