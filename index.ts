import express, { Express } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import {appRouter} from "./infrastructure/routes/appRouter";

dotenv.config()

const app: Express = express(), port = process.env.PORT || 8000;
app.use(express.json());
app.use(cors());

const swaggerUI = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')
const path = require("path");
const file = fs.readFileSync(path.resolve(__dirname, "./infrastructure/api/swagger.yml"), 'utf8');
const swaggerDocument = YAML.parse(file)

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(appRouter);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
});