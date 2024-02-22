import { Separator } from '@/components/ui/separator';
import { Input } from '../ui/input';
import { TaskType, TaskTypeIdb } from '@/app/mutators';
import { Button } from '../ui/button';
import { Pencil1Icon, CheckIcon } from '@radix-ui/react-icons';
import { DeleteButton } from './todo-delete';
import { useState } from 'react';

const TodoTask = ({ task }: any) => {
  const [isEdting, setIsEditing] = useState(false);
  console.log(task);

  return (
    <>
      <div className="flex justify-between">
        {isEdting ? (
          <div className="flex justify-between w-full">
            <Input />
            <Button className="px-2 py-1 mr-2" onClick={(e) => setIsEditing(false)}>
              <CheckIcon className="w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-between w-full">
            <div className="text-sm">{task?.text}</div>
            <Button className="px-2 py-1 mr-2" onClick={(e) => setIsEditing(true)}>
              <Pencil1Icon className="w-3" />
            </Button>
          </div>
        )}
        {/* Delete Button */}
        {/* <DeleteButton id={} /> */}
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default TodoTask;



