const express = require('express');
const recordController = require('../controllers/record.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { canReadRecords, canModifyRecords } = require('../middleware/authorization.middleware');
const { validate } = require('../middleware/validation.middleware');
const { createRecordSchema, updateRecordSchema, filterRecordsSchema, idParamSchema } = require('../validators');

const router = express.Router();

/**
 * @swagger
 * /api/records:
 *   post:
 *     tags: [Records]
 *     summary: Create a new financial record
 *     description: Create a new income or expense record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 5000.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               description:
 *                 type: string
 *                 example: Monthly salary payment
 *               notes:
 *                 type: string
 *                 example: Additional notes
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Record'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticate, canModifyRecords, validate(createRecordSchema), (req, res) => {
  recordController.createRecord(req, res);
});

/**
 * @swagger
 * /api/records:
 *   get:
 *     tags: [Records]
 *     summary: Get all financial records
 *     description: Get all records with optional filters and pagination
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by transaction type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Record'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get('/', authenticate, canReadRecords, validate(filterRecordsSchema, 'query'), (req, res) => {
  recordController.getRecords(req, res);
});

/**
 * @swagger
 * /api/records/{id}:
 *   get:
 *     tags: [Records]
 *     summary: Get record by ID
 *     description: Get a specific financial record by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Record'
 *       404:
 *         description: Record not found
 */
router.get('/:id', authenticate, canReadRecords, validate(idParamSchema, 'params'), (req, res) => {
  recordController.getRecordById(req, res);
});

/**
 * @swagger
 * /api/records/{id}:
 *   put:
 *     tags: [Records]
 *     summary: Update financial record
 *     description: Update an existing record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Record not found
 */
router.put('/:id', authenticate, canModifyRecords, validate(idParamSchema, 'params'), validate(updateRecordSchema), (req, res) => {
  recordController.updateRecord(req, res);
});

/**
 * @swagger
 * /api/records/{id}:
 *   delete:
 *     tags: [Records]
 *     summary: Delete financial record
 *     description: Soft delete a record (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully
 *       403:
 *         description: Forbidden - Admin only
 *       404:
 *         description: Record not found
 */
router.delete('/:id', authenticate, canModifyRecords, validate(idParamSchema, 'params'), (req, res) => {
  recordController.deleteRecord(req, res);
});

module.exports = router;
