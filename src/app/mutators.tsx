import { WriteTransaction, ReadTransaction, ReadonlyJSONObject } from 'replicache';

export type TaskType = {
  id: string;
  text: string;
  completed?: boolean;
};

export type TaskTypeIdb = {
  Tasks: (readonly [string, TaskType])[] | undefined;
};

export type TodoUpdate = Partial<TaskType> & Pick<TaskType, 'id'>;

export async function listTodos(tx: ReadTransaction) {
  return await tx.scan({ prefix: 'task/' }).entries().toArray();
  console.log(tx)
}

export const mutators = {
  deleteTodo: async (tx: WriteTransaction, id: string): Promise<void> => {
    await tx.del(id);
  },
  createTodo: async (tx: WriteTransaction, task: TaskType): Promise<void> => {
    await tx.set(`task/${task.id}`, { ...task });
  },

};





 