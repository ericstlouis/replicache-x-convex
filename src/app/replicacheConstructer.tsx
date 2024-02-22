import { Replicache } from 'replicache';
import { mutators } from './mutators';

declare global {
  interface ImportMeta {
    hot?: {
      dispose(cb: () => void): void;
    };
  }
}

export function createReplicacheClient() {
  if (typeof navigator !== 'undefined') {
    console.log('This is Replicache Client speaking!!!');
    const rep = new Replicache({
      name: 'user42',
      licenseKey: process.env.NEXT_PUBLIC_LICENSE_KEY as string,
      mutators,
    });
    if (module.hot) {
      module.hot.dispose(() => rep.close());
    }
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        rep.close();
      });
    }

    // if (rep == null) {
    //   console.log('replicache is not inatied!!! - check replicacheConstructer')
    //   return;
    // }
    return rep;
  }
}










