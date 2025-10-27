// Mock webhook payloads for various edge case scenarios

export const prWithNoDescription = {
  action: "opened",
  pull_request: {
    number: 1,
    title: "Add new feature",
    body: "",
    user: { login: "testuser" },
    base: { ref: "main" },
    head: { ref: "feature-branch" },
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

export const prWithExistingDescription = {
  action: "opened",
  pull_request: {
    number: 2,
    title: "Update documentation",
    body: "This is an existing description that will be overwritten",
    user: { login: "contributor" },
    base: { ref: "main" },
    head: { ref: "docs-update" },
    additions: 20,
    deletions: 5,
    changed_files: 1,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithOnlyWhitespaceChanges = {
  action: "opened",
  pull_request: {
    number: 3,
    title: "Fix indentation",
    body: null,
    user: { login: "formatter" },
    base: { ref: "main" },
    head: { ref: "fix-formatting" },
    additions: 100,
    deletions: 100,
    changed_files: 5,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithBinaryFiles = {
  action: "opened",
  pull_request: {
    number: 4,
    title: "Add logo image",
    body: "",
    user: { login: "designer" },
    base: { ref: "main" },
    head: { ref: "add-assets" },
    additions: 0,
    deletions: 0,
    changed_files: 3,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithMergeConflicts = {
  action: "opened",
  pull_request: {
    number: 5,
    title: "Merge feature into main",
    body: "",
    user: { login: "developer" },
    base: { ref: "main" },
    head: { ref: "conflict-branch" },
    additions: 75,
    deletions: 30,
    changed_files: 4,
    mergeable: false,
    mergeable_state: "dirty",
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithSingleCommit = {
  action: "opened",
  pull_request: {
    number: 6,
    title: "Quick fix",
    body: "",
    user: { login: "hotfixer" },
    base: { ref: "main" },
    head: { ref: "hotfix" },
    additions: 5,
    deletions: 2,
    changed_files: 1,
    commits: 1,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithManyCommits = {
  action: "opened",
  pull_request: {
    number: 7,
    title: "Large refactoring",
    body: "",
    user: { login: "refactorer" },
    base: { ref: "main" },
    head: { ref: "major-refactor" },
    additions: 500,
    deletions: 300,
    changed_files: 25,
    commits: 53,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const prWithEmptyCommitMessages = {
  action: "opened",
  pull_request: {
    number: 8,
    title: "Update files",
    body: "",
    user: { login: "silentdev" },
    base: { ref: "main" },
    head: { ref: "silent-updates" },
    additions: 30,
    deletions: 10,
    changed_files: 3,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const malformedWebhookPayload = {
  action: "opened",
  // Missing critical fields
  repository: {
    owner: { login: "testorg" },
  },
};

export const webhookWithMaliciousContent = {
  action: "opened",
  pull_request: {
    number: 9,
    title: "<script>alert('XSS')</script>",
    body: "'; DROP TABLE users; --",
    user: { login: "attacker" },
    base: { ref: "main'; DROP TABLE repos; --" },
    head: { ref: "malicious" },
    additions: 1,
    deletions: 0,
    changed_files: 1,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};

export const nonOpenedAction = {
  action: "edited",
  pull_request: {
    number: 10,
    title: "Some PR",
    body: "Updated description",
    user: { login: "editor" },
    base: { ref: "main" },
    head: { ref: "edit-test" },
    additions: 10,
    deletions: 5,
    changed_files: 2,
  },
  repository: {
    owner: { login: "testorg" },
    name: "testrepo",
  },
  installation: { id: 12345 },
};
