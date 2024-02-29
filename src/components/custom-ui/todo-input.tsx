'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {  useState } from 'react';

interface TodoInputProps {
  handleText: (taskText: string, rep?: any) => void;
}

export function TodoInput({ handleText }: TodoInputProps) {
  const [task, setTask] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleText(task);
    setTask('');
  };

  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <Button
        type="submit"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleSubmit(e)}
      >
        Add Task
      </Button>
    </div>
  );
}


