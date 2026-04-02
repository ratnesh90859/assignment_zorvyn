#!/usr/bin/env node

/**
 * Standalone script to clear all financial records
 * Run: node scripts/clearRecords.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Record = require('../src/models/record.model');
const config = require('../src/config');

async function main() {
  try {
    console.log('🗑️  Starting database cleanup...\n');

    // Connect to MongoDB
    await mongoose.connect(config.mongodb.uri);
    console.log('✓ Connected to MongoDB\n');

    // Count existing records
    const count = await Record.countDocuments();
    console.log(`Found ${count} records in database`);

    if (count === 0) {
      console.log('No records to delete.\n');
    } else {
      // Delete all records
      const result = await Record.deleteMany({});
      console.log(`✓ Deleted ${result.deletedCount} financial records\n`);
    }

    // Close connection
    await mongoose.connection.close();
    console.log('✓ Database connection closed');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  }
}

main();
