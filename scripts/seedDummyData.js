#!/usr/bin/env node

/**
 * Standalone script to seed dummy financial records
 * Run: node scripts/seedDummyData.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { seedRecords } = require('../src/config/seedRecords');
const config = require('../src/config');
const logger = require('../src/utils/logger');

async function main() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ Connected to MongoDB\n');

    // Seed records
    await seedRecords();

    console.log('\n✓ Database seeding completed successfully!');
    console.log('You can now use the API to view and manage these records.\n');

    // Close connection
    await mongoose.connection.close();
    console.log('✓ Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
}

main();
