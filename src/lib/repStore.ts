import { create } from 'zustand';
import { Replicache } from 'replicache';
import { M } from '../replicache/mutators';

type State = {
  rep: Replicache<M> | null;
  userId: string;
  setRep: (rep: Replicache<M> | null, userId: string) => void;
};

export const useStore = create<State>((set) => ({
  rep: null,
  userId: '',
  setRep: (rep: Replicache<M> | null, userId: string) => set({ rep, userId }),
}));

