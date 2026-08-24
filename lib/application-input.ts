import { ApplicationStatus } from "@/generated/prisma/enums";

const validStatuses = new Set<string>(Object.values(ApplicationStatus));

export type ApplicationInput = {
  company: string;
  position: string;
  status: ApplicationStatus;
  jobUrl: string | null;
  appliedAt: Date | null;
  deadline: Date | null;
  notes: string | null;
};

type ParseApplicationInputResult =
  | {
      success: true;
      data: ApplicationInput;
    }
  | {
      success: false;
      error: string;
    };

export function parseApplicationInput(
  body: unknown,
  options: {
    defaultStatus?: ApplicationStatus;
  } = {},
): ParseApplicationInputResult {
  if (
    typeof body !== "object" ||
    body === null ||
    Array.isArray(body)
  ) {
    return {
      success: false,
      error: "Invalid request body.",
    };
  }

  const {
    company,
    position,
    status,
    jobUrl,
    appliedAt,
    deadline,
    notes,
  } = body as Record<string, unknown>;

  if (
    typeof company !== "string" ||
    !company.trim() ||
    typeof position !== "string" ||
    !position.trim()
  ) {
    return {
      success: false,
      error: "Company and position are required.",
    };
  }

  let normalizedStatus: string;

  if (typeof status === "string" && status) {
    normalizedStatus = status;
  } else if (options.defaultStatus) {
    normalizedStatus = options.defaultStatus;
  } else {
    return {
      success: false,
      error: "Invalid application status.",
    };
  }

  if (!validStatuses.has(normalizedStatus)) {
    return {
      success: false,
      error: "Invalid application status.",
    };
  }

  let normalizedJobUrl: string | null = null;

  if (typeof jobUrl === "string" && jobUrl.trim()) {
    try {
      const url = new URL(jobUrl.trim());

      if (!["http:", "https:"].includes(url.protocol)) {
        throw new Error("Invalid protocol");
      }

      normalizedJobUrl = url.toString();
    } catch {
      return {
        success: false,
        error: "Job URL must be a valid HTTP or HTTPS URL.",
      };
    }
  }

  const parsedAppliedAt =
    typeof appliedAt === "string" && appliedAt
      ? new Date(appliedAt)
      : null;

  const parsedDeadline =
    typeof deadline === "string" && deadline
      ? new Date(deadline)
      : null;

  if (
    (parsedAppliedAt && Number.isNaN(parsedAppliedAt.getTime())) ||
    (parsedDeadline && Number.isNaN(parsedDeadline.getTime()))
  ) {
    return {
      success: false,
      error: "Invalid date.",
    };
  }

  return {
    success: true,
    data: {
      company: company.trim(),
      position: position.trim(),
      status: normalizedStatus as ApplicationStatus,
      jobUrl: normalizedJobUrl,
      appliedAt: parsedAppliedAt,
      deadline: parsedDeadline,
      notes:
        typeof notes === "string" && notes.trim()
          ? notes.trim()
          : null,
    },
  };
}