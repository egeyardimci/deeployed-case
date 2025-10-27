// Test helper functions

/**
 * Converts webhook payload to request-like object for testing
 */
export function createMockRequest(payload) {
  return {
    body: payload,
  };
}

/**
 * Wrapper function to handle webhook service call with proper error handling
 */
export async function handleWebhookEvent(webhookService, payload) {
  try {
    const req = createMockRequest(payload);
    const result = await webhookService(req);
    return result;
  } catch (error) {
    return {
      success: false,
      message: `Error: ${error.message}`,
    };
  }
}

/**
 * Creates a mock GitHub API service with customizable behavior
 */
export function createMockGitHubService({
  diffResponse,
  commitsResponse,
  updateResponse,
  diffError,
  commitsError,
  updateError,
}) {
  return {
    getPRDiff: diffError
      ? () => Promise.reject(diffError)
      : () => Promise.resolve(diffResponse),
    getPRCommits: commitsError
      ? () => Promise.reject(commitsError)
      : () => Promise.resolve(commitsResponse),
    updatePRDescription: updateError
      ? () => Promise.reject(updateError)
      : () => Promise.resolve(updateResponse || { status: 200 }),
  };
}

/**
 * Creates a mock LLM service with customizable behavior
 */
export function createMockLLMService({ response, error }) {
  return {
    callLLMService: error
      ? () => Promise.reject(error)
      : () => Promise.resolve(response),
  };
}
