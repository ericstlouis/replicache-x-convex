import { Infer, v } from 'convex/values';
import { MutationCtx, mutation } from './_generated/server';
import { TaskType } from '@/replicache/mutators';
import { defaultServerID } from './constants';
import next from 'next';

export const mutationValidator = v.object({
  clientID: v.string(),
  id: v.number(),
  name: v.string(),
  args: v.any(),

  timestamp: v.number(),
});
export type Mutation = Infer<typeof mutationValidator>;

export default mutation({
  args: {
    clientGroupID: v.string(),
    mutations: v.array(mutationValidator),
  },
  async handler(ctx, args) {
    console.log('convex push handler called');
    for (const mutation of args.mutations) {
      // Subtransactions would actually be perfect here!
      await applyMutation(ctx, args.clientGroupID, mutation);
    }
  },
});

async function applyMutation(
  ctx: MutationCtx,
  clientGroupID: string,
  mutation: Mutation
) {
  const { clientID } = mutation;

  let server = await ctx.db
    .query('replicacheServer')
    .withIndex('by_server_id', (q) => q.eq('serverId', defaultServerID))
    .unique();
  if (!server) {
    const id = await ctx.db.insert('replicacheServer', {
      serverId: defaultServerID,
      version: 0,
    });
    server = (await ctx.db.get(id))!;
  }
  const prevVersion = server.version;
  const nextVersion = prevVersion + 1;

  const lastMutationID = await getLastMutationID(ctx, clientID);
  const nextMutationID = lastMutationID + 1;

  console.log('nextVersion', nextVersion, 'nextMutationID', nextMutationID);

  if (mutation.id < nextMutationID) {
    console.log(
      `Mutation ${mutation.id} has already been processed - skipping`
    );
    return;
  }

  if (mutation.id > nextMutationID) {
    throw new Error(
      `Mutation ${mutation.id} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
    );
  }

  console.log('Processing mutation:', JSON.stringify(mutation));
  switch (mutation.name) {
    case 'createTask':
      await createTask(ctx, mutation.args as TaskType, nextVersion);
      break;
    case 'deleteTask':
      await deleteTask(ctx, mutation.args as string, nextVersion);
      break;
    case 'updateTask':
      await updateTask(ctx, mutation.args as TaskType, nextVersion);
      break;
    default:
      throw new Error(`Unknown mutation: ${mutation.name}`);
  }

  console.log('setting', clientID, 'last_mutation_id to', nextMutationID);
  // Update lastMutationID for requesting client.
  await setLastMutationID(
    ctx,
    clientID,
    clientGroupID,
    nextMutationID,
    nextVersion
  );

  // Update global version.
  server.version = nextVersion;
  await ctx.db.patch(server._id, { version: nextVersion });
}

async function getLastMutationID(ctx: MutationCtx, clientID: string) {
  const client = await ctx.db
    .query('replicacheClient')
    .withIndex('by_client_id', (q) => q.eq('clientId', clientID))
    .unique();
  return client?.lastMutationId ?? 0;
}

async function setLastMutationID(
  ctx: MutationCtx,
  clientID: string,
  clientGroupID: string,
  mutationID: number,
  version: number
) {
  const client = await ctx.db
    .query('replicacheClient')
    .withIndex('by_client_id', (q) => q.eq('clientId', clientID))
    .unique();
  if (!client) {
    await ctx.db.insert('replicacheClient', {
      clientId: clientID,
      clientGroupId: clientGroupID,
      lastMutationId: mutationID,
      version,
    });
    return;
  }
  await ctx.db.patch(client._id, {
    clientGroupId: clientGroupID,
    lastMutationId: mutationID,
    version,
  });
}

async function createTask(ctx: MutationCtx, task: TaskType, version: number) {
  console.log('task id: ', task);
  await ctx.db.insert('task', {
    localId: task.id,
    userId: task.userId,
    // sender: task.from,
    taskText: task.taskText,
    completed: task.completed,
    // ord: task.,
    deleted: false,
    version,
  });
}

async function deleteTask(ctx: MutationCtx, task: string, version: number) {
  console.log('task id: ', task);
  const id = await ctx.db
    .query('task')
    .withIndex('by_local_id', (q) => q.eq('localId', task))
    .unique();
  if (!id) {
    throw new Error(`Task ${task} not found`);
  }
  await ctx.db.patch(id._id, { deleted: true, version });
  //deleted on database but the client for some reason
  // await ctx.db.delete(id._id);
}

async function updateTask(ctx: MutationCtx, task: TaskType, version: number) {
  console.log('task id: ', task);
  const id = await ctx.db
    .query('task')
    .withIndex('by_local_id', (q) => q.eq('localId', task.id))
    .unique();
  if (!id) {
    throw new Error(`Task ${task} not found`);
  }
  await ctx.db.patch(id._id, {
    taskText: task.taskText,
    completed: task.completed,
    version,
  });
}

