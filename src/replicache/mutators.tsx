import { WriteTransaction, ReadTransaction } from 'replicache';

export interface TaskType {
  id: string;
  userId: string;
  taskText: string;
  completed: boolean;
}

// Adjusted to match the expected type
// export interface TaskTypeIdb {
//   task: readonly (readonly [string, TaskType])[];
// }

export type TodoUpdate = Partial<TaskType> & Pick<TaskType, 'id'>;

export async function listTodos(tx: ReadTransaction) {
  return await tx.scan({ prefix: 'task/' }).entries().toArray();
}

export type M = typeof mutators;

export const mutators = {
  deleteTask: async (tx: WriteTransaction, id: string): Promise<void> => {
    await tx.del(id);
  },
  createTask: async (tx: WriteTransaction, task: TaskType): Promise<void> => {
    const { id, userId, taskText, completed } = task;
    await tx.set(id, { taskText, userId, completed });
  },
  updateTask: async (tx: WriteTransaction, task: TodoUpdate): Promise<void> => {
    console.log('task from the mutators: ', task);

    const { id } = task;
    const existing = await tx.get(id);
    if (!existing) {
      throw new Error(`Task ${id} does not exist`);
    }
    if (typeof existing !== 'object' || typeof task !== 'object') {
      throw new Error('Existing task or new task is not an object');
    }

    const updatedTask = { ...task };
    await tx.set(updatedTask.id, {
      taskText: updatedTask.taskText,
      userId: updatedTask.userId,
      completed: updatedTask.completed,
    });
  },
};

