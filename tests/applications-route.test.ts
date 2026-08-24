import { beforeEach, describe, expect, it, vi } from "vitest";

const { getSessionMock, createApplicationMock } = vi.hoisted(() => ({
  getSessionMock: vi.fn(),
  createApplicationMock: vi.fn(),
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
      create: createApplicationMock,
    },
  },
}));

import { POST } from "@/app/api/applications/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/applications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/applications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not authenticated", async () => {
    getSessionMock.mockResolvedValue(null);

    const response = await POST(
      createRequest({
        company: "Spotify",
        position: "Intern",
        status: "APPLIED",
      }),
    );

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Unauthorized.",
    });

    expect(createApplicationMock).not.toHaveBeenCalled();
  });

  it("returns 400 when the application input is invalid", async () => {
    getSessionMock.mockResolvedValue({
      user: {
        id: "user-1",
      },
    });

    const response = await POST(
      createRequest({
        company: "Spotify",
        position: "Intern",
        status: "SAVED",
        jobUrl: "abc",
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "Job URL must be a valid HTTP or HTTPS URL.",
    });

    expect(createApplicationMock).not.toHaveBeenCalled();
  });

  it("creates an application for the authenticated user", async () => {
    getSessionMock.mockResolvedValue({
      user: {
        id: "user-1",
      },
    });

    createApplicationMock.mockResolvedValue({
      id: "application-1",
      company: "Spotify",
      position: "Software Engineering Intern",
      status: "APPLIED",
      userId: "user-1",
    });

    const response = await POST(
      createRequest({
        company: "  Spotify  ",
        position: "  Software Engineering Intern  ",
        status: "APPLIED",
        jobUrl: "",
        appliedAt: "",
        deadline: "",
        notes: "",
      }),
    );

    expect(response.status).toBe(201);

    expect(createApplicationMock).toHaveBeenCalledWith({
      data: {
        company: "Spotify",
        position: "Software Engineering Intern",
        status: "APPLIED",
        jobUrl: null,
        appliedAt: null,
        deadline: null,
        notes: null,
        userId: "user-1",
      },
    });

    expect(await response.json()).toEqual({
      id: "application-1",
      company: "Spotify",
      position: "Software Engineering Intern",
      status: "APPLIED",
      userId: "user-1",
    });
  });
});