export const openApiDoc = {
  openapi: "3.0.0",
  info: {
    title: "DBDesigner API Documentation",
    version: "1.0.0",
    description: "API Documentation for dbdesigner",
  },
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
          },
        },
      },
    },
  },
};
