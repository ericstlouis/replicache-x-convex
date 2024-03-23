import { Separator } from '@/components/ui/separator';
import { Input } from '../ui/input';
import { TaskType, mutators } from '@/replicache/mutators';
import { Button } from '../ui/button';
import {
  Pencil1Icon,
  CheckIcon,
  CheckCircledIcon,
} from '@radix-ui/react-icons';
import { DeleteButton } from './todo-delete';
import { useState } from 'react';
import { useStore } from '@/lib/repStore';

const TodoTask = ({ task }: { task: TaskType }) => {
  const rep = useStore().rep;

  const [isEdting, setIsEditing] = useState(false);
  const [CurrentTask, setUpdatedTask] = useState<TaskType>(task);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTask = { ...CurrentTask };
    newTask.taskText = e.target.value;
    setUpdatedTask(newTask);
    rep?.mutate.updateTask(newTask);
  };

  const handleCheck = () => {
    let taskData = { ...CurrentTask };
    taskData.completed = !taskData.completed;
    console.log('prevouis-Data', CurrentTask);
    console.log('updated-Data', taskData);
    setUpdatedTask(taskData)
    rep?.mutate.updateTask(taskData);
  };

  return (
    <>
      <div className="flex justify-between space-x-2">
        {isEdting ? (
          <div className="flex w-full">
            <Input
              className="line-through"
              value={CurrentTask.taskText}
              onChange={handleChange}
            />
            <Button className="px-2 py-1" onClick={(e) => setIsEditing(false)}>
              <CheckIcon className="w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex w-full">
            {task.completed ? (
              <div className=" text-sm line-through w-full">{CurrentTask?.taskText}</div>
            ) : (
              <div className="text-sm w-full ">{CurrentTask?.taskText}</div>
            )}
            <Button className="px-2 py-1" onClick={(e) => setIsEditing(true)}>
              <Pencil1Icon className="w-3" />
            </Button>
          </div>
        )}
        {/* Delete Button */}
        <DeleteButton id={task.id} />
        <Button className="px-2 py-1 mr-2" onClick={handleCheck}>
          <CheckCircledIcon />
        </Button>
      </div>
      <Separator className="my-2" />
    </>
  );
};

export default TodoTask;

