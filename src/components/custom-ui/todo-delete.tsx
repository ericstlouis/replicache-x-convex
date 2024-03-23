'use client';
import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { TaskType } from '@/replicache/mutators';
import { useStore } from '@/lib/repStore';

export function DeleteButton({ id }: { id: string }) {
  const rep = useStore().rep;

  const handleDelete = () => {
    console.log(id);
    if (rep && rep.mutate && rep.mutate.deleteTask) {
      rep.mutate.deleteTask(id);
    }
  };
  return (
    <Button className="px-2 py-1 m-0" onClick={handleDelete}>
      <TrashIcon className="w-3" />
    </Button>
  );
}

