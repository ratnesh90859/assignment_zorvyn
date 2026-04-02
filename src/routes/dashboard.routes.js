const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { canReadRecords } = require('../middleware/authorization.middleware');

const router = express.Router();

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get complete dashboard summary
 *     description: Returns total income, total expense, net balance, category-wise breakdown, recent activity, and monthly trends
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: monthly
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: true
 *         description: Include monthly trends (default true)
 *       - in: query
 *         name: weekly
 *         schema:
 *           type: string
 *           enum: [true, false]
 *           default: false
 *         description: Include weekly trends
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Dashboard summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalIncome:
 *                       type: number
 *                       example: 19950.00
 *                     totalExpense:
 *                       type: number
 *                       example: 7105.00
 *                     netBalance:
 *                       type: number
 *                       example: 12845.00
 *                     categoryWiseTotals:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: salary
 *                           type:
 *                             type: string
 *                             example: income
 *                           total:
 *                             type: number
 *                             example: 15000.00
 *                           count:
 *                             type: integer
 *                             example: 3
 *                     recentActivity:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Record'
 *                     monthlyTrends:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           month:
 *                             type: string
 *                             example: January
 *                           year:
 *                             type: integer
 *                             example: 2024
 *                           income:
 *                             type: number
 *                             example: 5000.00
 *                           expense:
 *                             type: number
 *                             example: 2000.00
 *                           netBalance:
 *                             type: number
 *                             example: 3000.00
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/summary', authenticate, canReadRecords, (req, res) => {
  dashboardController.getDashboardSummary(req, res);
});

/**
 * @swagger
 * /api/dashboard/income:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get income summary
 *     description: Returns total income amount broken down by category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Income summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Income summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 19950.00
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: salary
 *                           type:
 *                             type: string
 *                             example: income
 *                           total:
 *                             type: number
 *                             example: 15000.00
 *                           count:
 *                             type: integer
 *                             example: 3
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/income', authenticate, canReadRecords, (req, res) => {
  dashboardController.getIncomeSummary(req, res);
});

/**
 * @swagger
 * /api/dashboard/expense:
 *   get:
 *     tags: [Dashboard]
 *     summary: Get expense summary
 *     description: Returns total expense amount broken down by category
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Expense summary retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Expense summary retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 7105.00
 *                     byCategory:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           category:
 *                             type: string
 *                             example: food
 *                           type:
 *                             type: string
 *                             example: expense
 *                           total:
 *                             type: number
 *                             example: 1085.00
 *                           count:
 *                             type: integer
 *                             example: 4
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/expense', authenticate, canReadRecords, (req, res) => {
  dashboardController.getExpenseSummary(req, res);
});

module.exports = router;
