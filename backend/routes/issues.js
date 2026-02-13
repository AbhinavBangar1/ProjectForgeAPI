import express from "express";
import protect from "../middleware/auth.js";
import {
  createIssue,
  getIssues,
  updateIssue,
  deleteIssue
} from "../controllers/issues.js";

const router = express.Router();

/**
 * @swagger
 * /issues:
 *   post:
 *     summary: Create a new issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - project_id
 *             properties:
 *               title:
 *                 type: string
 *                 example: Fix login bug
 *               description:
 *                 type: string
 *                 example: Users cannot login with special characters
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *                 example: open
 *               project_id:
 *                 type: string
 *                 example: 123e4567-e89b-12d3-a456-426614174000
 *     responses:
 *       201:
 *         description: Issue created successfully
 *       401:
 *         description: Not authenticated
 */
router.post("/", protect, createIssue);

/**
 * @swagger
 * /issues:
 *   get:
 *     summary: Get issues for a project
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of issues
 *       401:
 *         description: Not authenticated
 */
router.get("/", protect, getIssues);

/**
 * @swagger
 * /issues/{id}:
 *   put:
 *     summary: Update an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, in_progress, closed]
 *     responses:
 *       200:
 *         description: Issue updated successfully
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Issue not found
 */
router.put("/:id", protect, updateIssue);

/**
 * @swagger
 * /issues/{id}:
 *   delete:
 *     summary: Delete an issue
 *     tags: [Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Issue deleted successfully
 *       401:
 *         description: Not authenticated
 */
router.delete("/:id", protect, deleteIssue);

export default router;
