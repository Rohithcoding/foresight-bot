const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

// Configuration
const DB_PATH = process.env.DB_PATH || './scrims.sqlite';

async function clearBotData() {
  try {
    // Create backup of existing database if it exists
    if (fs.existsSync(DB_PATH)) {
      const backupPath = `${DB_PATH}.${Date.now()}.bak`;
      fs.copyFileSync(DB_PATH, backupPath);
      console.log(`Created backup at: ${backupPath}`);
    }

    // Initialize new database
    const db = await open({
      filename: DB_PATH,
      driver: sqlite3.Database
    });

    // Drop existing tables
    await db.exec(`
      DROP TABLE IF EXISTS teams;
      DROP TABLE IF EXISTS scrims;
      DROP TABLE IF EXISTS daily_registration;
    `);

    // Recreate tables with clean schema
    await db.exec(`
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

    console.log('Successfully cleared all bot data and reset database.');
    await db.close();
    
    // Clear any cached data
    if (global.captchaMap) {
      global.captchaMap = {};
    }
    
    console.log('Bot has been reset to initial state.');
    
  } catch (error) {
    console.error('Error clearing bot data:', error);
    process.exit(1);
  }
}

clearBotData();
