/// <reference types="vite/client" />
import { hcWithType } from "server/dist/client";
import type { Design, Dialect } from "shared";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const client = hcWithType(SERVER_URL, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
  }) as typeof fetch,
}).api;

export type ProjectsResponseType = Awaited<
  ReturnType<typeof client.projects.$get>
>;

export const fetchProjects = async () => {
  const response = await client.projects.$get();
  return response.json();
};

export const fetchProject = async (projectId: string) => {
  const response = await client.projects[":id"].$get({
    param: { id: projectId },
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(
        `Failed to fetch project with id ${projectId}: ${response.statusText}`
      )
    );
  }
  return response.json();
};

export const createProject = async (data: {
  name: string;
  description?: string;
  dialect?: Dialect;
}) => {
  const response = await client.projects.$post({
    json: data,
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(`Failed to create project: ${response.statusText}`)
    );
  }
  return response.json();
};

export const deleteProject = async (projectId: string) => {
  const response = await client.projects[":id"].$delete({
    param: { id: projectId },
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(
        `Failed to delete project with id ${projectId}: ${response.statusText}`
      )
    );
  }
  return response.json();
};

export const updateProject = async (
  projectId: string,
  data: {
    name?: string;
    description?: string;
    dialect?: Dialect;
    design?: Design;
  }
) => {
  const response = await client.projects[":id"].$put({
    param: { id: projectId },
    json: data,
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(
        `Failed to update project with id ${projectId}: ${response.statusText}`
      )
    );
  }
  return response.json();
};

export const fetchAIConversation = async (projectId: string) => {
  const response = await client.ai[":id"].ai.$get({
    param: { id: projectId },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch conversation: ${response.statusText}`);
  }
  return response.json();
};

export const sendAIMessage = async function* (
  projectId: string,
  message: string
) {
  const response = await client.ai[":id"].ai.$post({
    param: { id: projectId },
    json: { message },
  });

  if (!response.ok) {
    throw new Error(`Failed to send AI message: ${response.statusText}`);
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response body");
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      yield chunk;
    }
  } finally {
    reader.releaseLock();
  }
};

export const exportProjectSQL = async (projectId: string) => {
  const response = await client.projects[":id"].export.sql.$get({
    param: { id: projectId },
  });
  if (!response.ok) {
    throw new Error(`Failed to export SQL: ${response.statusText}`);
  }

  // Get the filename from Content-Disposition header
  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = "database.sql";
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];
    }
  }

  // Get the SQL content
  const sql = await response.text();

  // Create and trigger download
  const blob = new Blob([sql], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
