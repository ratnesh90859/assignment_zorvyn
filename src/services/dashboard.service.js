const Record = require('../models/record.model');
const { TransactionType } = require('../constants');

/**
 * Dashboard Service
 * Handles dashboard analytics and summary calculations
 */
class DashboardService {
  /**
   * Get complete dashboard summary for a user
   */
  async getDashboardSummary(userId, includeMonthly = true, includeWeekly = false) {
    const records = await Record.find({ userId, deletedAt: null });

    // Calculate totals
    const totalIncome = records
      .filter(r => r.type === TransactionType.INCOME)
      .reduce((sum, r) => sum + r.amount, 0);

    const totalExpense = records
      .filter(r => r.type === TransactionType.EXPENSE)
      .reduce((sum, r) => sum + r.amount, 0);

    const netBalance = totalIncome - totalExpense;

    // Calculate category-wise totals
    const categoryWiseTotals = this.calculateCategoryTotals(records);

    // Get recent activity (last 10 transactions)
    const recentActivity = records
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 10);

    // Build summary
    const summary = {
      totalIncome,
      totalExpense,
      netBalance,
      categoryWiseTotals,
      recentActivity
    };

    // Add monthly trends if requested
    if (includeMonthly) {
      summary.monthlyTrends = this.calculateMonthlyTrends(records);
    }

    // Add weekly trends if requested
    if (includeWeekly) {
      summary.weeklyTrends = this.calculateWeeklyTrends(records);
    }

    return summary;
  }

  /**
   * Calculate category-wise totals
   */
  calculateCategoryTotals(records) {
    const categoryMap = new Map();

    records.forEach(record => {
      const key = `${record.category}-${record.type}`;
      
      if (categoryMap.has(key)) {
        const existing = categoryMap.get(key);
        existing.total += record.amount;
        existing.count += 1;
      } else {
        categoryMap.set(key, {
          category: record.category,
          type: record.type,
          total: record.amount,
          count: 1
        });
      }
    });

    return Array.from(categoryMap.values())
      .sort((a, b) => b.total - a.total);
  }

  /**
   * Calculate monthly trends
   */
  calculateMonthlyTrends(records) {
    const monthMap = new Map();

    records.forEach(record => {
      const date = new Date(record.date);
      const year = date.getFullYear();
      const month = date.toLocaleString('default', { month: 'long' });
      const key = `${year}-${month}`;

      if (monthMap.has(key)) {
        const existing = monthMap.get(key);
        if (record.type === TransactionType.INCOME) {
          existing.income += record.amount;
        } else {
          existing.expense += record.amount;
        }
        existing.netBalance = existing.income - existing.expense;
      } else {
        monthMap.set(key, {
          month,
          year,
          income: record.type === TransactionType.INCOME ? record.amount : 0,
          expense: record.type === TransactionType.EXPENSE ? record.amount : 0,
          netBalance: record.type === TransactionType.INCOME ? record.amount : -record.amount
        });
      }
    });

    return Array.from(monthMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return new Date(`${b.month} 1`).getMonth() - new Date(`${a.month} 1`).getMonth();
      })
      .slice(0, 12); // Last 12 months
  }

  /**
   * Calculate weekly trends
   */
  calculateWeeklyTrends(records) {
    const weekMap = new Map();

    records.forEach(record => {
      const date = new Date(record.date);
      const year = date.getFullYear();
      const week = this.getWeekNumber(date);
      const key = `${year}-W${week}`;

      if (weekMap.has(key)) {
        const existing = weekMap.get(key);
        if (record.type === TransactionType.INCOME) {
          existing.income += record.amount;
        } else {
          existing.expense += record.amount;
        }
        existing.netBalance = existing.income - existing.expense;
      } else {
        weekMap.set(key, {
          week,
          year,
          income: record.type === TransactionType.INCOME ? record.amount : 0,
          expense: record.type === TransactionType.EXPENSE ? record.amount : 0,
          netBalance: record.type === TransactionType.INCOME ? record.amount : -record.amount
        });
      }
    });

    return Array.from(weekMap.values())
      .sort((a, b) => {
        if (a.year !== b.year) return b.year - a.year;
        return b.week - a.week;
      })
      .slice(0, 8); // Last 8 weeks
  }

  /**
   * Get ISO week number
   */
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  }

  /**
   * Get income summary
   */
  async getIncomeSummary(userId) {
    const records = await Record.find({ 
      userId, 
      type: TransactionType.INCOME,
      deletedAt: null 
    });

    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const byCategory = this.calculateCategoryTotals(records);

    return { total, byCategory };
  }

  /**
   * Get expense summary
   */
  async getExpenseSummary(userId) {
    const records = await Record.find({ 
      userId, 
      type: TransactionType.EXPENSE,
      deletedAt: null 
    });

    const total = records.reduce((sum, r) => sum + r.amount, 0);
    const byCategory = this.calculateCategoryTotals(records);

    return { total, byCategory };
  }
}

// Export singleton instance
const dashboardService = new DashboardService();
module.exports = dashboardService;
