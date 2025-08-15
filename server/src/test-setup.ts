import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import * as authSchema from "./db/schemas/auth-schema";
import * as projectsSchema from "./db/schemas/projects-schema";
import { beforeEach, afterAll, beforeAll } from "vitest";

const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ||
  (process.env.DATABASE_URL
    ? process.env.DATABASE_URL.replace(/\/\w+$/, "/test")
    : "postgresql://localhost:5432/test");

const testDbName = testDatabaseUrl.split("/").pop() || "test";
const adminDatabaseUrl = testDatabaseUrl.replace(/\/\w+$/, "/postgres");

const pool = new Pool({
  connectionString: testDatabaseUrl,
});

export const testDb = drizzle(pool, {
  schema: { ...authSchema, ...projectsSchema },
});

async function createTestDatabase() {
  const adminPool = new Pool({
    connectionString: adminDatabaseUrl,
  });

  try {
    await adminPool.query(`CREATE DATABASE "${testDbName}"`);
  } catch (error: any) {
    // Ignore error if database already exists
    if (error.code !== "42P04") {
      throw error;
    }
  } finally {
    await adminPool.end();
  }
}

export async function setupTestDb() {
  await migrate(testDb, { migrationsFolder: "./drizzle" });
  
  // Clear all tables before each test run
  await testDb.delete(authSchema.session);
  await testDb.delete(authSchema.account);
  await testDb.delete(authSchema.verification);
  await testDb.delete(projectsSchema.projects);
  await testDb.delete(authSchema.user);
}


beforeAll(async () => {
  await createTestDatabase();
});

beforeEach(async () => {
  await setupTestDb();
});

afterAll(async () => {
  // Just close connections, don't drop the database
  // The database will be reused for future test runs
  await pool.end();
});

export const testUser = {
  id: "test-user-123",
  name: "Test User",
  email: "test@example.com",
  emailVerified: false,
  image: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testProject = {
  id: "test-project-123",
  name: "Test Project",
  description: "Test Description",
  design: {
    id: "test-design-123",
    name: "Test Design",
    relationships: [],
    tables: [],
  },
  aiConversation: JSON.stringify([]),
  createdBy: testUser.id,
};

export async function createTestUser() {
  const [user] = await testDb
    .insert(authSchema.user)
    .values(testUser)
    .returning();
  return user;
}

export async function createTestProject() {
  await createTestUser();
  const [project] = await testDb
    .insert(projectsSchema.projects)
    .values(testProject)
    .returning();
  return project;
}
