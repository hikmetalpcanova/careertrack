import { describe, expect, it } from "vitest";
import { ApplicationStatus } from "@/generated/prisma/enums";
import { parseApplicationInput } from "@/lib/application-input";

describe("parseApplicationInput", () => {
  it("parses a valid application", () => {
    const result = parseApplicationInput({
      company: "  Spotify  ",
      position: "  Software Engineering Intern  ",
      status: "APPLIED",
      jobUrl: "https://spotify.com/jobs",
      appliedAt: "2026-08-24",
      deadline: "2026-09-01",
      notes: "  Follow up next week  ",
    });

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.company).toBe("Spotify");
    expect(result.data.position).toBe("Software Engineering Intern");
    expect(result.data.status).toBe(ApplicationStatus.APPLIED);
    expect(result.data.jobUrl).toBe("https://spotify.com/jobs");
    expect(result.data.notes).toBe("Follow up next week");
    expect(result.data.appliedAt).toBeInstanceOf(Date);
    expect(result.data.deadline).toBeInstanceOf(Date);
  });

  it("uses the default status when status is missing", () => {
    const result = parseApplicationInput(
      {
        company: "Microsoft",
        position: "Software Engineering Intern",
      },
      {
        defaultStatus: ApplicationStatus.SAVED,
      },
    );

    expect(result.success).toBe(true);

    if (!result.success) {
      return;
    }

    expect(result.data.status).toBe(ApplicationStatus.SAVED);
  });

  it("rejects an invalid URL", () => {
    const result = parseApplicationInput({
      company: "GitLab",
      position: "Intern",
      status: "SAVED",
      jobUrl: "abc",
    });

    expect(result).toEqual({
      success: false,
      error: "Job URL must be a valid HTTP or HTTPS URL.",
    });
  });

  it("rejects an invalid status", () => {
    const result = parseApplicationInput({
      company: "Tesla",
      position: "Intern",
      status: "INVALID",
    });

    expect(result).toEqual({
      success: false,
      error: "Invalid application status.",
    });
  });

  it("rejects missing company or position", () => {
    const result = parseApplicationInput({
      company: "",
      position: "Intern",
      status: "SAVED",
    });

    expect(result).toEqual({
      success: false,
      error: "Company and position are required.",
    });
  });

  it("rejects invalid dates", () => {
    const result = parseApplicationInput({
      company: "Booking.com",
      position: "Intern",
      status: "APPLIED",
      appliedAt: "not-a-date",
    });

    expect(result).toEqual({
      success: false,
      error: "Invalid date.",
    });
  });
});