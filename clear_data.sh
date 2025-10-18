#!/bin/bash

# Define the database path
DB_PATH="./scrims.sqlite"

# Check if the database file exists
if [ -f "$DB_PATH" ]; then
    # Create a backup with timestamp
    BACKUP_PATH="${DB_PATH}.$(date +%Y%m%d_%H%M%S).bak"
    cp "$DB_PATH" "$BACKUP_PATH"
    echo "Created backup at: $BACKUP_PATH"
    
    # Remove the existing database
    rm -f "$DB_PATH"
    echo "Removed existing database."
else
    echo "No existing database found at $DB_PATH"
fi

# Create a new empty database with the required schema
sqlite3 "$DB_PATH" "
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
);"

echo "Successfully created a new clean database with empty tables."
echo "Bot data has been reset to initial state."
