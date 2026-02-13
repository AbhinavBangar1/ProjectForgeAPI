import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import issueRoutes from "./routes/issues.js";
import { swaggerSpec, swaggerUi } from "./swagger.js";

const app = express();

app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     description: Returns API status and version
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "online"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
app.get("/api/v1", (req, res) => {
  res.json({ 
    status: "online", 
    version: "1.0.0",
    message: "ProjectForge API is running"
  });
});

app.get("/", (req, res) => {
  res.send("ProjectForge API is running ");
});


// Swagger Documentation
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "ProjectForge API Documentation"
}));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/issues", issueRoutes);


app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Documentation: https://projectforgeapi.onrender.com/api/v1/docs`);
});
