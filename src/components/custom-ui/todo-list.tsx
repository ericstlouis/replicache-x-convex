import { ScrollArea } from '@/components/ui/scroll-area';
import TodoTask from './todo-task';
import { TaskTypeIdb } from '@/app/mutators';

export function TodoTaskList({ Tasks }: TaskTypeIdb) {
  return (
    <ScrollArea className=" h-72 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Tasks?.map(([k, v]) => (
          <TodoTask key={k} task={v} />
        ))}
      </div>
    </ScrollArea>
  );
}

