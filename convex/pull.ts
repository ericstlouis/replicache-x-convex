import { v } from 'convex/values';
import { QueryCtx, query } from './_generated/server';
import { defaultServerID } from './constants';
import { PatchOperation, PullResponse } from 'replicache';

//sync the server version
//if the server version is different from the client it will turn to 0
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

//default query 
export default query({
  args: {
    clientGroupID: v.string(), //A group of instances of replicache that share same browser, name, etc
    cookie: v.union(v.number(), v.null()), //tracking the syncing on the body. every change is a cookie 
    userId: v.string(), //the user auth stored in the cookies
  },
  async handler(ctx, args) {
    const { clientGroupID, userId: clientUserId } = args;
    const clientFromVersion = args.cookie ?? 0; //version is cookie

    //get server record from the database and make sure only return a defualt server
    const server = await ctx.db
      .query('replicacheServer')
      .withIndex('by_server_id', (q) => q.eq('serverId', defaultServerID))
      .unique();
    const currentVersion = server?.version ?? 0; //version of the server

    //if fromversion(cookie) is more than the server version than error
    if (clientFromVersion > currentVersion) {
      throw new Error(
        `fromVersion ${clientFromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
      );
    }

    // Get last mutation Id chnages for 
    const lastMutationIDChanges = await getLastMutationIDChanges(
      ctx,
      clientGroupID,
      clientFromVersion
    );

    //get all the task that has greater version than the clientfromversion 
    const changed = await ctx.db
      .query('task')
      .withIndex('by_version', (q) => q.gt('version', clientFromVersion))
      // .filter((q) => q.eq(q.field('userId'), userId)) //has some bugs
      .collect()

      console.log('changed(pull): ', changed.length);

      if (changed.length === 0) {
        console.log('changed is null');
        return {
          cookie: currentVersion,
          lastMutationIDChanges: {},
          patch: [],
        };
      }

    // Build and return response.
    const patch: PatchOperation[] = [];
    for (const row of changed) {
      const {
        localId: id,
        userId,
        taskText,
        completed,
        version: rowServerVersion,
        deleted,
      } = row;
        if (deleted) {
          patch.push({
            op: 'del',
            key: id,
          });
          console.log('not deleted');
        } else {
          patch.push({
            op: 'put',
            key: id,
            value: {
              taskText: taskText,
              userId: userId,
              completed: completed,
              version: rowServerVersion,
              deleted: deleted,
            },
          });
          console.log('stop patching');
        }
    }
    console.log("patch: ", patch)
    const body: PullResponse = {
      lastMutationIDChanges,
      cookie: currentVersion,
      patch,
    };
    console.log("body: ", body)
    return body;
  },
});

//tracks the order of changes
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






















