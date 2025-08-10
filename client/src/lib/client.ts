import { hcWithType } from "server/dist/client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";

export const client = hcWithType(SERVER_URL, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include",
    });
    //@ts-ignore
  }) satisfies typeof fetch,
});

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
        `Failed to fetch project with id ${projectId}: ${response.statusText}`,
      ),
    );
  }
  return response.json();
};

export const createProject = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await client.projects.$post({
    json: data,
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(`Failed to create project: ${response.statusText}`),
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
        `Failed to delete project with id ${projectId}: ${response.statusText}`,
      ),
    );
  }
  return response.json();
};

export const updateProject = async (
  projectId: string,
  data: { name?: string; description?: string; design?: string },
) => {
  const response = await client.projects[":id"].$put({
    param: { id: projectId },
    json: data,
  });
  if (!response.ok) {
    return Promise.reject(
      new Error(
        `Failed to update project with id ${projectId}: ${response.statusText}`,
      ),
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
  message: string,
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
