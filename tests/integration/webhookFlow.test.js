import { describe, test, expect, mock, beforeEach } from "bun:test";

describe("Integration Tests - Webhook Flow", () => {
  beforeEach(() => {
    mock.restore();
  });

  describe("Full webhook to GitHub update flow", () => {
    test("should process webhook, generate description, and update PR", async () => {
      const mockDiff = "diff --git a/src/auth.js b/src/auth.js\n+added auth";
      const mockCommits = [
        { commit: { message: "Add authentication" } },
        { commit: { message: "Add tests" } },
      ];
      const mockDescription = "## Summary\nAdded authentication feature";

      const mockGeneratePRDescription = mock(() =>
        Promise.resolve(mockDescription)
      );
      const mockUpdatePRDescription = mock(() =>
        Promise.resolve({ status: 200 })
      );

      mock.module("../../services/prDescriptionService.js", () => ({
        generatePRDescription: mockGeneratePRDescription,
      }));

      mock.module("../../services/githubAPIService.js", () => ({
        updatePRDescription: mockUpdatePRDescription,
        getPRDiff: mock(() => Promise.resolve(mockDiff)),
        getPRCommits: mock(() => Promise.resolve(mockCommits)),
      }));

      const { webhookService } = await import(
        "../../services/webhookService.js"
      );

      const webhookPayload = {
        action: "opened",
        pull_request: {
          number: 1,
          title: "Add authentication",
          body: "",
          user: { login: "developer" },
          base: { ref: "main" },
          head: { ref: "feature-auth" },
          additions: 50,
          deletions: 10,
          changed_files: 3,
        },
        repository: {
          owner: { login: "testorg" },
          name: "testrepo",
        },
        installation: { id: 12345 },
      };

      const req = { body: webhookPayload };
      const result = await webhookService(req);

      // Verify entire flow executed
      expect(result.success).toBe(true);
      expect(result.message).toContain("updated");

      // Verify generatePRDescription was called with correct params
      expect(mockGeneratePRDescription).toHaveBeenCalledTimes(1);
      const genArgs = mockGeneratePRDescription.mock.calls[0];
      expect(genArgs[0]).toBe(12345); // installationId
      expect(genArgs[1]).toBe("testorg"); // owner
      expect(genArgs[2]).toBe("testrepo"); // repo
      expect(genArgs[3].number).toBe(1); // pull_request

      // Verify updatePRDescription was called with generated description
      expect(mockUpdatePRDescription).toHaveBeenCalledTimes(1);
      const updateArgs = mockUpdatePRDescription.mock.calls[0];
      expect(updateArgs[0]).toBe(12345); // installationId
      expect(updateArgs[1]).toBe("testorg"); // owner
      expect(updateArgs[2]).toBe("testrepo"); // repo
      expect(updateArgs[3]).toBe(1); // prNumber
      expect(updateArgs[4]).toBe(mockDescription); // description
    });
  });
});
