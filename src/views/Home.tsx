import { Suspense } from 'react';
import Cards from '@/components/Cards';
import CardSkeleton from '@/components/CardSkeleton';

export default function Home() {
  return (
    <Suspense fallback={<CardSkeleton count={8} />}>
      <Cards />
    </Suspense>
  );
}
