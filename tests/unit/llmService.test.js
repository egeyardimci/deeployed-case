import { describe, test, expect, mock, beforeEach } from "bun:test";

describe("Unit Tests - llmService", () => {
  beforeEach(() => {
    mock.restore();
  });

  describe("callLLMService", () => {
    test("should throw error when Groq API fails", async () => {
      mock.module("groq-sdk/index.mjs", () => ({
        default: class Groq {
          chat = {
            completions: {
              create: mock(() =>
                Promise.reject(new Error("API rate limit exceeded"))
              ),
            },
          };
        },
      }));

      const { callLLMService } = await import(
        "../../services/llmService.js?t=" + Date.now()
      );

      try {
        await callLLMService("system", "user");
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error.message).toBe(
          "Failed to generate PR description via LLM service"
        );
      }
    });
  });
});
