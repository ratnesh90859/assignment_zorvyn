const Record = require('../models/record.model');
const User = require('../models/user.model');
const { TransactionType, TransactionCategory } = require('../constants');
const logger = require('../utils/logger');

/**
 * Seed dummy financial records into the database
 */
async function seedRecords() {
  try {
    // Check if records already exist
    const existingRecords = await Record.countDocuments();
    
    if (existingRecords > 0) {
      logger.info(`Database already contains ${existingRecords} records. Skipping seed.`);
      return;
    }

    logger.info('Seeding dummy financial records...');

    // Get admin user to associate records with
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      logger.error('Admin user not found. Please run user seeding first.');
      return;
    }

    // Generate dates for the last 6 months
    const today = new Date();
    const getRandomDate = (monthsBack) => {
      const date = new Date();
      date.setMonth(date.getMonth() - monthsBack);
      date.setDate(Math.floor(Math.random() * 28) + 1);
      return date;
    };

    // Dummy financial records with realistic data
    const dummyRecords = [
      // Income Records
      {
        userId: adminUser._id,
        amount: 5000.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        date: getRandomDate(0),
        description: 'Monthly salary - January 2024',
        notes: 'Regular monthly payment'
      },
      {
        userId: adminUser._id,
        amount: 5000.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        date: getRandomDate(1),
        description: 'Monthly salary - December 2023',
        notes: 'Regular monthly payment'
      },
      {
        userId: adminUser._id,
        amount: 5000.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        date: getRandomDate(2),
        description: 'Monthly salary - November 2023',
        notes: 'Regular monthly payment'
      },
      {
        userId: adminUser._id,
        amount: 1200.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.BUSINESS,
        date: getRandomDate(0),
        description: 'Website development project',
        notes: 'Client: ABC Corp'
      },
      {
        userId: adminUser._id,
        amount: 800.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.BUSINESS,
        date: getRandomDate(1),
        description: 'Mobile app consultation',
        notes: 'Client: XYZ Ltd'
      },
      {
        userId: adminUser._id,
        amount: 2500.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.SALARY,
        date: getRandomDate(2),
        description: 'Annual performance bonus',
        notes: 'Year-end bonus payment'
      },
      {
        userId: adminUser._id,
        amount: 150.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.INVESTMENT,
        date: getRandomDate(0),
        description: 'Stock dividends',
        notes: 'Quarterly dividend payment'
      },
      {
        userId: adminUser._id,
        amount: 300.00,
        type: TransactionType.INCOME,
        category: TransactionCategory.OTHER,
        date: getRandomDate(1),
        description: 'Apartment rental income',
        notes: 'Monthly rent from tenant'
      },

      // Expense Records
      {
        userId: adminUser._id,
        amount: 1200.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(0),
        description: 'Monthly apartment rent',
        notes: 'Paid to landlord'
      },
      {
        userId: adminUser._id,
        amount: 1200.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(1),
        description: 'Monthly apartment rent',
        notes: 'Paid to landlord'
      },
      {
        userId: adminUser._id,
        amount: 1200.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(2),
        description: 'Monthly apartment rent',
        notes: 'Paid to landlord'
      },
      {
        userId: adminUser._id,
        amount: 450.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        date: getRandomDate(0),
        description: 'Weekly grocery shopping',
        notes: 'Supermarket - monthly total'
      },
      {
        userId: adminUser._id,
        amount: 420.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        date: getRandomDate(1),
        description: 'Weekly grocery shopping',
        notes: 'Supermarket - monthly total'
      },
      {
        userId: adminUser._id,
        amount: 150.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.UTILITIES,
        date: getRandomDate(0),
        description: 'Electricity bill',
        notes: 'Monthly electricity payment'
      },
      {
        userId: adminUser._id,
        amount: 80.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.UTILITIES,
        date: getRandomDate(0),
        description: 'Internet and cable',
        notes: 'Monthly ISP payment'
      },
      {
        userId: adminUser._id,
        amount: 60.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.UTILITIES,
        date: getRandomDate(1),
        description: 'Water bill',
        notes: 'Quarterly water payment'
      },
      {
        userId: adminUser._id,
        amount: 200.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.TRANSPORT,
        date: getRandomDate(0),
        description: 'Monthly metro pass',
        notes: 'Public transportation'
      },
      {
        userId: adminUser._id,
        amount: 80.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.TRANSPORT,
        date: getRandomDate(0),
        description: 'Uber rides',
        notes: 'Monthly ride-sharing'
      },
      {
        userId: adminUser._id,
        amount: 120.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        date: getRandomDate(0),
        description: 'Restaurant meals',
        notes: 'Dining out expenses'
      },
      {
        userId: adminUser._id,
        amount: 95.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.FOOD,
        date: getRandomDate(1),
        description: 'Restaurant and cafes',
        notes: 'Monthly dining expenses'
      },
      {
        userId: adminUser._id,
        amount: 250.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.HEALTHCARE,
        date: getRandomDate(1),
        description: 'Doctor consultation and medicines',
        notes: 'Medical expenses'
      },
      {
        userId: adminUser._id,
        amount: 50.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.ENTERTAINMENT,
        date: getRandomDate(0),
        description: 'Movie tickets and streaming',
        notes: 'Netflix, Spotify subscriptions'
      },
      {
        userId: adminUser._id,
        amount: 180.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.SHOPPING,
        date: getRandomDate(0),
        description: 'Clothing and accessories',
        notes: 'Winter clothes shopping'
      },
      {
        userId: adminUser._id,
        amount: 75.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.SHOPPING,
        date: getRandomDate(1),
        description: 'Personal care items',
        notes: 'Toiletries and cosmetics'
      },
      {
        userId: adminUser._id,
        amount: 300.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(2),
        description: 'Health insurance premium',
        notes: 'Monthly insurance payment'
      },
      {
        userId: adminUser._id,
        amount: 100.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.EDUCATION,
        date: getRandomDate(1),
        description: 'Online course - Web Development',
        notes: 'Udemy course purchase'
      },
      {
        userId: adminUser._id,
        amount: 45.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.UTILITIES,
        date: getRandomDate(0),
        description: 'Mobile phone bill',
        notes: 'Monthly phone plan'
      },
      {
        userId: adminUser._id,
        amount: 500.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(0),
        description: 'Emergency fund deposit',
        notes: 'Monthly savings contribution'
      },
      {
        userId: adminUser._id,
        amount: 350.00,
        type: TransactionType.EXPENSE,
        category: TransactionCategory.OTHER,
        date: getRandomDate(0),
        description: 'Credit card payment',
        notes: 'Monthly credit card bill'
      }
    ];

    // Insert records
    await Record.insertMany(dummyRecords);

    logger.info(`✓ Successfully seeded ${dummyRecords.length} financial records`);
    logger.info(`  - Income records: ${dummyRecords.filter(r => r.type === TransactionType.INCOME).length}`);
    logger.info(`  - Expense records: ${dummyRecords.filter(r => r.type === TransactionType.EXPENSE).length}`);
    logger.info(`  - Total income: $${dummyRecords.filter(r => r.type === TransactionType.INCOME).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}`);
    logger.info(`  - Total expenses: $${dummyRecords.filter(r => r.type === TransactionType.EXPENSE).reduce((sum, r) => sum + r.amount, 0).toFixed(2)}`);

  } catch (error) {
    logger.error('Error seeding records:', error);
    throw error;
  }
}

module.exports = { seedRecords };
