import { Separator } from '@/components/ui/separator';
import { Input } from '../ui/input';
import { TaskType, mutators } from '@/app/mutators';
import { Button } from '../ui/button';
import { Pencil1Icon, CheckIcon } from '@radix-ui/react-icons';
import { DeleteButton } from './todo-delete';
import { useState } from 'react';
import { rep } from '@/app/layout';

const TodoTask = ({ task }: { task: TaskType }) => {
  const [isEdting, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState<TaskType>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTask = { ...updatedTask };
    newTask.text = e.target.value;
    setUpdatedTask(newTask);
    rep?.mutate.updateTodo(newTask);
  };
  return (
    <>
      <div className="flex justify-between">
        {isEdting ? (
          <div className="flex justify-between w-full">
            <Input value={updatedTask.text} onChange={handleChange} />
            <Button
              className="px-2 py-1 mr-2"
              onClick={(e) => setIsEditing(false)}
            >
              <CheckIcon className="w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <div className="text-sm">{task?.text}</div>
            <Button
              className="px-2 py-1 mr-2"
              onClick={(e) => setIsEditing(true)}
            >
              <Pencil1Icon className="w-3" />
            </Button>
          </div>
        )}
        {/* Delete Button */}
        <DeleteButton id={task.id} />
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default TodoTask;
