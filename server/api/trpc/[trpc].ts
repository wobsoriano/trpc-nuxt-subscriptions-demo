/**
 * This is the API-handler of your app that contains all your API routes.
 * On a bigger app, you will probably want to split this file up into multiple files.
 */
import { createNuxtApiHandler } from 'trpc-nuxt'
import { publicProcedure, router } from '~/server/trpc/trpc'
import { z } from 'zod'
import { observable } from '@trpc/server/observable';
import { EventEmitter } from 'events';

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const appRouter = router({
  onMessage: publicProcedure.subscription(() => {
    return observable<string>((emit) => {
      const onMessage = (data: string) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onMessage()` when `message` is triggered in our event emitter
      ee.on('message', onMessage);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off('message', onMessage);
      };
    });

  }),
  sendMessage: publicProcedure
    // This is the input schema of your procedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      // This is what you're returning to your client
      ee.emit('message', input?.text);

      return input?.text
    }),
})

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default createNuxtApiHandler({
  router: appRouter,
  createContext: () => ({}),
})
