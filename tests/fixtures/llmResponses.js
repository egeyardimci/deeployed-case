// Mock LLM API responses

export const successfulResponse = {
  choices: [
    {
      message: {
        role: "assistant",
        content: `## Summary
This PR adds user authentication functionality to the application.

## Changes Made
- Implemented token-based authentication system
- Added authentication middleware for route protection
- Created comprehensive test suite for auth functions

## Technical Details
- Uses JWT tokens for secure authentication
- Validates tokens before allowing access to protected routes
- Proper error handling with meaningful error messages

## Testing
- Added unit tests for authentication functions
- Tests cover success cases and error scenarios
- All tests passing with 100% coverage`,
      },
      finish_reason: "stop",
    },
  ],
  usage: {
    prompt_tokens: 500,
    completion_tokens: 150,
    total_tokens: 650,
  },
};

export const emptyResponse = {
  choices: [
    {
      message: {
        role: "assistant",
        content: "",
      },
      finish_reason: "stop",
    },
  ],
};

export const nullResponse = {
  choices: [
    {
      message: {
        role: "assistant",
        content: null,
      },
      finish_reason: "stop",
    },
  ],
};

export const malformedResponse = {
  choices: null,
};

export const truncatedResponse = {
  choices: [
    {
      message: {
        role: "assistant",
        content: "## Summary\nThis PR adds authentication but the response was truncated due to",
      },
      finish_reason: "length",
    },
  ],
  usage: {
    prompt_tokens: 2500,
    completion_tokens: 3000,
    total_tokens: 5500,
  },
};

export const responseWithMaliciousContent = {
  choices: [
    {
      message: {
        role: "assistant",
        content: `## Summary
<script>alert('XSS')</script>
This PR contains some changes.

## SQL Injection Attempt
'; DROP TABLE users; --

## Command Injection
$(rm -rf /)`,
      },
      finish_reason: "stop",
    },
  ],
};
