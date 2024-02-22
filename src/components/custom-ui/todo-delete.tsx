import { Button } from '@/components/ui/button';
import { TrashIcon } from '@radix-ui/react-icons';
import { TaskType } from '@/app/mutators';
import { rep } from '@/app/layout';

export function DeleteButton(id: string) {

  const handleDelete = () => {
    // if (rep && rep.mutate && rep.mutate.deleteTodo) {
    //   rep.mutate.deleteTodo(id);
    // }
  };
  return (
    <Button className="px-2 py-1 m-0" onClick={handleDelete}>
      <TrashIcon className="w-3" />
    </Button>
  );
}

