import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getSessionMock,
  findFirstMock,
  updateApplicationMock,
  deleteApplicationMock,
} = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  findFirstMock: vi.fn(),
  updateApplicationMock: vi.fn(),
  deleteApplicationMock: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: getSessionMock,
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    application: {
      findFirst: findFirstMock,
      update: updateApplicationMock,
      delete: deleteApplicationMock,
    },
  },
}));

import {
  DELETE,
  PATCH,
} from "@/app/api/applications/[id]/route";

function createPatchRequest(body: unknown) {
  return new Request("http://localhost/api/applications/application-1", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createDeleteRequest() {
  return new Request("http://localhost/api/applications/application-1", {
    method: "DELETE",
  });
}

describe("PATCH /api/applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getSessionMock.mockResolvedValue({
      user: {
        id: "user-2",
      },
    });
  });

  it("returns 404 when the application does not belong to the current user", async () => {
    findFirstMock.mockResolvedValue(null);
    

    const response = await PATCH(
      createPatchRequest({
        company: "Spotify",
        position: "Software Engineering Intern",
        status: "INTERVIEW",
      }),
      {
        params: Promise.resolve({
          id: "application-1",
        }),
      },
    );

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "Application not found.",
    });

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        id: "application-1",
        userId: "user-2",
      },
    });

    expect(updateApplicationMock).not.toHaveBeenCalled();
  });
  it("updates the application when it belongs to the current user", async () => {
  findFirstMock.mockResolvedValue({
    id: "application-1",
    userId: "user-2",
  });

  updateApplicationMock.mockResolvedValue({
    id: "application-1",
    company: "Spotify",
    position: "Software Engineering Intern",
    status: "INTERVIEW",
    jobUrl: null,
    appliedAt: null,
    deadline: null,
    notes: "Updated notes",
    userId: "user-2",
  });

  const response = await PATCH(
    createPatchRequest({
      company: "  Spotify  ",
      position: "  Software Engineering Intern  ",
      status: "INTERVIEW",
      jobUrl: "",
      appliedAt: "",
      deadline: "",
      notes: "  Updated notes  ",
    }),
    {
      params: Promise.resolve({
        id: "application-1",
      }),
    },
  );

  expect(response.status).toBe(200);

  expect(findFirstMock).toHaveBeenCalledWith({
    where: {
      id: "application-1",
      userId: "user-2",
    },
  });

  expect(updateApplicationMock).toHaveBeenCalledWith({
    where: {
      id: "application-1",
    },
    data: {
      company: "Spotify",
      position: "Software Engineering Intern",
      status: "INTERVIEW",
      jobUrl: null,
      appliedAt: null,
      deadline: null,
      notes: "Updated notes",
    },
  });

  expect(await response.json()).toEqual({
    id: "application-1",
    company: "Spotify",
    position: "Software Engineering Intern",
    status: "INTERVIEW",
    jobUrl: null,
    appliedAt: null,
    deadline: null,
    notes: "Updated notes",
    userId: "user-2",
  });
});
it("returns 401 when the user is not authenticated", async () => {
  getSessionMock.mockResolvedValue(null);

  const response = await PATCH(
    createPatchRequest({
      company: "Spotify",
      position: "Intern",
      status: "APPLIED",
    }),
    {
      params: Promise.resolve({
        id: "application-1",
      }),
    },
  );

  expect(response.status).toBe(401);

  expect(await response.json()).toEqual({
    error: "Unauthorized.",
  });

  expect(findFirstMock).not.toHaveBeenCalled();
  expect(updateApplicationMock).not.toHaveBeenCalled();
});
});

describe("DELETE /api/applications/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    getSessionMock.mockResolvedValue({
      user: {
        id: "user-2",
      },
    });
  });

  it("returns 404 when the application does not belong to the current user", async () => {
    findFirstMock.mockResolvedValue(null);

    const response = await DELETE(
      createDeleteRequest(),
      {
        params: Promise.resolve({
          id: "application-1",
        }),
      },
    );

    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "Application not found.",
    });

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        id: "application-1",
        userId: "user-2",
      },
    });

    expect(deleteApplicationMock).not.toHaveBeenCalled();
  });
  it("deletes the application when it belongs to the current user", async () => {
  findFirstMock.mockResolvedValue({
    id: "application-1",
    userId: "user-2",
  });

  deleteApplicationMock.mockResolvedValue({
    id: "application-1",
  });

  const response = await DELETE(
    createDeleteRequest(),
    {
      params: Promise.resolve({
        id: "application-1",
      }),
    },
  );

  expect(response.status).toBe(200);

  expect(findFirstMock).toHaveBeenCalledWith({
    where: {
      id: "application-1",
      userId: "user-2",
    },
  });

  expect(deleteApplicationMock).toHaveBeenCalledWith({
    where: {
      id: "application-1",
    },
  });

  expect(await response.json()).toEqual({
    message: "Application deleted successfully.",
  });
});
it("returns 401 when the user is not authenticated", async () => {
  getSessionMock.mockResolvedValue(null);

  const response = await DELETE(
    createDeleteRequest(),
    {
      params: Promise.resolve({
        id: "application-1",
      }),
    },
  );

  expect(response.status).toBe(401);

  expect(await response.json()).toEqual({
    error: "Unauthorized.",
  });

  expect(findFirstMock).not.toHaveBeenCalled();
  expect(deleteApplicationMock).not.toHaveBeenCalled();
});
});