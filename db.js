const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

let _db;

async function getDb() {
  if (_db) return _db;
  
  try {
    // Ensure database directory exists
    const dbDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    _db = await open({
      filename: path.join(dbDir, 'scrims.sqlite'),
      driver: sqlite3.Database
    });

    // Create tables if they don't exist
    await _db.exec(`
      CREATE TABLE IF NOT EXISTS teams (
        team_name TEXT PRIMARY KEY,
        team_tag TEXT,
        captain_id TEXT,
        captain_name TEXT,
        player2_id TEXT,
        player2_name TEXT,
        player3_id TEXT,
        player3_name TEXT,
        substitute_id TEXT,
        substitute_name TEXT
      );
      
      CREATE TABLE IF NOT EXISTS scrims (
        scrim_name TEXT PRIMARY KEY,
        start_time TEXT,
        end_time TEXT,
        mention_role_id TEXT,
        day_of_week TEXT
      );
      
      CREATE TABLE IF NOT EXISTS daily_registration (
        scrim_name TEXT,
        team_name TEXT,
        checked_in INTEGER,
        PRIMARY KEY(scrim_name, team_name)
      );
    `);
    
    console.log('Database initialized successfully');
    return _db;
  } catch (error) {
    console.error('Database initialization error:', error);
    process.exit(1);
  }
}

module.exports = { getDb };
