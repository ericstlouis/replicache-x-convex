import { Replicache } from 'replicache';
import { mutators } from '../replicache/mutators';
import { ConvexClient } from 'convex/browser';
import { ConvexReplicacheClient } from './ConvexReplicacheClient';

declare global {
  interface ImportMeta {
    hot?: {
      dispose(cb: () => void): void;
    };
  }
}

export function createReplicacheClient(convex: ConvexClient, userId: string) {
  const convexBridge = new ConvexReplicacheClient(convex);
  console.log('This is Replicache Client speaking!!!: ', userId);
  const rep = new Replicache({
    name: 'replicache-convex',
    licenseKey: process.env.NEXT_PUBLIC_LICENSE_KEY as string,
    mutators,
    pusher: (body, id) => convexBridge.replicachePush(body as any, id),
    puller: (body, id) => convexBridge.replicachePull(body as any, id, userId),
  });
  const unsubscribe = convexBridge.subscribe(rep);
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      rep.close();
      unsubscribe();
    });
  }
  return rep;
}

