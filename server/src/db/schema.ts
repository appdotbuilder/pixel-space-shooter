import { serial, text, pgTable, timestamp, integer, real, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const enemyTypeEnum = pgEnum('enemy_type', ['basic', 'fast', 'heavy', 'boss']);
export const ownerTypeEnum = pgEnum('owner_type', ['player', 'enemy']);

// Players table - represents the blue spaceship
export const playersTable = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  x_position: real('x_position').notNull().default(400),
  y_position: real('y_position').notNull().default(500),
  health: integer('health').notNull().default(100),
  max_health: integer('max_health').notNull().default(100),
  score: integer('score').notNull().default(0),
  level: integer('level').notNull().default(1),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Game sessions table - tracks individual game instances
export const gameSessionsTable = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  player_id: integer('player_id').notNull().references(() => playersTable.id),
  current_wave: integer('current_wave').notNull().default(1),
  enemies_defeated: integer('enemies_defeated').notNull().default(0),
  is_active: boolean('is_active').notNull().default(true),
  started_at: timestamp('started_at').defaultNow().notNull(),
  ended_at: timestamp('ended_at'),
});

// Enemies table - represents the red enemy ships
export const enemiesTable = pgTable('enemies', {
  id: serial('id').primaryKey(),
  game_session_id: integer('game_session_id').notNull().references(() => gameSessionsTable.id),
  enemy_type: enemyTypeEnum('enemy_type').notNull(),
  x_position: real('x_position').notNull(),
  y_position: real('y_position').notNull(),
  health: integer('health').notNull(),
  max_health: integer('max_health').notNull(),
  speed: real('speed').notNull(),
  damage: integer('damage').notNull(),
  is_alive: boolean('is_alive').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Bullets table - represents projectiles from both players and enemies
export const bulletsTable = pgTable('bullets', {
  id: serial('id').primaryKey(),
  game_session_id: integer('game_session_id').notNull().references(() => gameSessionsTable.id),
  owner_type: ownerTypeEnum('owner_type').notNull(),
  owner_id: integer('owner_id').notNull(),
  x_position: real('x_position').notNull(),
  y_position: real('y_position').notNull(),
  velocity_x: real('velocity_x').notNull(),
  velocity_y: real('velocity_y').notNull(),
  damage: integer('damage').notNull(),
  is_active: boolean('is_active').notNull().default(true),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const playersRelations = relations(playersTable, ({ many }) => ({
  gameSessions: many(gameSessionsTable),
}));

export const gameSessionsRelations = relations(gameSessionsTable, ({ one, many }) => ({
  player: one(playersTable, {
    fields: [gameSessionsTable.player_id],
    references: [playersTable.id],
  }),
  enemies: many(enemiesTable),
  bullets: many(bulletsTable),
}));

export const enemiesRelations = relations(enemiesTable, ({ one }) => ({
  gameSession: one(gameSessionsTable, {
    fields: [enemiesTable.game_session_id],
    references: [gameSessionsTable.id],
  }),
}));

export const bulletsRelations = relations(bulletsTable, ({ one }) => ({
  gameSession: one(gameSessionsTable, {
    fields: [bulletsTable.game_session_id],
    references: [gameSessionsTable.id],
  }),
}));

// TypeScript types for the table schemas
export type Player = typeof playersTable.$inferSelect;
export type NewPlayer = typeof playersTable.$inferInsert;
export type GameSession = typeof gameSessionsTable.$inferSelect;
export type NewGameSession = typeof gameSessionsTable.$inferInsert;
export type Enemy = typeof enemiesTable.$inferSelect;
export type NewEnemy = typeof enemiesTable.$inferInsert;
export type Bullet = typeof bulletsTable.$inferSelect;
export type NewBullet = typeof bulletsTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  players: playersTable,
  gameSessions: gameSessionsTable,
  enemies: enemiesTable,
  bullets: bulletsTable
};