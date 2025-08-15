export type ApiResponse = {
  message: string;
  success: true;
};

export type Dialect = "general" | "postgresql" | "mysql" | "sqlite" | "sqlserver" | "oracle";

export const dialectOptions: { value: Dialect; label: string }[] = [
  { value: "general", label: "General SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "sqlserver", label: "SQL Server" },
  { value: "oracle", label: "Oracle" },
];

export * from "./design";
export * from "./dialect-types";
