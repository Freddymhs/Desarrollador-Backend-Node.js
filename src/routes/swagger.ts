import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import { basicInfo, registry } from "@config/swagger";

const swaggerRoute = Router();
const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiDocument = generator.generateDocument(basicInfo);

swaggerRoute.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

export default swaggerRoute;
