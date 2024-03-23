'use client';
// import { nanoid } from 'nanoid';
// import { useSubscribe } from 'replicache-react';
// import { TaskType, listTodos, mutators } from '../replicache/mutators';
import MainApp from './(main)/page';
import { useEffect } from 'react';
import { ConvexClient } from 'convex/browser';
import { createReplicacheClient } from '@/replicache/replicacheConstructer';
import { useStore } from '@/lib/repStore';
import Cookies from 'js-cookie';
import { nanoid } from 'nanoid';


export default function Home() {
  const { rep, setRep } = useStore();

  useEffect(() => {
      let userID = Cookies.get('userID');
      if (!userID) {
        userID = nanoid();
        Cookies.set('userID', userID);
      }
      
    const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const rep = createReplicacheClient(convex, userID);
    setRep(rep, userID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!rep) {
    return null;
  }

  return (
    <main className="">
      <MainApp />
    </main>
  );
}



