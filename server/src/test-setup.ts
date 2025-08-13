import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import * as authSchema from "./db/schemas/auth-schema";
import * as projectsSchema from "./db/schemas/projects-schema";
import { beforeEach, afterAll } from "vitest";

export const testDb = drizzle(":memory:", {
  schema: { ...authSchema, ...projectsSchema },
});

export async function setupTestDb() {
  await migrate(testDb, { migrationsFolder: "./drizzle" });
}

export async function cleanupTestDb() {
  await testDb.delete(authSchema.session);
  await testDb.delete(authSchema.account);
  await testDb.delete(projectsSchema.projects);
  await testDb.delete(authSchema.user);
}

beforeEach(async () => {
  await setupTestDb();
  await cleanupTestDb();
});

afterAll(async () => {
  await cleanupTestDb();
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
  design: JSON.stringify({ tables: [] }),
  aiConversation: JSON.stringify([]),
  createdBy: testUser.id,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
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
