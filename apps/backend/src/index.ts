import express from "express";
import "dotenv/config";
import expressJSDocSwagger from "express-jsdoc-swagger";
import cors from "cors";

import { PORT } from "./core";
import { userRouter, commentRouter } from "./routes";

const app = express();

// Enable CORS for localhost and frontend port
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://frontend:5173",
    "http://dapp:5173",
    "https://firelaunch.io",
    "https://mer.ag",
  ],
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());
app.use("/user", userRouter);
app.use("/comment", commentRouter);

// Swagger options
const options = {
  info: {
    version: "1.0.0",
    title: "Mercury API",
    description: "API Documentation for Mercury Backend",
  },
  baseDir: __dirname,
  filesPattern: "./routes/**/*.ts",
  exposeSwaggerUI: true,
  swaggerUIPath: "/swagger-ui",
  exposeApiDocs: true,
  apiDocsPath: "/api-docs",
  notRequiredAsNullable: false,
  swaggerUiOptions: {},
} ;

// Initialize express-jsdoc-swagger
expressJSDocSwagger(app)(options);

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
