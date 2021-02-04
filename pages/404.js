import Link from 'next/link';
import { withBaseLayout } from '@/layouts/BaseLayout';

export default function FourOhFour() {
  return (
    <>
      <h2>404 - Oops nu a fost găsit</h2>
      <Link href="/">
        <a>înapoi</a>
      </Link>
    </>
  );
}

FourOhFour.withLayout = withBaseLayout;
