'use client';
import { ModeToggle } from '@/components/toggle';
import { TodoInput } from '@/components/custom-ui/todo-input';
import { TodoTaskList } from '@/components/custom-ui/todo-list';
import { nanoid } from 'nanoid';
import { rep } from './layout';
import { useSubscribe } from 'replicache-react';
import { TaskType, listTodos } from './mutators';

export default function Home() {
  const handleText = (text: string) => {
    if (rep && rep.mutate && rep.mutate.createTodo) {
      rep.mutate.createTodo({ id: nanoid(), text, completed: false });
    }
  };

  const listOfTasks = useSubscribe(rep, listTodos);

  console.log(listOfTasks);
  console.log(rep);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="flex justify-between">
          <ModeToggle />
          <h1 className="text-3xl">Reco</h1>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="www.ericsl.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            By <h1>Shinobi</h1>
          </a>
        </div>
        {/* main Content */}
        <div className="p-14">
          <TodoInput handleText={handleText} />
          {/* {listOfTasks && (
            <TodoTaskList
              Tasks={listOfTasks.map(([key, value]) => [
                key,
                value as TaskType,
              ])}
            />
          )} */}
        </div>
      </div>
    </main>
  );
}

