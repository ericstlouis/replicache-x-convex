import { v } from 'convex/values';
import { QueryCtx, query } from './_generated/server';
import { defaultServerID } from './constants';
import { PatchOperation, PullResponse } from 'replicache';


export const currentServerVersion = query({
  args: {},
  async handler(ctx) {
    const server = await ctx.db
      .query('replicacheServer')
      .withIndex('by_server_id', (q) => q.eq('serverId', defaultServerID))
      .unique();
    const currentVersion = server?.version ?? 0;
    return currentVersion;
  },
});

export default query({
  args: {
    clientGroupID: v.string(),
    cookie: v.union(v.number(), v.null()),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const { clientGroupID, userId } = args;
    const fromVersion = args.cookie ?? 0;

    const server = await ctx.db
      .query('replicacheServer')
      .withIndex('by_server_id', (q) => q.eq('serverId', defaultServerID))
      .unique();
    const currentVersion = server?.version ?? 0;

    if (fromVersion > currentVersion) {
      throw new Error(
        `fromVersion ${fromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
      );
    }

    // Get lmids for requesting client groups.
    const lastMutationIDChanges = await getLastMutationIDChanges(
      ctx,
      clientGroupID,
      fromVersion
    );

    const changed = await ctx.db
      .query('task')
      .withIndex('by_version', (q) => q.gt('version', fromVersion))
      .collect();

    // Build and return response.
    const patch: PatchOperation[] = [];
    for (const row of changed) {
      const {
        localId: id,
        userId,
        taskText,
        completed,
        version: rowVersion,
        deleted,
      } = row;
      if (deleted) {
        if (rowVersion > fromVersion) {
          patch.push({
            op: 'del',
            key: `task/${id}`,
          });
        }
      } else {
        patch.push({
          op: 'put',
          key: `task/${id}`,
          value: {
            taskText: taskText,
            completed: completed
          }, 
        });
      }
    }
    const body: PullResponse = {
      lastMutationIDChanges,
      cookie: currentVersion,
      patch,
    };
    return body;
  },
});

async function getLastMutationIDChanges(
  ctx: QueryCtx,
  clientGroupID: string,
  fromVersion: number
) {
  const rows = await ctx.db
    .query('replicacheClient')
    .withIndex('by_client_group_id', (q) =>
      q.eq('clientGroupId', clientGroupID).gt('version', fromVersion)
    )
    .collect();
  return Object.fromEntries(rows.map((r) => [r.clientId, r.lastMutationId]));
}



