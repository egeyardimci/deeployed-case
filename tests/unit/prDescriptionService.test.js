import { describe, test, expect, mock, beforeEach } from "bun:test";

describe("Unit Tests - prDescriptionService", () => {
  beforeEach(() => {
    mock.restore();
  });

  describe("generatePRDescription", () => {
    test("should assemble correct context object from PR data", async () => {
      let capturedContext;

      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve("diff content")),
        getPRCommits: mock(() =>
          Promise.resolve([
            { commit: { message: "Commit 1" } },
            { commit: { message: "Commit 2" } },
          ])
        ),
      }));

      mock.module("../../services/llmService.js", () => ({
        callLLMService: mock((_systemPrompt, userQuery) => {
          capturedContext = userQuery;
          return Promise.resolve("Description");
        }),
      }));

      const { generatePRDescription } = await import(
        "../../services/prDescriptionService.js?t=" + Date.now()
      );

      const pull_request = {
        number: 1,
        title: "Add authentication",
        user: { login: "developer" },
        base: { ref: "main" },
        head: { ref: "feature-auth" },
        additions: 100,
        deletions: 20,
        changed_files: 5,
      };

      await generatePRDescription(12345, "owner", "repo", pull_request);

      // Verify context contains all expected information
      expect(capturedContext).toContain("Add authentication");
      expect(capturedContext).toContain("developer");
      expect(capturedContext).toContain("main");
      expect(capturedContext).toContain("feature-auth");
      expect(capturedContext).toContain("100 additions");
      expect(capturedContext).toContain("20 deletions");
      expect(capturedContext).toContain("5 file(s) changed");
      expect(capturedContext).toContain("Commit 1");
      expect(capturedContext).toContain("Commit 2");
      expect(capturedContext).toContain("diff content");
    });

    test("should call LLM service with system prompt from constants", async () => {
      let capturedSystemPrompt;

      mock.module("../../services/githubAPIService.js", () => ({
        getPRDiff: mock(() => Promise.resolve("diff")),
        getPRCommits: mock(() =>
          Promise.resolve([{ commit: { message: "commit" } }])
        ),
      }));

      mock.module("../../services/llmService.js", () => ({
        // eslint-disable-next-line no-unused-vars
        callLLMService: mock((systemPrompt, _userQuery) => {
          capturedSystemPrompt = systemPrompt;
          return Promise.resolve("Description");
        }),
      }));

      const { generatePRDescription } = await import(
        "../../services/prDescriptionService.js?t=" + Date.now()
      );

      const pull_request = {
        number: 1,
        title: "Test",
        user: { login: "user" },
        base: { ref: "main" },
        head: { ref: "branch" },
        additions: 1,
        deletions: 0,
        changed_files: 1,
      };

      await generatePRDescription(12345, "owner", "repo", pull_request);

      // Verify system prompt was passed
      expect(capturedSystemPrompt).toBeDefined();
      expect(capturedSystemPrompt.length).toBeGreaterThan(0);
    });
  });
});
