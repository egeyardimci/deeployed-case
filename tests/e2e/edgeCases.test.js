import {
  describe,
  test,
  expect,
  mock,
  beforeEach,
  setDefaultTimeout,
} from "bun:test";
import { webhookService } from "../../services/webhookService.js";
import * as webhookPayloads from "../fixtures/webhookPayloads.js";
import * as prDiffs from "../fixtures/prDiffs.js";
import * as commits from "../fixtures/commits.js";

// Set longer timeout for e2e tests that call real LLM
setDefaultTimeout(30000); // 30 seconds

// Helper function to wrap payload in request format
const handlePullRequestEvent = (payload) => {
  return webhookService({ body: payload });
};

describe("E2E Edge Case Tests - PR Scenarios", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    mock.restore();
  });

  describe("PR with only whitespace changes", () => {
    test("should generate meaningful description for formatting-only changes", async () => {
      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve(prDiffs.whitespaceOnlyDiff)),
        getPRCommits: mock(() =>
          Promise.resolve([
            {
              sha: "format123",
              commit: { message: "Fix indentation and formatting" },
            },
          ])
        ),
        updatePRDescription: mock(() => Promise.resolve({ status: 200 })),
      }));

      const result = await handlePullRequestEvent(
        webhookPayloads.prWithOnlyWhitespaceChanges
      );

      expect(result.success).toBe(true);
    });
  });

  describe("PR with binary files", () => {
    test("should handle binary files gracefully in diff", async () => {
      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve(prDiffs.binaryFileDiff)),
        getPRCommits: mock(() =>
          Promise.resolve([
            {
              sha: "asset123",
              commit: { message: "Add logo and icons" },
            },
          ])
        ),
        updatePRDescription: mock(() => Promise.resolve({ status: 200 })),
      }));

      const result = await handlePullRequestEvent(
        webhookPayloads.prWithBinaryFiles
      );

      expect(result.success).toBe(true);
    });
  });

  describe("PR with merge conflicts", () => {
    test("should process PR with conflicts and generate description", async () => {
      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve(prDiffs.conflictDiff)),
        getPRCommits: mock(() =>
          Promise.resolve([
            {
              sha: "conflict123",
              commit: { message: "Merge feature into main" },
            },
          ])
        ),
        updatePRDescription: mock(() => Promise.resolve({ status: 200 })),
      }));

      const result = await handlePullRequestEvent(
        webhookPayloads.prWithMergeConflicts
      );

      expect(result.success).toBe(true);
    });
  });

  describe("PR with many commits (50+)", () => {
    test("should handle large commit history efficiently", async () => {
      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve(prDiffs.largeDiff)),
        getPRCommits: mock(() => Promise.resolve(commits.manyCommits)),
        updatePRDescription: mock(() => Promise.resolve({ status: 200 })),
      }));

      const result = await handlePullRequestEvent(
        webhookPayloads.prWithManyCommits
      );

      expect(result.success).toBe(true);
    });
  });

  describe("PR with empty diff", () => {
    test("should handle empty diff edge case", async () => {
      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve(prDiffs.emptyDiff)),
        getPRCommits: mock(() => Promise.resolve(commits.multipleCommits)),
        updatePRDescription: mock(() => Promise.resolve({ status: 200 })),
      }));

      const result = await handlePullRequestEvent(
        webhookPayloads.prWithNoDescription
      );

      expect(result.success).toBe(true);
    });
  });
});
