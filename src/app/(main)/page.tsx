'use client';
import { ModeToggle } from '@/components/toggle';
import { TodoInput } from '@/components/custom-ui/todo-input';
// import { TodoTaskList } from '@/components/custom-ui/todo-list';
import { nanoid } from 'nanoid';
import { useSubscribe } from 'replicache-react';
import { M, TaskType, listTodos } from '@/replicache/mutators';
import { Replicache } from 'replicache';

export default function MainApp({rep}: {rep: Replicache<M>}) {
  const handleText = (text: string) => {
    if (rep && rep.mutate && rep.mutate.createTask) {
      rep.mutate.createTask({ id: nanoid(), text, completed: false });
    }
  };

  const listOfTasks = useSubscribe(rep, listTodos);

  // Transform the data into the structure we expect
  const transformedData: TaskType[] = listOfTasks
    ? listOfTasks.map(([k, v]) => {
        // Deconstruct the V object
        const { id, text, completed = false } = v as unknown as TaskType;
        return {
          id: k,
          text: text, // Now safely deconstructed
          completed: completed, // Default to false if undefined
        };
      })
    : [];

    console.log(transformedData);

  // Render the page
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
          {/* {listOfTasks && <TodoTaskList tasks={transformedData || []} />} */}
        </div>
      </div>
    </main>
  );
}

