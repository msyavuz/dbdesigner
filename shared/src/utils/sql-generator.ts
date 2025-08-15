import type { Design, Table, Column, Dialect, ForeignKey } from "../types";

type SqlGeneratorOptions = {
  design: Design;
  dialect: Dialect;
};

export function generateSQL({ design, dialect }: SqlGeneratorOptions): string {
  const tables = design.tables;
  const relationships = design.relationships;
  
  let sql = `-- Generated SQL for ${dialect === "general" ? "General SQL" : dialect}\n\n`;

  // Generate CREATE TABLE statements
  for (const table of tables) {
    sql += generateCreateTableSQL(table, dialect) + "\n\n";
  }

  // Generate ALTER TABLE statements for foreign keys
  for (const relationship of relationships) {
    sql += generateForeignKeySQL(relationship, tables, dialect) + "\n";
  }

  return sql.trim();
}

function generateCreateTableSQL(table: Table, dialect: Dialect): string {
  const tableName = escapeIdentifier(table.name, dialect);
  let sql = `CREATE TABLE ${tableName} (\n`;
  
  const columnDefs = table.columns.map(col => generateColumnDefinition(col, dialect));
  
  // Add primary key constraint
  const pkColumns = table.columns.filter(col => col.isPrimaryKey).map(col => escapeIdentifier(col.name, dialect));
  if (pkColumns.length > 0) {
    columnDefs.push(`  CONSTRAINT pk_${table.name} PRIMARY KEY (${pkColumns.join(", ")})`);
  }

  // Add unique constraints
  const uniqueColumns = table.columns.filter(col => col.isUnique && !col.isPrimaryKey);
  for (const col of uniqueColumns) {
    columnDefs.push(`  CONSTRAINT uk_${table.name}_${col.name} UNIQUE (${escapeIdentifier(col.name, dialect)})`);
  }
  
  sql += columnDefs.join(",\n") + "\n";
  sql += ");";
  
  return sql;
}

function generateColumnDefinition(column: Column, dialect: Dialect): string {
  const name = escapeIdentifier(column.name, dialect);
  const type = mapColumnType(column.type, dialect);
  
  let def = `  ${name} ${type}`;
  
  if (!column.isNullable) {
    def += " NOT NULL";
  }
  
  if (column.defaultValue) {
    def += ` DEFAULT ${formatDefaultValue(column.defaultValue, column.type, dialect)}`;
  }
  
  return def;
}

function generateForeignKeySQL(relationship: ForeignKey, tables: Table[], dialect: Dialect): string {
  // Find table objects by ID
  const fromTableObj = tables.find(t => t.id === relationship.fromTable);
  const toTableObj = tables.find(t => t.id === relationship.toTable);
  
  if (!fromTableObj || !toTableObj) {
    console.warn(`Could not find table for relationship: ${relationship.fromTable} -> ${relationship.toTable}`);
    return `-- Warning: Could not resolve table names for foreign key relationship`;
  }
  
  // Find column names by ID
  const fromColumnObj = fromTableObj.columns.find(c => c.id === relationship.fromColumn);
  const toColumnObj = toTableObj.columns.find(c => c.id === relationship.toColumn);
  
  if (!fromColumnObj || !toColumnObj) {
    console.warn(`Could not find column for relationship: ${relationship.fromColumn} -> ${relationship.toColumn}`);
    return `-- Warning: Could not resolve column names for foreign key relationship`;
  }
  
  const fromTable = escapeIdentifier(fromTableObj.name, dialect);
  const fromColumn = escapeIdentifier(fromColumnObj.name, dialect);
  const toTable = escapeIdentifier(toTableObj.name, dialect);
  const toColumn = escapeIdentifier(toColumnObj.name, dialect);
  
  let sql = `ALTER TABLE ${fromTable} ADD CONSTRAINT fk_${fromTableObj.name}_${fromColumnObj.name}`;
  sql += ` FOREIGN KEY (${fromColumn}) REFERENCES ${toTable} (${toColumn})`;
  
  if (relationship.onDelete) {
    sql += ` ON DELETE ${relationship.onDelete.toUpperCase()}`;
  } else {
    sql += ` ON DELETE CASCADE`;
  }
  
  sql += ";";
  
  return sql;
}

