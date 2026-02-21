import { ElysiaOpenAPIConfig } from "@elysiajs/openapi";

export const openapiConfig: ElysiaOpenAPIConfig = {
  path: "/swagger",
  documentation: {
    info: {
      title: "ACS Core Service API",
      version: "1.0.0",
      description: "API Documentation",
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie", // 👈 บอกว่าส่งมาทาง Cookie
          name: "accessToken", // 👈 ชื่อ Cookie ที่ต้องส่ง
        },
      },
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
      {
        name: "Curriculum",
        description: "Curriculum Management Endpoints",
      },
      {
        name: "Professors",
        description: "Professors Management Endpoints",
      },
      {
        name: "Courses",
        description: "Courses Management Endpoints",
      },
      {
        name: "Master Data",
        description: "Master Data Management Endpoints",
      },
      {
        name: "Auth",
        description: "Authentication Endpoints",
      },
      {
        name: "Projects",
        description: "Projects Management Endpoints",
      },
    ],
  },
  provider: "scalar",
};
