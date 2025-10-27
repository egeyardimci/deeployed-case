# Tests Documentation

This directory contains the comprehensive test suite for the GitHub PR Auto-Description Bot. The tests are organized into unit tests, integration tests, and end-to-end tests to ensure code quality and reliability.

## Test Structure

```
tests/
├── unit/                           # Unit tests for individual services
│   ├── githubAPIService.test.js   # Tests for GitHub API interactions
│   ├── llmService.test.js         # Tests for LLM service calls
│   └── prDescriptionService.test.js # Tests for PR description generation
├── integration/                    # Integration tests for component interactions
│   └── webhookFlow.test.js        # Tests for complete webhook processing flow
├── e2e/                           # End-to-end tests for edge cases
│   └── edgeCases.test.js          # Tests for various PR scenarios
├── fixtures/                      # Test data and mock payloads
│   ├── commits.js                 # Mock commit data
│   ├── llmResponses.js            # Mock LLM responses
│   ├── prDiffs.js                 # Mock PR diff data
│   └── webhookPayloads.js         # Mock webhook payloads
└── helpers/                       # Test utility functions
    └── testHelpers.js             # Reusable test helpers
```

## Test Types

### Unit Tests

Unit tests verify individual services in isolation with mocked dependencies.

**githubAPIService.test.js**

- Tests fetching PR diffs and commits
- Tests updating PR descriptions

**llmService.test.js**

- Tests LLM service API calls

**prDescriptionService.test.js**

- Tests PR description generation logic
- Tests combining commits and diffs
- Tests formatting of generated descriptions

### Integration Tests

Integration tests verify that multiple components work together correctly.

**webhookFlow.test.js**

- Tests the complete flow from webhook receipt to PR update
- Verifies proper data flow between services
- Tests that generated descriptions are correctly applied to PRs

### End-to-End Tests

End-to-end tests simulate real-world scenarios and edge cases.

**edgeCases.test.js**

- PR with only whitespace changes
- PR with binary files
- PR with merge conflicts
- PR with many commits (50+)
- PR with empty diffs

## Running Tests

### Run All Tests

```bash
bun test
```

### Run Tests in Watch Mode

```bash
bun run test:watch
```

### Run Tests with Coverage

```bash
bun run test:coverage
```

### Run Specific Test File

```bash
bun test tests/unit/githubAPIService.test.js
```

### Run Specific Test Suite

```bash
bun test --test-name-pattern "Unit Tests - githubAPIService"
```

## Test Fixtures

Test fixtures provide consistent mock data across tests:

- **commits.js**: Mock commit objects with various message formats
- **llmResponses.js**: Mock responses from the LLM service
- **prDiffs.js**: Mock PR diffs including edge cases (empty, binary, conflicts)
- **webhookPayloads.js**: Mock GitHub webhook payloads for different PR scenarios

## Test Helpers

The `testHelpers.js` module provides reusable utilities:

- `createMockRequest(payload)`: Wraps webhook payload in request format
- `handleWebhookEvent(webhookService, payload)`: Safely handles webhook events
- `createMockGitHubService(options)`: Creates configurable GitHub API mocks
- `createMockLLMService(options)`: Creates configurable LLM service mocks
