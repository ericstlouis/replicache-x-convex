import {
  PullRequestV1,
  PullerResult,
  PushRequestV1,
  PusherResult,
  Replicache,
} from 'replicache';
import { ConvexClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';

type PullRequestWithUserId = PullerResult & {
  userId: string;
};

type QueryRequest = {
  clientGroupID: string;
  cookie: number | null;
  userId: string;
};


export class ConvexReplicacheClient {
  constructor(private convex: ConvexClient) {}

  async replicachePush(
    requestBody: PushRequestV1,
    requestID: string
  ): Promise<PusherResult> {
    console.log(this.convex, 'push', requestBody, requestID);
    await this.convex.mutation(api.push.default, {
      clientGroupID: requestBody.clientGroupID,
      mutations: requestBody.mutations,
    });
    return {
      httpRequestInfo: {
        httpStatusCode: 200,
        errorMessage: '',
      },
    };
  }
  async replicachePull(
    requestBody: PullRequestV1,
    requestID: string,
    userId: string
  ): Promise<PullerResult> {
    console.log(this.convex, 'pull', requestBody, requestID, userId);
    if (requestBody.cookie !== null && typeof requestBody.cookie !== 'number') {
      throw new Error(`Invalid cookie: ${requestBody.cookie}`);
    }

    const response = await this.convex.query(api.pull.default, {
      clientGroupID: requestBody.clientGroupID,
      cookie: requestBody.cookie,
      userId: userId,
    } as QueryRequest);
    return {
      httpRequestInfo: {
        httpStatusCode: 200,
        errorMessage: '',
      },
      response,
    };
  }
  subscribe(replicache: Replicache) {
    return this.convex.onUpdate(api.pull.currentServerVersion, {}, () => {
      replicache.pull();
    });
  }
}







