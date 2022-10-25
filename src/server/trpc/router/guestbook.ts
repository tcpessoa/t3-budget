import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const guestbookRouter = router({
  postMessage: protectedProcedure
    .input(z.object({ message: z.string() }))
    .mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.guestbook.create({
        data: {
          userId: ctx.session.user.id,
          name: ctx.session.user.name as string,
          message: input.message,
        },
      });
    } catch (error) {
      console.log(error);
    }
  },

    ),
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.guestbook.findMany({
      where: {userId: ctx.session.user.id},
      orderBy: {
        createdAt: 'desc',
      },
      take: 10
    });
  }),
});
