import { redirect } from 'next/navigation';

export const metadata = {
      title: 'DocChat AI',
      alternates: { canonical: '/' }
};

export default function HealthcareRedirect() {
      redirect('/');
}
