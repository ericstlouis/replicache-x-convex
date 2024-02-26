'use client';
// import { nanoid } from 'nanoid';
// import { useSubscribe } from 'replicache-react';
// import { TaskType, listTodos, mutators } from '../replicache/mutators';
import MainApp from './(main)/page';
import { useEffect, useState } from 'react';
import { Replicache } from 'replicache';
import { M } from '../replicache/mutators';
import { ConvexClient } from 'convex/browser';
import { createReplicacheClient } from '@/replicache/replicacheConstructer';

export default function Home() {
  const [rep, setRep] = useState<Replicache<M> | null>(null);

  useEffect(() => {
    const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const rep = createReplicacheClient(convex);
    setRep(rep);

    return () => {
      void rep.close();
    };
  }, []);

  if (!rep) {
    return null;
  }

  return (
    <main className="">
      <MainApp rep={rep} />
    </main>
  );
}

