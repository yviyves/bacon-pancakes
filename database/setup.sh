#!/bin/bash

# PostgreSQL Database Setup Script for Love Statistics

echo "🐘 Setting up PostgreSQL database for Love Statistics..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   macOS: brew install postgresql"
    echo "   Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Database configuration
DB_NAME="love_statistics"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "📊 Creating database: $DB_NAME"

# Create database if it doesn't exist
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database may already exist"

# Run the schema script
echo "🏗️  Creating tables and inserting sample data..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f schema.sql

echo "✅ Database setup complete!"
echo "🔗 Connection string: postgresql://$DB_USER@$DB_HOST:$DB_PORT/$DB_NAME"
