import { ScrollArea } from '@/components/ui/scroll-area';
import TodoTask from './todo-task';
import { TaskType } from '@/replicache/mutators';
import { Key } from 'react';

interface TodoTaskProps {
  tasks: TaskType[];
}

export function TodoTaskList({ tasks }: TodoTaskProps) {
  return (
    <ScrollArea className=" h-72 w-72 rounded-md border lg:w-96">
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {tasks.map((task) => (
          <div key={task.id}>
            <TodoTask task={task} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

