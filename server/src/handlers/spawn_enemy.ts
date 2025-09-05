import { type SpawnEnemyInput, type Enemy } from '../schema';

export async function spawnEnemy(input: SpawnEnemyInput): Promise<Enemy> {
    // This is a placeholder declaration! Real code should be implemented here.
    // The goal of this handler is spawning a new red enemy ship in the game session
    // with stats based on enemy type (basic, fast, heavy, boss).
    
    // Default stats based on enemy type (placeholder logic)
    const enemyStats = {
        basic: { health: 30, max_health: 30, speed: 2.0, damage: 10 },
        fast: { health: 20, max_health: 20, speed: 4.0, damage: 15 },
        heavy: { health: 80, max_health: 80, speed: 1.0, damage: 25 },
        boss: { health: 200, max_health: 200, speed: 1.5, damage: 40 }
    };
    
    const stats = enemyStats[input.enemy_type];
    
    return Promise.resolve({
        id: 0, // Placeholder ID
        game_session_id: input.game_session_id,
        enemy_type: input.enemy_type,
        x_position: input.x_position,
        y_position: input.y_position,
        health: stats.health,
        max_health: stats.max_health,
        speed: stats.speed,
        damage: stats.damage,
        is_alive: true,
        created_at: new Date()
    } as Enemy);
}