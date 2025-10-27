import { describe, test, expect, mock, beforeEach } from "bun:test";

describe("Unit Tests - githubAPIService", () => {
  beforeEach(() => {
    mock.restore();
  });

  describe("updatePRDescription", () => {
    test("should update PR body with new description", async () => {
      const mockUpdate = mock(() =>
        Promise.resolve({
          data: { number: 1, body: "New description" },
        })
      );

      mock.module("@octokit/rest", () => ({
        Octokit: class MockOctokit {
          pulls = {
            update: mockUpdate,
          };
        },
      }));

      mock.module("@octokit/auth-app", () => ({
        createAppAuth: () => () => Promise.resolve({ token: "mock-token" }),
      }));

      mock.module("fs", () => ({
        default: {
          readFileSync: () => "mock-private-key",
        },
      }));

      const { updatePRDescription } = await import(
        "../../services/githubAPIService.js?t=" + Date.now()
      );

      const newDescription = "## Summary\nThis PR adds a new feature";
      const result = await updatePRDescription(
        12345,
        "owner",
        "repo",
        1,
        newDescription
      );

      expect(result.data.body).toBe("New description");
      expect(mockUpdate).toHaveBeenCalledTimes(1);

      const callArgs = mockUpdate.mock.calls[0][0];
      expect(callArgs.owner).toBe("owner");
      expect(callArgs.repo).toBe("repo");
      expect(callArgs.pull_number).toBe(1);
      expect(callArgs.body).toBe(newDescription);
    });
  });

  describe("Octokit caching", () => {
    let authCallCount = 0;
    let mockAuth;
    let getPRDiff;

    beforeEach(async () => {
      // Reset
      authCallCount = 0;
      mock.restore();

      // Setup mocks BEFORE importing
      mockAuth = mock(() => {
        authCallCount++;
        return Promise.resolve({ token: `token-${authCallCount}` });
      });

      mock.module("@octokit/rest", () => ({
        Octokit: class MockOctokit {
          constructor() {
            this.pulls = {
              get: mock(() =>
                Promise.resolve({
                  data: { diff_url: "diff" },
                })
              ),
            };
          }
        },
      }));

      mock.module("@octokit/auth-app", () => ({
        createAppAuth: mock(() => mockAuth),
      }));

      mock.module("fs", () => ({
        default: {
          readFileSync: mock(() => "mock-private-key"),
        },
      }));

      // Import AFTER mocks are set up
      const module = await import(
        "../../services/githubAPIService.js" + "?t=" + Date.now()
      );
      getPRDiff = module.getPRDiff;
    });

    test("should cache Octokit instances per installation ID", async () => {
      // First call - should create new Octokit
      await getPRDiff(12345, "owner", "repo", 1);
      expect(authCallCount).toBe(1);

      // Second call with same installation ID - should use cache
      await getPRDiff(12345, "owner", "repo", 2);
      expect(authCallCount).toBe(1);

      // Call with different installation ID - should create new Octokit
      await getPRDiff(67890, "owner", "repo", 1);
      expect(authCallCount).toBe(2);
    });
  });
});
