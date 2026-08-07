import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

type GraphQLContext = {
  req: Record<string, any>;
  res: Record<string, any>;
};

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext): GraphQLContext {
    if (context.getType<string>() === 'graphql') {
      const gqlContext =
        GqlExecutionContext.create(context).getContext<GraphQLContext>();

      return {
        req: gqlContext.req,
        res: gqlContext.res,
      };
    }

    return super.getRequestResponse(context);
  }
}
