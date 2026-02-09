import { ElysiaOpenAPIConfig } from "@elysiajs/openapi";

export const openapiConfig: ElysiaOpenAPIConfig = {
  path: "/swagger",
  documentation: {
    info: {
      title: "ACS Core Service API",
      version: "1.0.0",
      description: "API Documentation",
    },
    tags: [
      {
        name: "Users ",
        description: "User Management Endpoints",
      },
      {
        name: "Health",
        description: "Health Check Endpoints",
      },
      {
        name: "News",
        description: "News Management Endpoints",
      },
      {
        name: "Students",
        description: "Student Management Endpoints",
      },
    ],
  },
  provider: "scalar",
};
