import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';

// Import schemas
import {
  createPlayerInputSchema,
  createGameSessionInputSchema,
  spawnEnemyInputSchema,
  fireBulletInputSchema,
  updatePlayerPositionInputSchema,
  updateGameStateInputSchema,
  damageEntityInputSchema
} from './schema';

// Import handlers
import { createPlayer } from './handlers/create_player';
import { createGameSession } from './handlers/create_game_session';
import { spawnEnemy } from './handlers/spawn_enemy';
import { fireBullet } from './handlers/fire_bullet';
import { updatePlayerPosition } from './handlers/update_player_position';
import { getGameState } from './handlers/get_game_state';
import { updateGameState } from './handlers/update_game_state';
import { damageEntity } from './handlers/damage_entity';
import { endGameSession } from './handlers/end_game_session';
import { getLeaderboard } from './handlers/get_leaderboard';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Player management
  createPlayer: publicProcedure
    .input(createPlayerInputSchema)
    .mutation(({ input }) => createPlayer(input)),

  // Game session management
  createGameSession: publicProcedure
    .input(createGameSessionInputSchema)
    .mutation(({ input }) => createGameSession(input)),

  getGameState: publicProcedure
    .input(z.object({ gameSessionId: z.number() }))
    .query(({ input }) => getGameState(input.gameSessionId)),

  endGameSession: publicProcedure
    .input(z.object({ gameSessionId: z.number() }))
    .mutation(({ input }) => endGameSession(input.gameSessionId)),

  // Enemy management
  spawnEnemy: publicProcedure
    .input(spawnEnemyInputSchema)
    .mutation(({ input }) => spawnEnemy(input)),

  // Combat mechanics
  fireBullet: publicProcedure
    .input(fireBulletInputSchema)
    .mutation(({ input }) => fireBullet(input)),

  damageEntity: publicProcedure
    .input(damageEntityInputSchema)
    .mutation(({ input }) => damageEntity(input)),

  // Player movement
  updatePlayerPosition: publicProcedure
    .input(updatePlayerPositionInputSchema)
    .mutation(({ input }) => updatePlayerPosition(input)),

  // Game state updates
  updateGameState: publicProcedure
    .input(updateGameStateInputSchema)
    .mutation(({ input }) => updateGameState(input)),

  // Leaderboard
  getLeaderboard: publicProcedure
    .input(z.object({ limit: z.number().optional().default(10) }))
    .query(({ input }) => getLeaderboard(input.limit))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();