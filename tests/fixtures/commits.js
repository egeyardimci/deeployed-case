// Mock commit history responses

export const singleCommit = [
  {
    sha: "abc123",
    commit: {
      message: "Fix critical bug in authentication",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T10:30:00Z",
      },
    },
  },
];

export const multipleCommits = [
  {
    sha: "abc123",
    commit: {
      message: "Add user authentication",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T10:30:00Z",
      },
    },
  },
  {
    sha: "def456",
    commit: {
      message: "Add middleware for auth",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T11:00:00Z",
      },
    },
  },
  {
    sha: "ghi789",
    commit: {
      message: "Add tests for authentication",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T11:30:00Z",
      },
    },
  },
];

export const emptyCommitMessages = [
  {
    sha: "abc123",
    commit: {
      message: "",
      author: {
        name: "Silent Dev",
        email: "silent@example.com",
        date: "2025-01-15T10:30:00Z",
      },
    },
  },
  {
    sha: "def456",
    commit: {
      message: "   ",
      author: {
        name: "Silent Dev",
        email: "silent@example.com",
        date: "2025-01-15T11:00:00Z",
      },
    },
  },
  {
    sha: "ghi789",
    commit: {
      message: null,
      author: {
        name: "Silent Dev",
        email: "silent@example.com",
        date: "2025-01-15T11:30:00Z",
      },
    },
  },
];

export const manyCommits = Array.from({ length: 53 }, (_, i) => ({
  sha: `commit${i}`,
  commit: {
    message: `Refactor step ${i + 1}: Update module ${String.fromCharCode(
      65 + (i % 26)
    )}`,
    author: {
      name: "Refactorer",
      email: "refactor@example.com",
      date: new Date(Date.now() - i * 3600000).toISOString(),
    },
  },
}));

export const commitsWithMaliciousContent = [
  {
    sha: "mal123",
    commit: {
      message: "<script>alert('XSS')</script> Fix security issue",
      author: {
        name: "'; DROP TABLE users; --",
        email: "attacker@evil.com",
        date: "2025-01-15T10:30:00Z",
      },
    },
  },
  {
    sha: "mal456",
    commit: {
      message: "Update config\n\n$(rm -rf /)",
      author: {
        name: "Attacker",
        email: "attacker@evil.com",
        date: "2025-01-15T11:00:00Z",
      },
    },
  },
];

export const commitsWithSpecialCharacters = [
  {
    sha: "special123",
    commit: {
      message: "Fix issue with 'quotes' and \"double quotes\"",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T10:30:00Z",
      },
    },
  },
  {
    sha: "special456",
    commit: {
      message: "Update\nwith\nmultiple\nlines\n\nAnd paragraphs",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T11:00:00Z",
      },
    },
  },
  {
    sha: "special789",
    commit: {
      message: "Add support for émojis 🎉 and üñíçödé",
      author: {
        name: "Developer",
        email: "dev@example.com",
        date: "2025-01-15T11:30:00Z",
      },
    },
  },
];