function escapeIdentifier(identifier: string, dialect: Dialect): string {
  switch (dialect) {
    case "mysql":
      return `\`${identifier}\``;
    case "postgresql":
    case "general":
    default:
      return `"${identifier}"`;
    case "sqlite":
      return `[${identifier}]`;
    case "sqlserver":
      return `[${identifier}]`;
    case "oracle":
      return `"${identifier.toUpperCase()}"`;
  }
}

function mapColumnType(type: string, dialect: Dialect): string {
  // For general SQL, return as-is
  if (dialect === "general") {
    return type.toUpperCase();
  }
  
  // Map common types to dialect-specific types
  const typeMap: Record<Dialect, Record<string, string>> = {
    general: {},
    postgresql: {
      "integer": "INTEGER",
      "text": "TEXT", 
      "boolean": "BOOLEAN",
      "date": "DATE",
      "timestamp": "TIMESTAMP",
      "uuid": "UUID",
      "json": "JSON",
      "float": "REAL",
      "double": "DOUBLE PRECISION",
      "decimal": "NUMERIC",
      "blob": "BYTEA",
    },
    mysql: {
      "integer": "INT",
      "text": "TEXT",
      "boolean": "BOOLEAN",
      "date": "DATE", 
      "timestamp": "TIMESTAMP",
      "uuid": "CHAR(36)",
      "json": "JSON",
      "float": "FLOAT",
      "double": "DOUBLE",
      "decimal": "DECIMAL",
      "blob": "BLOB",
    },
    sqlite: {
      "integer": "INTEGER",
      "text": "TEXT",
      "boolean": "INTEGER",
      "date": "TEXT",
      "timestamp": "TEXT", 
      "uuid": "TEXT",
      "json": "TEXT",
      "float": "REAL",
      "double": "REAL",
      "decimal": "NUMERIC",
      "blob": "BLOB",
    },
    sqlserver: {
      "integer": "INT",
      "text": "NVARCHAR(MAX)",
      "boolean": "BIT",
      "date": "DATE",
      "timestamp": "DATETIME2",
      "uuid": "UNIQUEIDENTIFIER", 
      "json": "NVARCHAR(MAX)",
      "float": "FLOAT",
      "double": "FLOAT",
      "decimal": "DECIMAL",
      "blob": "VARBINARY(MAX)",
    },
    oracle: {
      "integer": "NUMBER",
      "text": "CLOB",
      "boolean": "NUMBER(1)",
      "date": "DATE",
      "timestamp": "TIMESTAMP",
      "uuid": "VARCHAR2(36)",
      "json": "CLOB",
      "float": "BINARY_FLOAT",
      "double": "BINARY_DOUBLE", 
      "decimal": "NUMBER",
      "blob": "BLOB",
    },
  };
  
  return typeMap[dialect][type] || type.toUpperCase();
}

function formatDefaultValue(value: string, type: string, dialect: Dialect): string {
  // Handle string values
  if (type === "text" || type === "varchar" || type === "char") {
    return `'${value.replace(/'/g, "''")}'`;
  }
  
  // Handle boolean values
  if (type === "boolean") {
    if (dialect === "sqlite") {
      return value.toLowerCase() === "true" ? "1" : "0";
    }
    return value.toUpperCase();
  }
  
  // Handle numeric values
  if (type === "integer" || type === "float" || type === "double" || type === "decimal") {
    return value;
  }
  
  // Default: return as-is for functions like NOW(), CURRENT_TIMESTAMP, etc.
  return value;
}