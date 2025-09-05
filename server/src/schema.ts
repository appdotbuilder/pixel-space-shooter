import { z } from 'zod';

// Player/Spaceship schema
export const playerSchema = z.object({
  id: z.number(),
  name: z.string(),
  x_position: z.number(),
  y_position: z.number(),
  health: z.number().int().nonnegative(),
  max_health: z.number().int().positive(),
  score: z.number().int().nonnegative(),
  level: z.number().int().positive(),
  is_active: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Player = z.infer<typeof playerSchema>;

// Enemy schema
export const enemySchema = z.object({
  id: z.number(),
  game_session_id: z.number(),
  enemy_type: z.enum(['basic', 'fast', 'heavy', 'boss']),
  x_position: z.number(),
  y_position: z.number(),
  health: z.number().int().nonnegative(),
  max_health: z.number().int().positive(),
  speed: z.number(),
  damage: z.number().int().positive(),
  is_alive: z.boolean(),
  created_at: z.coerce.date()
});

export type Enemy = z.infer<typeof enemySchema>;

// Bullet/Projectile schema
export const bulletSchema = z.object({
  id: z.number(),
  game_session_id: z.number(),
  owner_type: z.enum(['player', 'enemy']),
  owner_id: z.number(),
  x_position: z.number(),
  y_position: z.number(),
  velocity_x: z.number(),
  velocity_y: z.number(),
  damage: z.number().int().positive(),
  is_active: z.boolean(),
  created_at: z.coerce.date()
});

export type Bullet = z.infer<typeof bulletSchema>;

// Game session schema
export const gameSessionSchema = z.object({
  id: z.number(),
  player_id: z.number(),
  current_wave: z.number().int().positive(),
  enemies_defeated: z.number().int().nonnegative(),
  is_active: z.boolean(),
  started_at: z.coerce.date(),
  ended_at: z.coerce.date().nullable()
});

export type GameSession = z.infer<typeof gameSessionSchema>;

// Input schemas for creating entities
export const createPlayerInputSchema = z.object({
  name: z.string().min(1).max(50),
  x_position: z.number().default(400), // Default center position
  y_position: z.number().default(500)  // Default bottom position
});

export type CreatePlayerInput = z.infer<typeof createPlayerInputSchema>;

export const createGameSessionInputSchema = z.object({
  player_id: z.number()
});

export type CreateGameSessionInput = z.infer<typeof createGameSessionInputSchema>;

export const spawnEnemyInputSchema = z.object({
  game_session_id: z.number(),
  enemy_type: z.enum(['basic', 'fast', 'heavy', 'boss']),
  x_position: z.number(),
  y_position: z.number()
});

export type SpawnEnemyInput = z.infer<typeof spawnEnemyInputSchema>;

export const fireBulletInputSchema = z.object({
  game_session_id: z.number(),
  owner_type: z.enum(['player', 'enemy']),
  owner_id: z.number(),
  x_position: z.number(),
  y_position: z.number(),
  velocity_x: z.number(),
  velocity_y: z.number()
});

export type FireBulletInput = z.infer<typeof fireBulletInputSchema>;

// Update schemas for game mechanics
export const updatePlayerPositionInputSchema = z.object({
  player_id: z.number(),
  x_position: z.number(),
  y_position: z.number()
});

export type UpdatePlayerPositionInput = z.infer<typeof updatePlayerPositionInputSchema>;

export const updateGameStateInputSchema = z.object({
  game_session_id: z.number(),
  bullets: z.array(z.object({
    id: z.number(),
    x_position: z.number(),
    y_position: z.number(),
    is_active: z.boolean()
  })).optional(),
  enemies: z.array(z.object({
    id: z.number(),
    x_position: z.number(),
    y_position: z.number(),
    health: z.number().int().nonnegative()
  })).optional()
});

export type UpdateGameStateInput = z.infer<typeof updateGameStateInputSchema>;

export const damageEntityInputSchema = z.object({
  target_type: z.enum(['player', 'enemy']),
  target_id: z.number(),
  damage: z.number().int().positive()
});

export type DamageEntityInput = z.infer<typeof damageEntityInputSchema>;